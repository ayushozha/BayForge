import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_WAITLIST_URL = "https://emailwaitlist.ayushojha.com/api/v1/subscribe";

export const waitlistUrl = process.env.WAITLIST_API_URL || DEFAULT_WAITLIST_URL;

export const waitlistStatsUrl =
  process.env.WAITLIST_STATS_URL || waitlistUrl.replace(/\/subscribe\/?$/, "/stats");

const rawWaitlistApiKey = process.env.WAITLIST_API_KEY?.trim() || "";

export const waitlistApiKey =
  rawWaitlistApiKey === "wl_your_project_api_key" ? "" : rawWaitlistApiKey;
export const communityEmailListPath =
  process.env.COMMUNITY_EMAIL_LIST_PATH || process.env.EMAIL_LIST_PATH || "";
export const communityDatabaseExportPath = process.env.COMMUNITY_DATABASE_EXPORT_PATH || "";

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const COMMUNITY_DATA_ROOTS = new Set(["data", "uploads"]);
const COLLEGE_FIELD_KEYS = new Set([
  "college",
  "collegename",
  "school",
  "schoolname",
  "university",
  "universityname",
  "institution",
  "institutionname",
]);
const COLLEGE_COUNT_KEYS = new Set([
  "colleges",
  "collegerepresented",
  "collegecount",
  "collegescount",
  "collegesrepresented",
  "schools",
  "schoolrepresented",
  "schoolcount",
  "schoolsrepresented",
  "universities",
  "universityrepresented",
  "universitycount",
  "universitiesrepresented",
  "institutions",
  "institutionrepresented",
  "institutioncount",
  "institutionsrepresented",
]);
const COUNT_VALUE_KEYS = ["count", "total", "value"];

type CommunityStatsSource = "email-waitlist" | "email-list" | "database-export";

type CommunityStats = {
  source: CommunityStatsSource | null;
  total: number | null;
  collegesRepresented: number | null;
  collegesSource?: CommunityStatsSource | null;
  today?: unknown;
  this_week?: unknown;
  this_month?: unknown;
};

type ParsedCommunityDataFile = {
  emails: Set<string>;
  collegesRepresented: number | null;
};

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toNonNegativeInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.round(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().replace(/[,+\s]/g, "");
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const count = Number(normalized);
  return Number.isFinite(count) && count >= 0 ? Math.round(count) : null;
}

