import { NextResponse } from "next/server";
import { notifyNewSubscriber, sendWelcomeEmail } from "@/lib/email";
import {
  getCommunityStats,
  isEmail,
  masterWaitlistApiKey,
  masterWaitlistUrl,
  waitlistApiKey,
  waitlistUrl,
} from "@/lib/waitlist";

const FALLBACK_ERRORS: Record<number, string> = {
  400: "Please enter a valid email address.",
  401: "Waitlist configuration is invalid.",
  409: "You're already on the Bay Forge list.",
  429: "Too many requests. Please try again in a minute.",
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!waitlistApiKey) {
    return NextResponse.json(
      { error: "Waitlist is not configured yet. Set WAITLIST_API_KEY on the server." },
      { status: 500 },
    );
  }

  const metadata =
    body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
      ? (body.metadata as Record<string, unknown>)
      : {};

  const upstream = await fetch(waitlistUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": waitlistApiKey,
    },
    body: JSON.stringify({
      email,
      metadata: {
        ...metadata,
        source: metadata.source || "bayforge-landing",
        submitted_via: "bayforge-proxy",
      },
    }),
  });

  const data = await upstream.json().catch(() => ({}));

  if (upstream.ok) {
    notifyNewSubscriber(email, typeof metadata.source === "string" ? metadata.source : undefined);
    sendWelcomeEmail(email);
    if (masterWaitlistApiKey) {
      fetch(masterWaitlistUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": masterWaitlistApiKey },
        body: JSON.stringify({
          email,
          metadata: {
            ...metadata,
            source: metadata.source || "bayforge-landing",
            submitted_via: "bayforge-proxy",
          },
        }),
      }).catch(() => {});
    }
    const stats = await getCommunityStats().catch(() => null);
    return NextResponse.json(
      {
        message: data.message || "Successfully joined the waitlist!",
        total: stats ? stats.total : null,
      },
      { status: 201 },
    );
  }

  return NextResponse.json(
    {
      error:
        data.error || data.message || FALLBACK_ERRORS[upstream.status] || "Signup failed.",
    },
    { status: upstream.status },
  );
}
