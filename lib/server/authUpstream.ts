import { AUTH_SERVICE_URL, authApiKey } from "@/lib/authService";
import {
  decorateUserWithRoles,
  toSessionUser,
  type BayForgeSessionUser,
} from "@/lib/roles";

const AUTH_TIMEOUT_MS = 8_000;

export type AuthUserResult = {
  response: Response;
  user: BayForgeSessionUser | null;
};

export async function fetchAuthUser(
  accessToken: string,
  preferredView?: unknown
): Promise<AuthUserResult> {
  const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/me`, {
    cache: "no-store",
    headers: {
      "X-API-Key": authApiKey,
      Authorization: `Bearer ${accessToken}`,
    },
    signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
  });

  if (!response.ok) return { response, user: null };

  const payload = await response.json().catch(() => null);
  return {
    response,
    user: normalizeTrustedAuthUser(payload, preferredView),
  };
}

export function normalizeTrustedAuthUser(
  payload: unknown,
  preferredView?: unknown
): BayForgeSessionUser | null {
  const rawUser = unwrapUser(payload);
  if (!hasIdentity(rawUser)) return null;

  const decorated = decorateUserWithRoles(rawUser, undefined, preferredView);
  return decorated ? toSessionUser(decorated) : null;
}

function unwrapUser(payload: unknown): unknown {
  if (isRecord(payload) && "user" in payload) return payload.user;
  return payload;
}

function hasIdentity(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  return [value.id, value.user_id, value.sub, value.email].some(
    (field) => typeof field === "string" && field.trim().length > 0
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
