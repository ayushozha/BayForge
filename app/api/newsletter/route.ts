import { NextResponse } from "next/server";
import { getNewsletterData } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getNewsletterData();

    if (!data.configured) {
      return NextResponse.json({
        configured: false,
        source: null,
        content: null,
        error: "Set COMMUNITY_NEWSLETTER_EXPORT_PATH on the server.",
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        configured: true,
        source: null,
        content: null,
        error: "Unable to load newsletter content.",
      },
      { status: 502 },
    );
  }
}
