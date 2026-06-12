import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  AUTH_SERVICE_URL,
  REFRESH_COOKIE,
  SITE_ORIGIN,
  applySessionCookies,
  authApiKey,
  clearSessionCookies,
} from "@/lib/authService";

// Server-side proxy to the shared auth service. The X-API-Key never reaches
// the browser, and tokens live only in httpOnly cookies on this domain.

const SESSION_PATHS = new Set(["login", "signup", "refresh"]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  const path = proxy.join("/");

  if (path.startsWith("oauth/")) {
    return beginOAuth(req, path);
  }
  if (path === "me") {
    return getMe(req);
  }
  return forward(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  const path = proxy.join("/");

  if (path === "logout") {
    return logout(req);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (SESSION_PATHS.has(path)) {
    body.token_transport = "json";
    if (path === "refresh" && !body.refresh_token) {
      const refreshCookie = req.cookies.get(REFRESH_COOKIE)?.value;
      if (!refreshCookie) {
        return NextResponse.json({ error: "Not signed in." }, { status: 401 });
      }
      body.refresh_token = refreshCookie;
    }
  }

  const upstream = await fetch(`${AUTH_SERVICE_URL}/api/auth/${path}`, {
    method: "POST",
    headers: upstreamHeaders(req),
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => ({}));

  if (upstream.ok && SESSION_PATHS.has(path)) {
    const response = NextResponse.json(
      { user: data.user ?? null, requires_2fa: data.requires_2fa ?? false },
      { status: upstream.status }
    );
    applySessionCookies(response, data);
    return response;
  }

  return NextResponse.json(data, { status: upstream.status });
}

async function beginOAuth(req: NextRequest, path: string): Promise<NextResponse> {
  const url = new URL(`${AUTH_SERVICE_URL}/api/auth/${path}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
  // Token session mode makes the auth service include the refresh token in
  // the redirect-code payload so /auth/callback can set our own cookies.
  url.searchParams.set("session_mode", "token");

  const upstream = await fetch(url, {
    headers: { "X-API-Key": authApiKey },
    redirect: "manual",
  });

  const location = upstream.headers.get("location");
  if (location && upstream.status >= 300 && upstream.status < 400) {
    return NextResponse.redirect(location, 302);
  }
  // Provider not configured (or other begin failure): bounce back to the
  // login page with a readable error instead of surfacing raw JSON.
  return NextResponse.redirect(new URL("/login?error=provider_unavailable", SITE_ORIGIN), 302);
}

async function getMe(req: NextRequest): Promise<NextResponse> {
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  if (access) {
    const upstream = await fetchMe(access);
    if (upstream.ok) {
      return NextResponse.json(normalizeUser(await upstream.json()), { status: 200 });
    }
    if (upstream.status !== 401 || !refresh) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  }

  // Access token missing or expired — try one silent refresh.
  const refreshed = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "X-API-Key": authApiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ token_transport: "json", refresh_token: refresh }),
  });
  if (!refreshed.ok) {
    const response = NextResponse.json({ user: null }, { status: 200 });
    clearSessionCookies(response);
    return response;
  }
  const tokens = await refreshed.json().catch(() => ({}));
  const retried = tokens.access_token ? await fetchMe(tokens.access_token) : null;
  const payload =
    retried && retried.ok ? normalizeUser(await retried.json()) : { user: tokens.user ?? null };
  const response = NextResponse.json(payload, { status: 200 });
  applySessionCookies(response, tokens);
  return response;
}

// The auth service's /me returns the user object at the top level; the
// frontend always consumes { user: ... }.
function normalizeUser(data: Record<string, unknown>): { user: unknown } {
  if (data && typeof data === "object" && "user" in data) {
    return { user: (data as { user: unknown }).user };
  }
  return { user: data && typeof data === "object" && "id" in data ? data : null };
}

async function fetchMe(accessToken: string): Promise<Response> {
  return fetch(`${AUTH_SERVICE_URL}/api/auth/me`, {
    headers: {
      "X-API-Key": authApiKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function logout(req: NextRequest): Promise<NextResponse> {
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;

  if (access || refresh) {
    await fetch(`${AUTH_SERVICE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        ...upstreamHeaders(req),
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: JSON.stringify(refresh ? { refresh_token: refresh, token_transport: "json" } : {}),
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookies(response);
  return response;
}

async function forward(req: NextRequest, path: string): Promise<NextResponse> {
  const url = new URL(`${AUTH_SERVICE_URL}/api/auth/${path}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
  const upstream = await fetch(url, { headers: upstreamHeaders(req) });
  const data = await upstream.text();
  return new NextResponse(data, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
  });
}

function upstreamHeaders(req: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {
    "X-API-Key": authApiKey,
    "Content-Type": "application/json",
  };
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) headers["X-Forwarded-For"] = forwardedFor;
  return headers;
}