function cleanCollegeName(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim().replace(/^["']|["']$/g, "").replace(/\s+/g, " ");
  const normalized = cleaned.toLowerCase();

  if (
    !cleaned ||
    normalized === "n/a" ||
    normalized === "na" ||
    normalized === "none" ||
    normalized === "unknown" ||
    normalized === "null" ||
    normalized === "undefined"
  ) {
    return null;
  }

  return normalized;
}

function addCollegeValue(value: unknown, colleges: Set<string>) {
  if (typeof value === "string") {
    const college = cleanCollegeName(value);
    if (college) {
      colleges.add(college);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => addCollegeValue(item, colleges));
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  const namedValue = value.name || value.label || value.title || value.value;
  if (typeof namedValue === "string") {
    addCollegeValue(namedValue, colleges);
    return;
  }

  for (const key of Object.keys(value)) {
    const college = cleanCollegeName(key);
    if (college) {
      colleges.add(college);
    }
  }
}

function collectCollegeNamesFromJson(value: unknown, colleges: Set<string>, depth = 0) {
  if (depth > 5) {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => collectCollegeNamesFromJson(item, colleges, depth + 1));
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, fieldValue] of Object.entries(value)) {
    if (COLLEGE_FIELD_KEYS.has(normalizeKey(key))) {
      addCollegeValue(fieldValue, colleges);
    } else {
      collectCollegeNamesFromJson(fieldValue, colleges, depth + 1);
    }
  }
}

function countFromPotentialCollection(value: unknown): number | null {
  const directCount = toNonNegativeInteger(value);
  if (directCount !== null) {
    return directCount;
  }

  if (isRecord(value)) {
    for (const key of COUNT_VALUE_KEYS) {
      const count = toNonNegativeInteger(value[key]);
      if (count !== null) {
        return count;
      }
    }
  }

  const colleges = new Set<string>();
  addCollegeValue(value, colleges);
  return colleges.size > 0 ? colleges.size : null;
}

function findCountByKey(value: unknown, keys: Set<string>, depth = 0): number | null {
  if (depth > 5) {
    return null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const count = findCountByKey(item, keys, depth + 1);
      if (count !== null) {
        return count;
      }
    }
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const [key, fieldValue] of Object.entries(value)) {
    if (!keys.has(normalizeKey(key))) {
      continue;
    }

    const count = countFromPotentialCollection(fieldValue);
    if (count !== null) {
      return count;
    }
  }

  for (const fieldValue of Object.values(value)) {
    const count = findCountByKey(fieldValue, keys, depth + 1);
    if (count !== null) {
      return count;
    }
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

function getDelimitedCollegeCount(file: string): number | null {
  const lines = file
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseDelimitedLine(lines[0], delimiter);
  const collegeIndexes = headers
    .map((header, index) => (COLLEGE_FIELD_KEYS.has(normalizeKey(header)) ? index : -1))
    .filter(index => index >= 0);

  if (collegeIndexes.length === 0) {
    return null;
  }

  const colleges = new Set<string>();
  for (const line of lines.slice(1)) {
    const cells = parseDelimitedLine(line, delimiter);
    for (const index of collegeIndexes) {
      addCollegeValue(cells[index], colleges);
    }
  }

  return colleges.size > 0 ? colleges.size : null;
}

function parseCommunityDataFile(file: string): ParsedCommunityDataFile {
  const emails = new Set(
    Array.from(file.matchAll(EMAIL_PATTERN), match => match[0].toLowerCase()),
  );

  try {
    const json = JSON.parse(file) as unknown;
    const colleges = new Set<string>();
    collectCollegeNamesFromJson(json, colleges);

    return {
      emails,
      collegesRepresented:
        colleges.size > 0 ? colleges.size : findCountByKey(json, COLLEGE_COUNT_KEYS),
    };
  } catch {
    return {
      emails,
      collegesRepresented: getDelimitedCollegeCount(file),
    };
  }
}

function resolveCommunityDataPath(configPath: string, variableName: string): string {
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
    throw new Error(`${variableName} must point inside ./data or ./uploads.`);
  }

  return rootDirectory === "uploads"
    ? path.join(process.cwd(), "uploads", ...relativeSegments)
    : path.join(process.cwd(), "data", ...relativeSegments);
}

async function getWaitlistCommunityStats(): Promise<CommunityStats> {
  const upstream = await fetch(waitlistStatsUrl, {
    headers: { "X-API-Key": waitlistApiKey },
    cache: "no-store",
  });

  if (!upstream.ok) {
    throw new Error(`Stats request failed with ${upstream.status}`);
  }

  const stats = await upstream.json();
  const collegesRepresented = findCountByKey(stats, COLLEGE_COUNT_KEYS);
  return {
    source: "email-waitlist" as const,
    total: isRecord(stats) ? toNonNegativeInteger(stats.total) : null,
    collegesRepresented,
    collegesSource: collegesRepresented !== null ? "email-waitlist" as const : null,
    today: isRecord(stats) ? stats.today : undefined,
    this_week: isRecord(stats) ? stats.this_week : undefined,
    this_month: isRecord(stats) ? stats.this_month : undefined,
  };
}

export async function getUploadedEmailListStats(): Promise<CommunityStats | null> {
  const configuredFiles = [
    communityEmailListPath
      ? {
          path: communityEmailListPath,
          source: "email-list" as const,
          variableName: "COMMUNITY_EMAIL_LIST_PATH",
        }
      : null,
    communityDatabaseExportPath && communityDatabaseExportPath !== communityEmailListPath
      ? {
          path: communityDatabaseExportPath,
          source: "database-export" as const,
          variableName: "COMMUNITY_DATABASE_EXPORT_PATH",
        }
      : null,
  ].filter(Boolean);

  if (configuredFiles.length === 0) {
    return null;
  }

  const emails = new Set<string>();
  let collegesRepresented: number | null = null;
  let source: CommunityStatsSource = "email-list";
  let collegesSource: CommunityStatsSource | null = null;

  for (const configuredFile of configuredFiles) {
    if (!configuredFile) {
      continue;
    }

    const resolvedPath = resolveCommunityDataPath(
      configuredFile.path,
      configuredFile.variableName,
    );
    const file = await readFile(resolvedPath, "utf8");
    const parsedFile = parseCommunityDataFile(file);

    parsedFile.emails.forEach(email => emails.add(email));
    source = configuredFile.source === "database-export" ? "database-export" : source;

    if (parsedFile.collegesRepresented !== null) {
      collegesRepresented = Math.max(collegesRepresented ?? 0, parsedFile.collegesRepresented);
      collegesSource = configuredFile.source;
    }
  }

  return {
    source,
    total: emails.size > 0 ? emails.size : null,
    collegesRepresented,
    collegesSource,
  };
}

function hasCommunityStats(stats: CommunityStats): boolean {
  return typeof stats.total === "number" || typeof stats.collegesRepresented === "number";
}

export async function getCommunityStats(): Promise<CommunityStats> {
  let waitlistStats: CommunityStats | null = null;
  if (waitlistApiKey) {
    try {
      waitlistStats = await getWaitlistCommunityStats();
    } catch {
      // Fall through to configured local data files when the upstream stats API is unavailable.
    }
  }

  const uploadedListStats = await getUploadedEmailListStats();
  const mergedStats: CommunityStats = {
    source: waitlistStats?.source ?? uploadedListStats?.source ?? null,
    total: waitlistStats?.total ?? uploadedListStats?.total ?? null,
    collegesRepresented:
      waitlistStats?.collegesRepresented ?? uploadedListStats?.collegesRepresented ?? null,
    collegesSource: waitlistStats?.collegesSource ?? uploadedListStats?.collegesSource ?? null,
    today: waitlistStats?.today,
    this_week: waitlistStats?.this_week,
    this_month: waitlistStats?.this_month,
  };

  if (hasCommunityStats(mergedStats)) {
    return mergedStats;
  }

  return {
    source: null,
    total: null,
    collegesRepresented: null,
    collegesSource: null,
  };
}
