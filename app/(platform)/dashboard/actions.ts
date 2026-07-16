"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ACTIVE_VIEW_COOKIE,
  getActiveViewCookieOptions,
} from "@/lib/authService";
import {
  canAccessRoleView,
  parseRoleView,
  type RoleView,
} from "@/lib/roles";
import { requireSession } from "@/lib/server/session";

export type WorkspaceSwitchResult =
  | { ok: true; view: RoleView }
  | { ok: false; message: string };

export async function switchWorkspace(
  requestedView: unknown
): Promise<WorkspaceSwitchResult> {
  const view = parseRoleView(requestedView);
  if (!view) return { ok: false, message: "Unknown workspace." };

  const user = await requireSession("/dashboard");
  if (!canAccessRoleView(user, view)) {
    return { ok: false, message: "Your account cannot access that workspace." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_VIEW_COOKIE, view, getActiveViewCookieOptions());
  revalidatePath("/dashboard", "layout");
  return { ok: true, view };
}
