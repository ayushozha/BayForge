import { readFile } from "node:fs/promises";
import path from "node:path";

const COMMUNITY_DATA_ROOTS = new Set(["data", "uploads"]);
const NEWSLETTER_EXPORT_PATH =
  process.env.COMMUNITY_NEWSLETTER_EXPORT_PATH || process.env.NEWSLETTER_CONTENT_EXPORT_PATH || "";

const NEWSLETTER_RECORD_ARRAY_KEYS = new Set(["content", "data", "items", "newsletter", "records", "sections"]);
const SECTION_KEYS = new Set(["key", "name", "section", "slug", "type"]);
const TITLE_KEYS = new Set(["headline", "heading", "title"]);
const EMAIL_LABEL_KEYS = new Set(["emaillabel", "inputlabel", "label"]);
const PLACEHOLDER_KEYS = new Set(["emailplaceholder", "inputplaceholder", "placeholder"]);
const BUTTON_LABEL_KEYS = new Set(["button", "buttonlabel", "cta", "ctalabel", "submitlabel"]);
const SUBMITTING_LABEL_KEYS = new Set(["loadinglabel", "submittinglabel"]);
const HELPER_TEXT_KEYS = new Set(["description", "helper", "helpertext", "status", "subcopy"]);
const COUNTER_TEXT_KEYS = new Set(["counter", "countercopy", "countertext"]);
const SOURCE_KEYS = new Set(["formsource", "source", "tracking"]);
const STATUS_KEYS = new Set(["published", "status", "state", "visibility"]);
const HIDDEN_STATUSES = new Set(["archived", "draft", "false", "hidden", "inactive", "no", "private", "unpublished"]);

export type NewsletterContent = {
  title: string;
  emailLabel: string;
  placeholder: string;
  buttonLabel: string;
  submittingLabel: string;
  helperText: string;
  counterText: string | null;
  source: string;
};

export type NewsletterData = {
  configured: boolean;
  source: "newsletter-export" | null;
  content: NewsletterContent | null;
};

type NewsletterRecord = Record<string, unknown>;

