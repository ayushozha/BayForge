import { NextResponse } from "next/server";
import { getCommunityStats } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getCommunityStats();
    if (
      typeof stats.total !== "number" &&
      typeof stats.collegesRepresented !== "number"
    ) {
      return NextResponse.json({
        configured: false,
        source: null,
        total: null,
        collegesRepresented: null,
        collegesSource: null,
        error:
          "Set WAITLIST_API_KEY, COMMUNITY_EMAIL_LIST_PATH, or COMMUNITY_DATABASE_EXPORT_PATH on the server.",
      });
    }

    return NextResponse.json({
      configured: true,
      source: stats.source,
      total: stats.total,
      collegesRepresented: stats.collegesRepresented,
      collegesSource: stats.collegesSource,
      today: stats.today,
      this_week: stats.this_week,
      this_month: stats.this_month,
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        source: null,
        total: null,
        collegesRepresented: null,
        collegesSource: null,
        error: "Unable to load community stats.",
      },
      { status: 502 },
    );
  }
}
