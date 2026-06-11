import { readFile } from "node:fs/promises";
import path from "node:path";

const COMMUNITY_DATA_ROOTS = new Set(["data", "uploads"]);
const SPONSORS_EXPORT_PATH =
  process.env.COMMUNITY_SPONSORS_EXPORT_PATH || process.env.SPONSORS_EXPORT_PATH || "";

const SPONSOR_RECORD_ARRAY_KEYS = new Set([
  "data",
  "items",
  "partners",
  "records",
  "sponsors",
  "supporters",
]);
const ID_KEYS = new Set(["id", "partnerid", "slug", "sponsorid", "uid"]);
const NAME_KEYS = new Set([
  "brand",
  "company",
  "companyname",
  "name",
  "organization",
  "organizationname",
  "partner",
  "partnername",
  "sponsor",
  "sponsorname",
]);
const TIER_KEYS = new Set(["category", "level", "package", "tier", "type"]);
const HREF_KEYS = new Set(["href", "link", "site", "url", "website", "websiteurl"]);
const LOGO_KEYS = new Set(["image", "imageurl", "logo", "logourl", "mark", "markurl"]);
const LOGO_ALT_KEYS = new Set(["alt", "logoalt", "logoalttext"]);
const STATUS_KEYS = new Set(["published", "status", "state", "visibility"]);
const ORDER_KEYS = new Set(["order", "position", "priority", "sort", "sortorder"]);
const HIDDEN_STATUSES = new Set([
  "archived",
  "draft",
  "false",
  "hidden",
  "inactive",
  "no",
  "private",
  "unpublished",
]);

export type SponsorData = {
  id: string;
  name: string;
  tier: string | null;
  href: string;
  logoUrl: string | null;
  logoAlt: string;
  order: number | null;
};

export type SponsorsData = {
  configured: boolean;
  source: "sponsor-export" | null;
  sponsors: SponsorData[];
};

type SponsorRecord = Record<string, unknown>;

function isRecord(value: unknown): value is SponsorRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cleanText(value: unknown, fallback = "", maxLength = 120): string {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return fallback;
  }

  const cleaned = String(value).trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return fallback;
  }

  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trim()}...` : cleaned;
}

function getField(record: SponsorRecord, keys: Set<string>): unknown {
  for (const [key, value] of Object.entries(record)) {
    if (keys.has(normalizeKey(key))) {
      return value;
    }
  }

  return undefined;
}

function toOptionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const number = Number(value.trim());
  return Number.isFinite(number) ? number : null;
}

function toSafeHref(value: unknown): string {
  const href = cleanText(value, "#", 500);
  if (
    href === "#" ||
    href.startsWith("/") ||
    href.startsWith("https://") ||
    href.startsWith("http://")
  ) {
    return href;
  }

  return "#";
}

function toSafeLogoUrl(value: unknown): string | null {
  const logoUrl = cleanText(value, "", 500);
  if (!logoUrl) {
    return null;
  }

  if (logoUrl.startsWith("/") || logoUrl.startsWith("https://") || logoUrl.startsWith("http://")) {
    return logoUrl;
  }

  return null;
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

function parseDelimitedRecords(file: string): SponsorRecord[] {
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
    return headers.reduce<SponsorRecord>((record, header, index) => {
      record[header] = cells[index] ?? "";
      return record;
    }, {});
  });
}

function looksLikeSponsorRecord(record: SponsorRecord): boolean {
  return Boolean(cleanText(getField(record, NAME_KEYS)));
}

function collectSponsorRecords(value: unknown, depth = 0): SponsorRecord[] {
  if (depth > 5) {
    return [];
  }

  if (Array.isArray(value)) {
    const scalarRecords = value
      .map(item => cleanText(item, "", 80))
      .filter(Boolean)
      .map(name => ({ name }));
    if (scalarRecords.length > 0) {
      return scalarRecords;
    }

    const records = value.filter(isRecord);
    if (records.length > 0 && records.some(looksLikeSponsorRecord)) {
      return records;
    }

    return value.flatMap(item => collectSponsorRecords(item, depth + 1));
  }

  if (!isRecord(value)) {
    return [];
  }

  const directRecords = Object.entries(value).flatMap(([key, fieldValue]) => {
    if (SPONSOR_RECORD_ARRAY_KEYS.has(normalizeKey(key))) {
      return collectSponsorRecords(fieldValue, depth + 1);
    }

    return [];
  });

  if (directRecords.length > 0) {
    return directRecords;
  }

  return Object.values(value).flatMap(fieldValue => collectSponsorRecords(fieldValue, depth + 1));
}

function parseJsonRecords(file: string): SponsorRecord[] | null {
  try {
    return collectSponsorRecords(JSON.parse(file) as unknown);
  } catch {
    return null;
  }
}

function recordIsVisible(record: SponsorRecord): boolean {
  const published = getField(record, STATUS_KEYS);
  if (typeof published === "boolean") {
    return published;
  }

  const status = cleanText(published).toLowerCase();
  return !status || !HIDDEN_STATUSES.has(status);
}

function toSponsor(record: SponsorRecord, index: number): SponsorData | null {
  if (!recordIsVisible(record)) {
    return null;
  }

  const name = cleanText(getField(record, NAME_KEYS), "", 80);
  if (!name) {
    return null;
  }

  const explicitId = cleanText(getField(record, ID_KEYS), "", 120);
  const href = toSafeHref(getField(record, HREF_KEYS));
  const idSource = explicitId || `${name}-${href}`;

  return {
    id:
      idSource
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `sponsor-${index}`,
    name,
    tier: cleanText(getField(record, TIER_KEYS), "", 48) || null,
    href,
    logoUrl: toSafeLogoUrl(getField(record, LOGO_KEYS)),
    logoAlt: cleanText(getField(record, LOGO_ALT_KEYS), `${name} logo`, 120),
    order: toOptionalNumber(getField(record, ORDER_KEYS)),
  };
}

function uniqueSponsors(sponsors: SponsorData[]): SponsorData[] {
  const seen = new Set<string>();
  const unique: SponsorData[] = [];

  for (const sponsor of sponsors) {
    const key = `${sponsor.name.toLowerCase()}-${sponsor.href}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(sponsor);
  }

  return unique.sort((first, second) => {
    if (first.order !== null && second.order !== null) {
      return first.order - second.order;
    }

    if (first.order !== null) {
      return -1;
    }

    if (second.order !== null) {
      return 1;
    }

    return first.name.localeCompare(second.name);
  });
}

function resolveSponsorDataPath(configPath: string): string {
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
    throw new Error("COMMUNITY_SPONSORS_EXPORT_PATH must point inside ./data or ./uploads.");
  }

  return rootDirectory === "uploads"
    ? path.join(process.cwd(), "uploads", ...relativeSegments)
    : path.join(process.cwd(), "data", ...relativeSegments);
}

export async function getSponsorsData(): Promise<SponsorsData> {
  if (!SPONSORS_EXPORT_PATH) {
    return {
      configured: false,
      source: null,
      sponsors: [],
    };
  }

  const file = await readFile(resolveSponsorDataPath(SPONSORS_EXPORT_PATH), "utf8");
  const records = parseJsonRecords(file) ?? parseDelimitedRecords(file);
  const sponsors = uniqueSponsors(
    records
      .map((record, index) => toSponsor(record, index))
      .filter((sponsor): sponsor is SponsorData => sponsor !== null),
  );

  return {
    configured: true,
    source: "sponsor-export",
    sponsors,
  };
}
