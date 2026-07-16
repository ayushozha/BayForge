import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE,
  ACTIVE_VIEW_COOKIE,
  REFRESH_COOKIE,
} from "@/lib/authService";
import { loginPath, safeReturnPath } from "@/lib/authRedirect";
import { canAccessRoleView, type RoleView } from "@/lib/roles";
import { fetchAuthUser } from "@/lib/server/authUpstream";

export class SessionServiceError extends Error {
  constructor(status?: number) {
    super(status ? `Authentication service returned ${status}.` : "Authentication service unavailable.");
    this.name = "SessionServiceError";
  }
}

export const requireSession = cache(async (returnTo = "/dashboard") => {
  const destination = safeReturnPath(returnTo);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const preferredView = cookieStore.get(ACTIVE_VIEW_COOKIE)?.value;

  if (!accessToken) {
    if (refreshToken) redirect(refreshPath(destination));
    redirect(loginPath(destination));
  }

  let result;
  try {
    result = await fetchAuthUser(accessToken, preferredView);
  } catch {
    throw new SessionServiceError();
  }

  if (result.response.status === 401) {
    if (refreshToken) redirect(refreshPath(destination));
    redirect(loginPath(destination));
  }

  if (!result.response.ok) {
    throw new SessionServiceError(result.response.status);
  }

  if (!result.user) redirect(loginPath(destination));
  return result.user;
});

export async function requireRoleView(view: RoleView, returnTo = "/dashboard") {
  const user = await requireSession(returnTo);
  if (!canAccessRoleView(user, view)) {
    redirect(`/dashboard/access-denied?view=${encodeURIComponent(view)}`);
  }
  return user;
}

function refreshPath(returnTo: string): string {
  return `/api/auth/session/refresh?next=${encodeURIComponent(returnTo)}`;
}
