import { NextResponse } from "next/server";
import { getEventSectionData } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getEventSectionData();

    if (!data.configured) {
      return NextResponse.json({
        configured: false,
        source: null,
        events: [],
        stats: data.stats,
        error: "Set COMMUNITY_EVENTS_EXPORT_PATH on the server.",
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        configured: true,
        source: null,
        events: [],
        stats: {
          eventsHosted: null,
          citiesRepresented: null,
          volunteerLeaders: null,
          partnersSupporters: null,
        },
        error: "Unable to load events.",
      },
      { status: 502 },
    );
  }
}
