import { NextResponse } from "next/server";
import { getCommunityStats, waitlistApiKey } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!waitlistApiKey) {
    return NextResponse.json({
      configured: false,
      total: null,
      error: "WAITLIST_API_KEY is not set.",
    });
  }

  try {
    const stats = await getCommunityStats();
    return NextResponse.json({
      configured: true,
      total: stats.total,
      today: stats.today,
      this_week: stats.this_week,
      this_month: stats.this_month,
    });
  } catch {
    return NextResponse.json(
      { configured: true, total: null, error: "Unable to load waitlist stats." },
      { status: 502 },
    );
  }
}
