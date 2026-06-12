import type { NextResponse } from "next/server";

export const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "https://authservice.ayushojha.com";

export const authApiKey = process.env.AUTH_API_KEY?.trim() || "";

export const ACCESS_COOKIE = "bf_access";
export const REFRESH_COOKIE = "bf_refresh";

const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
};

const secureCookies = process.env.NODE_ENV === "production";

// Optional parent-domain cookie scope (e.g. ".bayforge.events") so the
// session is shared between the apex and www hosts.
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;

export function applySessionCookies(response: NextResponse, tokens: AuthTokens) {
  if (tokens.access_token) {
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
      httpOnly: true,
      secure: secureCookies,
      sameSite: "lax",
      path: "/",
      domain: cookieDomain,
      maxAge: typeof tokens.expires_in === "number" && tokens.expires_in > 0 ? tokens.expires_in : 900,
    });
  }
  if (tokens.refresh_token) {
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
      httpOnly: true,
      secure: secureCookies,
      sameSite: "lax",
      path: "/",
      domain: cookieDomain,
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", domain: cookieDomain, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, path: "/", domain: cookieDomain, maxAge: 0 });
}
