import { readFile } from "node:fs/promises";
import path from "node:path";

const COMMUNITY_DATA_ROOTS = new Set(["data", "uploads"]);
const EVENT_EXPORT_PATH =
  process.env.COMMUNITY_EVENTS_EXPORT_PATH ||
  process.env.EVENTS_EXPORT_PATH ||
  process.env.COMMUNITY_DATABASE_EXPORT_PATH ||
  "";

const EVENT_RECORD_ARRAY_KEYS = new Set([
  "data",
  "events",
  "hostedevents",
  "items",
  "records",
  "upcomingevents",
]);
const ID_KEYS = new Set(["eventid", "id", "slug", "uid"]);
const TYPE_KEYS = new Set(["category", "eventtype", "format", "type"]);
const TITLE_KEYS = new Set(["eventname", "eventtitle", "name", "title"]);
const DATE_LABEL_KEYS = new Set(["date", "datelabel", "displaydate", "when"]);
const START_DATE_KEYS = new Set(["start", "startdate", "starts", "startsat"]);
const END_DATE_KEYS = new Set(["end", "enddate", "ends", "endsat"]);
const LOCATION_KEYS = new Set(["city", "location", "place", "venue"]);
const DESCRIPTION_KEYS = new Set(["description", "summary", "tagline"]);
const ATTENDING_KEYS = new Set(["attendees", "attending", "registrationcount", "registrations", "rsvps"]);
const ACTION_KEYS = new Set(["action", "ctalabel", "label"]);
const HREF_KEYS = new Set(["actionurl", "ctalink", "href", "registrationurl", "rsvpurl", "url"]);
const IMAGE_KEYS = new Set(["banner", "bannerurl", "image", "imageurl", "photourl", "thumbnail"]);
const IMAGE_ALT_KEYS = new Set(["alt", "imagealt", "imagealttext"]);
const STATUS_KEYS = new Set(["status", "state", "visibility"]);
const ORGANIZER_KEYS = new Set([
  "host",
  "hostname",
  "leader",
  "organizer",
  "organizername",
  "owner",
  "volunteerleader",
]);
const PARTNER_KEYS = new Set(["partner", "partners", "sponsor", "sponsors", "supporter", "supporters"]);
const HIDDEN_STATUSES = new Set(["archived", "cancelled", "canceled", "draft", "hidden", "private"]);

export type EventCardData = {
  id: string;
  type: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attending: number | null;
  action: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  startTime: number | null;
};

export type EventSectionStats = {
  eventsHosted: number | null;
  citiesRepresented: number | null;
  volunteerLeaders: number | null;
  partnersSupporters: number | null;
};

export type EventSectionData = {
  configured: boolean;
  source: "event-export" | null;
  events: EventCardData[];
  stats: EventSectionStats;
};

type EventRecord = Record<string, unknown>;

