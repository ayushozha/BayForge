const DEFAULT_WAITLIST_URL = "https://emailwaitlist.ayushojha.com/api/v1/subscribe";

export const waitlistUrl = process.env.WAITLIST_API_URL || DEFAULT_WAITLIST_URL;

export const waitlistStatsUrl =
  process.env.WAITLIST_STATS_URL || waitlistUrl.replace(/\/subscribe\/?$/, "/stats");

export const waitlistApiKey = process.env.WAITLIST_API_KEY || "";

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320;
}

export async function getCommunityStats() {
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
    total: typeof stats.total === "number" ? stats.total : null,
  };
}