function isRecord(value: unknown): value is NewsletterRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cleanText(value: unknown, fallback = "", maxLength = 220): string {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return fallback;
  }

  const cleaned = String(value).trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return fallback;
  }

  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trim()}...` : cleaned;
}

function getField(record: NewsletterRecord, keys: Set<string>): unknown {
  for (const [key, value] of Object.entries(record)) {
    if (keys.has(normalizeKey(key))) {
      return value;
    }
  }

  return undefined;
}

function delimiterCount(line: string, delimiter: string): number {
  let count = 0;
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      inQuotes = !inQuotes;
    } else if (character === delimiter && !inQuotes) {
      count += 1;
    }
  }

  return count;
}

function detectDelimiter(headerLine: string): string {
  return [",", "\t", ";"].reduce((bestDelimiter, delimiter) =>
    delimiterCount(headerLine, delimiter) > delimiterCount(headerLine, bestDelimiter)
      ? delimiter
      : bestDelimiter,
  ",");
}

function parseDelimitedLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && inQuotes && nextCharacter === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += character;
  }

  cells.push(current.trim());
  return cells;
}

function parseDelimitedRecords(file: string): NewsletterRecord[] {
  const lines = file
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseDelimitedLine(lines[0], delimiter);
  return lines.slice(1).map(line => {
    const cells = parseDelimitedLine(line, delimiter);
    return headers.reduce<NewsletterRecord>((record, header, index) => {
      record[header] = cells[index] ?? "";
      return record;
    }, {});
  });
}

function looksLikeNewsletterRecord(record: NewsletterRecord): boolean {
  return Boolean(
    cleanText(getField(record, TITLE_KEYS)) ||
      cleanText(getField(record, BUTTON_LABEL_KEYS)) ||
      cleanText(getField(record, HELPER_TEXT_KEYS)),
  );
}

function collectNewsletterRecords(value: unknown, depth = 0): NewsletterRecord[] {
  if (depth > 5) {
    return [];
  }

  if (Array.isArray(value)) {
    const records = value.filter(isRecord);
    if (records.length > 0 && records.some(looksLikeNewsletterRecord)) {
      return records;
    }

    return value.flatMap(item => collectNewsletterRecords(item, depth + 1));
  }

  if (!isRecord(value)) {
    return [];
  }

  if (looksLikeNewsletterRecord(value)) {
    return [value];
  }

  const directRecords = Object.entries(value).flatMap(([key, fieldValue]) => {
    if (NEWSLETTER_RECORD_ARRAY_KEYS.has(normalizeKey(key))) {
      return collectNewsletterRecords(fieldValue, depth + 1);
    }

    return [];
  });

  if (directRecords.length > 0) {
    return directRecords;
  }

  return Object.values(value).flatMap(fieldValue => collectNewsletterRecords(fieldValue, depth + 1));
}

function parseJsonRecords(file: string): NewsletterRecord[] | null {
  try {
    return collectNewsletterRecords(JSON.parse(file) as unknown);
  } catch {
    return null;
  }
}

function recordIsNewsletter(record: NewsletterRecord): boolean {
  const section = cleanText(getField(record, SECTION_KEYS)).toLowerCase();
  return !section || section === "newsletter" || section === "footer-newsletter";
}

function recordIsVisible(record: NewsletterRecord): boolean {
  const published = getField(record, STATUS_KEYS);
  if (typeof published === "boolean") {
    return published;
  }

  const status = cleanText(published).toLowerCase();
  return !status || !HIDDEN_STATUSES.has(status);
}

function toNewsletterContent(record: NewsletterRecord): NewsletterContent | null {
  if (!recordIsNewsletter(record) || !recordIsVisible(record)) {
    return null;
  }

  const title = cleanText(getField(record, TITLE_KEYS), "", 120);
  const emailLabel = cleanText(getField(record, EMAIL_LABEL_KEYS), "", 80);
  const placeholder = cleanText(getField(record, PLACEHOLDER_KEYS), "", 120);
  const buttonLabel = cleanText(getField(record, BUTTON_LABEL_KEYS), "", 80);
  const helperText = cleanText(getField(record, HELPER_TEXT_KEYS), "", 180);

  if (!title || !emailLabel || !placeholder || !buttonLabel || !helperText) {
    return null;
  }

  return {
    title,
    emailLabel,
    placeholder,
    buttonLabel,
    submittingLabel: cleanText(getField(record, SUBMITTING_LABEL_KEYS), "Joining...", 80),
    helperText,
    counterText: cleanText(getField(record, COUNTER_TEXT_KEYS), "", 180) || null,
    source: cleanText(getField(record, SOURCE_KEYS), "footer-newsletter", 80),
  };
}

function resolveNewsletterDataPath(configPath: string): string {
  const pathSegments = configPath
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .split("/")
    .filter(Boolean);
  const [rootDirectory, ...relativeSegments] = pathSegments;

  if (
    !rootDirectory ||
    !COMMUNITY_DATA_ROOTS.has(rootDirectory) ||
    relativeSegments.length === 0 ||
    relativeSegments.some(segment => segment === "..")
  ) {
    throw new Error("COMMUNITY_NEWSLETTER_EXPORT_PATH must point inside ./data or ./uploads.");
  }

  return rootDirectory === "uploads"
    ? path.join(process.cwd(), "uploads", ...relativeSegments)
    : path.join(process.cwd(), "data", ...relativeSegments);
}

export async function getNewsletterData(): Promise<NewsletterData> {
  if (!NEWSLETTER_EXPORT_PATH) {
    return {
      configured: false,
      source: null,
      content: null,
    };
  }

  const file = await readFile(resolveNewsletterDataPath(NEWSLETTER_EXPORT_PATH), "utf8");
  const records = parseJsonRecords(file) ?? parseDelimitedRecords(file);
  const content =
    records
      .map(record => toNewsletterContent(record))
      .find((record): record is NewsletterContent => record !== null) ?? null;

  return {
    configured: true,
    source: "newsletter-export",
    content,
  };
}
