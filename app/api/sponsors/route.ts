import { NextResponse } from "next/server";
import { getSponsorsData } from "@/lib/sponsors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSponsorsData();

    if (!data.configured) {
      return NextResponse.json({
        configured: false,
        source: null,
        sponsors: [],
        error: "Set COMMUNITY_SPONSORS_EXPORT_PATH on the server.",
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        configured: true,
        source: null,
        sponsors: [],
        error: "Unable to load sponsors.",
      },
      { status: 502 },
    );
  }
}
