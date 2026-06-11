import { NextResponse } from "next/server";
import { getCommunityStats } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getCommunityStats();
    if (typeof stats.total !== "number") {
      return NextResponse.json({
        configured: false,
        source: null,
        total: null,
        error: "Set WAITLIST_API_KEY or COMMUNITY_EMAIL_LIST_PATH on the server.",
      });
    }

    return NextResponse.json({
      configured: true,
      source: stats.source,
      total: stats.total,
      today: stats.today,
      this_week: stats.this_week,
      this_month: stats.this_month,
    });
  } catch {
    return NextResponse.json(
      { configured: true, source: null, total: null, error: "Unable to load community stats." },
      { status: 502 },
    );
  }
}
