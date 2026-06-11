import { NextResponse } from "next/server";
import { getEventSectionData } from "@/lib/events";
import { getCommunityStats } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getCommunityStats();
    const eventData =
      typeof stats.eventsHosted === "number" ? null : await getEventSectionData();
    const eventsHosted = stats.eventsHosted ?? eventData?.stats.eventsHosted ?? null;
    const eventsSource = stats.eventsSource ?? (eventsHosted !== null ? "database-export" : null);
    const source = stats.source ?? (eventsHosted !== null ? "database-export" : null);

    if (
      typeof stats.total !== "number" &&
      typeof stats.collegesRepresented !== "number" &&
      typeof eventsHosted !== "number" &&
      typeof stats.projectsBuilt !== "number"
    ) {
      return NextResponse.json({
        configured: false,
        source: null,
        total: null,
        collegesRepresented: null,
        collegesSource: null,
        eventsHosted: null,
        eventsSource: null,
        projectsBuilt: null,
        projectsSource: null,
        error:
          "Set WAITLIST_API_KEY, COMMUNITY_EMAIL_LIST_PATH, or COMMUNITY_DATABASE_EXPORT_PATH on the server.",
      });
    }

    return NextResponse.json({
      configured: true,
      source,
      total: stats.total,
      collegesRepresented: stats.collegesRepresented,
      collegesSource: stats.collegesSource,
      eventsHosted,
      eventsSource,
      projectsBuilt: stats.projectsBuilt,
      projectsSource: stats.projectsSource,
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
        eventsHosted: null,
        eventsSource: null,
        projectsBuilt: null,
        projectsSource: null,
        error: "Unable to load community stats.",
      },
      { status: 502 },
    );
  }
}
