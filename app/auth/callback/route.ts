import { NextRequest, NextResponse } from "next/server";
import { AUTH_SERVICE_URL, applySessionCookies } from "@/lib/authService";

// Lands here after a social login: the auth service redirects with a
// one-time ?auth_code which we exchange server-side for tokens, stored as
// httpOnly cookies. Tokens never appear in the browser.

export async function GET(req: NextRequest) {
  const authCode = req.nextUrl.searchParams.get("auth_code");
  const providerError = req.nextUrl.searchParams.get("error");

  if (!authCode) {
    const reason = providerError || "oauth_failed";
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(reason)}`, req.url));
  }

  const upstream = await fetch(`${AUTH_SERVICE_URL}/api/auth/redirect/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: authCode }),
  }).catch(() => null);

  if (!upstream || !upstream.ok) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const tokens = await upstream.json().catch(() => ({}));
  if (!tokens.access_token) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url));
  }

  const response = NextResponse.redirect(new URL("/?signed_in=1", req.url));
  applySessionCookies(response, tokens);
  return response;
}
