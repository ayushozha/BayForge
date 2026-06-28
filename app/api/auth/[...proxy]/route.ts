import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACTIVE_VIEW_COOKIE,
  AUTH_SERVICE_URL,
  REFRESH_COOKIE,
  ROLE_COOKIE,
  SITE_ORIGIN,
  applyRoleCookies,
  applySessionCookies,
  authApiKey,
  clearSessionCookies,
} from "@/lib/authService";
import {
  decorateUserWithRoles,
  isInviteOnlyRole,
  parsePublicSignupRole,
  parseSystemRole,
  sanitizePublicSignupRole,
  type PublicSignupRole,
  type SystemRole,
} from "@/lib/roles";

// Server-side proxy to the shared auth service. The X-API-Key never reaches
// the browser, and tokens live only in httpOnly cookies on this domain.

const SESSION_PATHS = new Set(["login", "signup", "refresh"]);
const SIGNUP_ROLE_FIELDS = [
  "role",
  "primary_role",
  "primaryRole",
  "user_role",
  "userRole",
  "account_type",
  "accountType",
  "bayforge_role",
  "bayforgeRole",
];
const SIGNUP_ROLE_LIST_FIELDS = ["roles", "available_roles", "availableRoles", "bayforge_roles", "bayforgeRoles"];
const SIGNUP_NESTED_ROLE_FIELDS = [
  "metadata",
  "profile",
  "app_metadata",
  "appMetadata",
  "user_metadata",
  "userMetadata",
  "custom_claims",
  "customClaims",
];

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

  let signupRole: PublicSignupRole | undefined;
  if (path === "signup") {
    const requestedRoles = findRequestedSignupRoles(body);
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

  const upstream = await postToAuthService(req, path, body);

  const data = await upstream.json().catch(() => ({}));

  if (upstream.ok && SESSION_PATHS.has(path)) {
    const user = decorateUserWithRoles(
      data.user ?? null,
      signupRole ?? req.cookies.get(ROLE_COOKIE)?.value,
      req.cookies.get(ACTIVE_VIEW_COOKIE)?.value
    );
    const response = NextResponse.json(
      { user, requires_2fa: data.requires_2fa ?? false },
      { status: upstream.status }
    );
    applySessionCookies(response, data);
    if (signupRole) {
      applyRoleCookies(
        response,
        signupRole,
        signupRole === "organizer" ? "organizer" : "participant"
      );
    }
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
      return NextResponse.json(normalizeUser(await upstream.json(), req), { status: 200 });
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
    retried && retried.ok
      ? normalizeUser(await retried.json(), req)
      : {
          user: decorateUserWithRoles(
            tokens.user ?? null,
            req.cookies.get(ROLE_COOKIE)?.value,
            req.cookies.get(ACTIVE_VIEW_COOKIE)?.value
          ),
        };
  const response = NextResponse.json(payload, { status: 200 });
  applySessionCookies(response, tokens);
  return response;
}

// The auth service's /me returns the user object at the top level; the
// frontend always consumes { user: ... }.
function normalizeUser(data: Record<string, unknown>, req: NextRequest): { user: unknown } {
  const fallbackRole = req.cookies.get(ROLE_COOKIE)?.value;
  const preferredView = req.cookies.get(ACTIVE_VIEW_COOKIE)?.value;
  if (data && typeof data === "object" && "user" in data) {
    return {
      user: decorateUserWithRoles(
        (data as { user: unknown }).user,
        fallbackRole,
        preferredView
      ),
    };
  }
  return {
    user: decorateUserWithRoles(
      data && typeof data === "object" && "id" in data ? data : null,
      fallbackRole,
      preferredView
    ),
  };
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

function postToAuthService(
  req: NextRequest,
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${AUTH_SERVICE_URL}/api/auth/${path}`, {
    method: "POST",
    headers: upstreamHeaders(req),
    body: JSON.stringify(body),
  });
}

function findRequestedSignupRoles(body: Record<string, unknown>): SystemRole[] {
  const roles: SystemRole[] = [];

  for (const field of SIGNUP_ROLE_FIELDS) {
    const role = parseSystemRole(body[field]);
    if (role) roles.push(role);
  }

  for (const field of SIGNUP_ROLE_LIST_FIELDS) {
    const value = body[field];
    if (Array.isArray(value)) {
      for (const item of value) {
        const role = parseSystemRole(item);
        if (role) roles.push(role);
      }
    }
  }

  for (const field of SIGNUP_NESTED_ROLE_FIELDS) {
    const nested = body[field];
    if (isRecord(nested)) {
      roles.push(...findRequestedSignupRoles(nested));
    }
  }

  return roles;
}

function sanitizeSignupRolePayload(
  body: Record<string, unknown>,
  signupRole: PublicSignupRole
): Record<string, unknown> {
  const cleanBody = stripSignupRoleFields(body);
  cleanBody.role = signupRole;
  return cleanBody;
}

function stripSignupRoleFields(body: Record<string, unknown>): Record<string, unknown> {
  const cleanBody: Record<string, unknown> = { ...body };

  for (const field of SIGNUP_ROLE_FIELDS) {
    delete cleanBody[field];
  }
  for (const field of SIGNUP_ROLE_LIST_FIELDS) {
    delete cleanBody[field];
  }

  for (const field of SIGNUP_NESTED_ROLE_FIELDS) {
    const nested = cleanBody[field];
    if (isRecord(nested)) {
      cleanBody[field] = stripSignupRoleFields(nested);
    }
  }

  return cleanBody;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
