import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACTIVE_VIEW_COOKIE,
  AUTH_SERVICE_URL,
  REFRESH_COOKIE,
  SITE_ORIGIN,
  applyActiveViewCookie,
  applySessionCookies,
  authApiKey,
  clearSessionCookies,
} from "@/lib/authService";
import { loginPath, safeReturnPath } from "@/lib/authRedirect";
import {
  collectRequestedSignupRoles,
  decorateUserWithRoles,
  isInviteOnlyRole,
  parsePublicSignupRole,
  sanitizePublicSignupRole,
  sanitizeSignupRolePayload,
  toSessionUser,
  type BayForgeSessionUser,
  type PublicSignupRole,
} from "@/lib/roles";
import {
  fetchAuthUser,
  normalizeTrustedAuthUser,
} from "@/lib/server/authUpstream";

// Server-side proxy to the shared auth service. The API key never reaches
// the browser, and tokens live only in HttpOnly cookies on this domain.

const SESSION_PATHS = new Set(["login", "signup", "refresh"]);
const AUTH_TIMEOUT_MS = 8_000;

type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  requires_2fa?: boolean;
  user?: unknown;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  const path = proxy.join("/");

  if (path === "session/refresh") return refreshSession(req);
  if (path.startsWith("oauth/")) return beginOAuth(req, path);
  if (path === "me") return getMe(req);
  return forward(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> }
) {
  const { proxy } = await params;
  const path = proxy.join("/");

  if (path === "logout") return logout(req);

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  let signupRole: PublicSignupRole | undefined;
  if (path === "signup") {
    const requestedRoles = collectRequestedSignupRoles(body);
    if (requestedRoles.some((role) => isInviteOnlyRole(role))) {
      return NextResponse.json(
        { error: "That role requires an invitation." },
        { status: 403 }
      );
    }

    signupRole = sanitizePublicSignupRole(
      requestedRoles.find((role) => parsePublicSignupRole(role))
    );
    body = sanitizeSignupRolePayload(body, signupRole);
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

  let upstream: Response;
  try {
    upstream = await postToAuthService(req, path, body);
  } catch {
    return NextResponse.json(
      { error: "Authentication service unavailable." },
      { status: 503 }
    );
  }

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok || !SESSION_PATHS.has(path)) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const preferredView = req.cookies.get(ACTIVE_VIEW_COOKIE)?.value;
  const user = sessionUserFromPayload(data, signupRole, preferredView);
  const response = NextResponse.json(
    { user, requires_2fa: data.requires_2fa ?? false },
    { status: upstream.status }
  );

  applySessionCookies(response, data);
  if (user) {
    applyActiveViewCookie(response, user.active_view);
  } else if (signupRole) {
    applyActiveViewCookie(response, signupRole);
  }
  return response;
}

async function beginOAuth(req: NextRequest, path: string): Promise<NextResponse> {
  const url = new URL(`${AUTH_SERVICE_URL}/api/auth/${path}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
  url.searchParams.set("session_mode", "token");

  try {
    const upstream = await fetch(url, {
      headers: { "X-API-Key": authApiKey },
      redirect: "manual",
      signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
    });
    const location = upstream.headers.get("location");
    if (location && upstream.status >= 300 && upstream.status < 400) {
      return NextResponse.redirect(location, 302);
    }
  } catch {
    // Fall through to the readable login error below.
  }

  return NextResponse.redirect(
    new URL("/login?error=provider_unavailable", siteUrl(req)),
    302
  );
}

async function getMe(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const preferredView = req.cookies.get(ACTIVE_VIEW_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  if (accessToken) {
    try {
      const result = await fetchAuthUser(accessToken, preferredView);
      if (result.response.ok) {
        return NextResponse.json({ user: result.user }, { status: 200 });
      }
      if (result.response.status !== 401) {
        return NextResponse.json(
          { error: "Authentication service unavailable." },
          { status: 503 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Authentication service unavailable." },
        { status: 503 }
      );
    }
  }

  if (!refreshToken) {
    const response = NextResponse.json({ user: null }, { status: 200 });
    clearSessionCookies(response);
    return response;
  }

  const refreshed = await refreshWithToken(refreshToken, preferredView);
  if (!refreshed) {
    const response = NextResponse.json({ user: null }, { status: 200 });
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.json({ user: refreshed.user }, { status: 200 });
  applySessionCookies(response, refreshed.tokens);
  if (refreshed.user) {
    applyActiveViewCookie(response, refreshed.user.active_view);
  }
  return response;
}

async function refreshSession(req: NextRequest): Promise<NextResponse> {
  const returnTo = safeReturnPath(req.nextUrl.searchParams.get("next"));
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  const preferredView = req.cookies.get(ACTIVE_VIEW_COOKIE)?.value;

  if (!refreshToken) return clearAndRedirect(req, returnTo);

  const refreshed = await refreshWithToken(refreshToken, preferredView);
  if (!refreshed?.tokens.access_token || !refreshed.user) {
    return clearAndRedirect(req, returnTo);
  }

  const response = NextResponse.redirect(new URL(returnTo, siteUrl(req)), 303);
  applySessionCookies(response, refreshed.tokens);
  applyActiveViewCookie(response, refreshed.user.active_view);
  return response;
}

async function refreshWithToken(
  refreshToken: string,
  preferredView?: unknown
): Promise<{ tokens: AuthTokens; user: BayForgeSessionUser | null } | null> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "X-API-Key": authApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token_transport: "json",
        refresh_token: refreshToken,
      }),
      signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;
  const tokens = (await response.json().catch(() => ({}))) as AuthTokens;
  let user = normalizeTrustedAuthUser(tokens.user, preferredView);

  if (!user && tokens.access_token) {
    try {
      const result = await fetchAuthUser(tokens.access_token, preferredView);
      if (result.response.ok) user = result.user;
    } catch {
      return null;
    }
  }

  return { tokens, user };
}

async function logout(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  if (accessToken || refreshToken) {
    await fetch(`${AUTH_SERVICE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        ...upstreamHeaders(req),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(
        refreshToken
          ? { refresh_token: refreshToken, token_transport: "json" }
          : {}
      ),
      signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
    }).catch(() => null);
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  clearSessionCookies(response);
  return response;
}

async function forward(req: NextRequest, path: string): Promise<NextResponse> {
  const url = new URL(`${AUTH_SERVICE_URL}/api/auth/${path}`);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  try {
    const upstream = await fetch(url, {
      headers: upstreamHeaders(req),
      signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
    });
    const data = await upstream.text();
    return new NextResponse(data, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Authentication service unavailable." },
      { status: 503 }
    );
  }
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

function postToAuthService(
  req: NextRequest,
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${AUTH_SERVICE_URL}/api/auth/${path}`, {
    method: "POST",
    headers: upstreamHeaders(req),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
  });
}

function sessionUserFromPayload(
  payload: unknown,
  signupRole?: PublicSignupRole,
  preferredView?: unknown
): BayForgeSessionUser | null {
  if (!isRecord(payload)) return null;
  const rawUser = payload.user ?? null;
  const decorated = decorateUserWithRoles(
    rawUser,
    signupRole,
    preferredView
  );
  return decorated ? toSessionUser(decorated) : null;
}

function clearAndRedirect(
  req: NextRequest,
  returnTo: string
): NextResponse {
  const response = NextResponse.redirect(
    new URL(loginPath(returnTo), siteUrl(req)),
    303
  );
  clearSessionCookies(response);
  return response;
}

function siteUrl(req: NextRequest): string {
  return process.env.NODE_ENV === "production"
    ? SITE_ORIGIN
    : req.nextUrl.origin;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