function isRecord(value: unknown): value is EventRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function cleanText(value: unknown, fallback = "", maxLength = 220): string {
  if (typeof value !== "string" && typeof value !== "number") {
    return fallback;
  }

  const cleaned = String(value).trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return fallback;
  }

  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1).trim()}...` : cleaned;
}

function cleanToken(value: unknown): string | null {
  const cleaned = cleanText(value, "", 160).replace(/^["']|["']$/g, "");
  const normalized = cleaned.toLowerCase();

  if (
    !cleaned ||
    normalized === "n/a" ||
    normalized === "na" ||
    normalized === "none" ||
    normalized === "null" ||
    normalized === "undefined" ||
    normalized === "unknown"
  ) {
    return null;
  }

  return normalized;
}

function getField(record: EventRecord, keys: Set<string>): unknown {
  for (const [key, value] of Object.entries(record)) {
    if (keys.has(normalizeKey(key))) {
      return value;
    }
  }

  return undefined;
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

function toSafeHref(value: unknown): string {
  const href = cleanText(value, "#subscribe", 500);
  if (
    href === "#subscribe" ||
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }

  return "#subscribe";
}

function toSafeImageUrl(value: unknown): string {
  const imageUrl = cleanText(value, "/assets/2.png", 500);
  if (imageUrl.startsWith("/") || imageUrl.startsWith("https://") || imageUrl.startsWith("http://")) {
    return imageUrl;
  }

  return "/assets/2.png";
}

function parseDateTime(value: unknown): number | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const time = Date.parse(String(value));
  return Number.isFinite(time) ? time : null;
}

function formatSingleDate(time: number): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(time));
}

function formatDateLabel(record: EventRecord): string {
  const explicitLabel = cleanText(getField(record, DATE_LABEL_KEYS), "", 80);
  if (explicitLabel) {
    return explicitLabel;
  }

  const startTime = parseDateTime(getField(record, START_DATE_KEYS));
  const endTime = parseDateTime(getField(record, END_DATE_KEYS));
  if (startTime === null) {
    return "Date to be announced";
  }

  if (endTime === null || formatSingleDate(startTime) === formatSingleDate(endTime)) {
    return formatSingleDate(startTime);
  }

  return `${formatSingleDate(startTime)} - ${formatSingleDate(endTime)}`;
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

function parseDelimitedRecords(file: string): EventRecord[] {
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
    return headers.reduce<EventRecord>((record, header, index) => {
      record[header] = cells[index] ?? "";
      return record;
    }, {});
  });
}

function looksLikeEventRecord(record: EventRecord): boolean {
  const title = cleanText(getField(record, TITLE_KEYS));
  if (!title) {
    return false;
  }

  return [
    DATE_LABEL_KEYS,
    START_DATE_KEYS,
    LOCATION_KEYS,
    DESCRIPTION_KEYS,
    TYPE_KEYS,
    HREF_KEYS,
    IMAGE_KEYS,
  ].some(keys => getField(record, keys) !== undefined);
}

function collectEventRecords(value: unknown, depth = 0): EventRecord[] {
  if (depth > 5) {
    return [];
  }

  if (Array.isArray(value)) {
    const records = value.filter(isRecord);
    if (records.length > 0 && records.some(looksLikeEventRecord)) {
      return records;
    }

    return value.flatMap(item => collectEventRecords(item, depth + 1));
  }

  if (!isRecord(value)) {
    return [];
  }

  const directRecords = Object.entries(value).flatMap(([key, fieldValue]) => {
    if (EVENT_RECORD_ARRAY_KEYS.has(normalizeKey(key))) {
      return collectEventRecords(fieldValue, depth + 1);
    }

    return [];
  });

  if (directRecords.length > 0) {
    return directRecords;
  }

  return Object.values(value).flatMap(fieldValue => collectEventRecords(fieldValue, depth + 1));
}

function parseJsonRecords(file: string): EventRecord[] | null {
  try {
    return collectEventRecords(JSON.parse(file) as unknown);
  } catch {
    return null;
  }
}

function addTokenValue(value: unknown, tokens: Set<string>) {
  if (typeof value === "string" || typeof value === "number") {
    const token = cleanToken(value);
    if (token) {
      tokens.add(token);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach(item => addTokenValue(item, tokens));
    return;
  }

  if (isRecord(value)) {
    const namedValue = value.name || value.label || value.title || value.value;
    if (namedValue !== undefined) {
      addTokenValue(namedValue, tokens);
    }
  }
}

function recordIsVisible(record: EventRecord): boolean {
  const status = cleanToken(getField(record, STATUS_KEYS));
  return !status || !HIDDEN_STATUSES.has(status);
}

function toEventCard(record: EventRecord, index: number): EventCardData | null {
  if (!recordIsVisible(record)) {
    return null;
  }

  const title = cleanText(getField(record, TITLE_KEYS), "", 88);
  if (!title) {
    return null;
  }

  const explicitId = cleanText(getField(record, ID_KEYS), "", 120);
  const type = cleanText(getField(record, TYPE_KEYS), "Event", 40);
  const location = cleanText(getField(record, LOCATION_KEYS), "Location to be announced", 80);
  const description = cleanText(getField(record, DESCRIPTION_KEYS), "Details will be shared soon.", 160);
  const action = cleanText(getField(record, ACTION_KEYS), "RSVP", 32);
  const startTime = parseDateTime(getField(record, START_DATE_KEYS)) ?? parseDateTime(getField(record, DATE_LABEL_KEYS));
  const imageAlt = cleanText(getField(record, IMAGE_ALT_KEYS), `${title} event image`, 120);
  const generatedId = [title, formatDateLabel(record), location]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id: explicitId || generatedId || `event-${index}`,
    type,
    title,
    date: formatDateLabel(record),
    location,
    description,
    attending: toNonNegativeInteger(getField(record, ATTENDING_KEYS)),
    action,
    href: toSafeHref(getField(record, HREF_KEYS)),
    imageUrl: toSafeImageUrl(getField(record, IMAGE_KEYS)),
    imageAlt,
    startTime,
  };
}

function uniqueEvents(events: EventCardData[]): EventCardData[] {
  const seen = new Set<string>();
  const unique: EventCardData[] = [];

  for (const event of events) {
    const key = event.id || `${event.title}-${event.date}-${event.location}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(event);
  }

  return unique.sort((first, second) => {
    if (first.startTime === null && second.startTime === null) {
      return 0;
    }

    if (first.startTime === null) {
      return 1;
    }

    if (second.startTime === null) {
      return -1;
    }

    return first.startTime - second.startTime;
  });
}

function buildStats(records: EventRecord[], events: EventCardData[]): EventSectionStats {
  const cities = new Set<string>();
  const leaders = new Set<string>();
  const partners = new Set<string>();

  for (const record of records) {
    const city = cleanToken(getField(record, LOCATION_KEYS));
    if (city) {
      cities.add(city);
    }

    addTokenValue(getField(record, ORGANIZER_KEYS), leaders);
    addTokenValue(getField(record, PARTNER_KEYS), partners);
  }

  return {
    eventsHosted: events.length > 0 ? events.length : null,
    citiesRepresented: cities.size > 0 ? cities.size : null,
    volunteerLeaders: leaders.size > 0 ? leaders.size : null,
    partnersSupporters: partners.size > 0 ? partners.size : null,
  };
}

function resolveEventDataPath(configPath: string): string {
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
    throw new Error("COMMUNITY_EVENTS_EXPORT_PATH must point inside ./data or ./uploads.");
  }

  return rootDirectory === "uploads"
    ? path.join(process.cwd(), "uploads", ...relativeSegments)
    : path.join(process.cwd(), "data", ...relativeSegments);
}

export async function getEventSectionData(): Promise<EventSectionData> {
  if (!EVENT_EXPORT_PATH) {
    return {
      configured: false,
      source: null,
      events: [],
      stats: {
        eventsHosted: null,
        citiesRepresented: null,
        volunteerLeaders: null,
        partnersSupporters: null,
      },
    };
  }

  const file = await readFile(resolveEventDataPath(EVENT_EXPORT_PATH), "utf8");
  const records = parseJsonRecords(file) ?? parseDelimitedRecords(file);
  const visibleRecords = records.filter(recordIsVisible);
  const events = uniqueEvents(
    visibleRecords
      .map((record, index) => toEventCard(record, index))
      .filter((event): event is EventCardData => event !== null),
  );

  return {
    configured: true,
    source: "event-export",
    events,
    stats: buildStats(visibleRecords, events),
  };
}
