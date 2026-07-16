import type { NextResponse } from "next/server";

export const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "https://authservice.ayushojha.com";

export const authApiKey = process.env.AUTH_API_KEY?.trim() || "";

// Public origin of this site, used for absolute redirects. Behind the
// reverse proxy, request URLs resolve to the internal 0.0.0.0:3000 host.
export const SITE_ORIGIN = process.env.SITE_ORIGIN?.trim() || "https://bayforge.events";

export const ACCESS_COOKIE = "bf_access";
export const REFRESH_COOKIE = "bf_refresh";
export const ACTIVE_VIEW_COOKIE = "bf_view";
const LEGACY_ROLE_COOKIE = "bf_role";

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
    const maxAge =
      typeof tokens.expires_in === "number" && tokens.expires_in > 0
        ? tokens.expires_in
        : 900;
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, getAuthCookieOptions(maxAge));
  }
  if (tokens.refresh_token) {
    response.cookies.set(
      REFRESH_COOKIE,
      tokens.refresh_token,
      getAuthCookieOptions(REFRESH_MAX_AGE)
    );
  }
}

export function applyActiveViewCookie(response: NextResponse, activeView: string) {
  response.cookies.set(
    ACTIVE_VIEW_COOKIE,
    activeView,
    getActiveViewCookieOptions()
  );
}

export function getActiveViewCookieOptions() {
  return getAuthCookieOptions(REFRESH_MAX_AGE);
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", domain: cookieDomain, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, path: "/", domain: cookieDomain, maxAge: 0 });
  response.cookies.set(LEGACY_ROLE_COOKIE, "", { httpOnly: true, path: "/", domain: cookieDomain, maxAge: 0 });
  response.cookies.set(ACTIVE_VIEW_COOKIE, "", { httpOnly: true, path: "/", domain: cookieDomain, maxAge: 0 });
}

function getAuthCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: secureCookies,
    sameSite: "lax" as const,
    path: "/",
    domain: cookieDomain,
    maxAge,
  };
}
