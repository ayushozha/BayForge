import { readFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_WAITLIST_URL = "https://emailwaitlist.ayushojha.com/api/v1/subscribe";

export const waitlistUrl = process.env.WAITLIST_API_URL || DEFAULT_WAITLIST_URL;

export const waitlistStatsUrl =
  process.env.WAITLIST_STATS_URL || waitlistUrl.replace(/\/subscribe\/?$/, "/stats");

export const waitlistApiKey = process.env.WAITLIST_API_KEY || "";
export const communityEmailListPath =
  process.env.COMMUNITY_EMAIL_LIST_PATH || process.env.EMAIL_LIST_PATH || "";

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const EMAIL_LIST_ROOTS = new Set(["data", "uploads"]);

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

async function getWaitlistCommunityStats() {
  const upstream = await fetch(waitlistStatsUrl, {
    headers: { "X-API-Key": waitlistApiKey },
    cache: "no-store",
  });

  if (!upstream.ok) {
    throw new Error(`Stats request failed with ${upstream.status}`);
  }

  const stats = await upstream.json();
  return {
    ...stats,
    source: "email-waitlist" as const,
    total: typeof stats.total === "number" ? stats.total : null,
  };
}

export async function getUploadedEmailListStats() {
  if (!communityEmailListPath) {
    return null;
  }

  const pathSegments = communityEmailListPath
    .replace(/\\/g, "/")
    .replace(/^\.\//, "")
    .split("/")
    .filter(Boolean);
  const [rootDirectory, ...relativeSegments] = pathSegments;

  if (
    !rootDirectory ||
    !EMAIL_LIST_ROOTS.has(rootDirectory) ||
    relativeSegments.length === 0 ||
    relativeSegments.some(segment => segment === "..")
  ) {
    throw new Error("COMMUNITY_EMAIL_LIST_PATH must point inside ./data or ./uploads.");
  }

  const resolvedPath =
    rootDirectory === "uploads"
      ? path.join(process.cwd(), "uploads", ...relativeSegments)
      : path.join(process.cwd(), "data", ...relativeSegments);

  const file = await readFile(resolvedPath, "utf8");
  const emails = new Set(
    Array.from(file.matchAll(EMAIL_PATTERN), match => match[0].toLowerCase()),
  );

  return {
    source: "email-list" as const,
    total: emails.size,
  };
}

export async function getCommunityStats() {
  if (waitlistApiKey) {
    const waitlistStats = await getWaitlistCommunityStats();
    if (typeof waitlistStats.total === "number") {
      return waitlistStats;
    }
  }

  const uploadedListStats = await getUploadedEmailListStats();
  if (uploadedListStats) {
    return uploadedListStats;
  }

  return {
    source: null,
    total: null,
  };
}
