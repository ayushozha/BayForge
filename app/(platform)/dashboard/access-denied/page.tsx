import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PlatformState from "@/components/platform/PlatformState";
import {
  canAccessRoleView,
  getRoleLabel,
  parseRoleView,
} from "@/lib/roles";
import { requireSession } from "@/lib/server/session";

export const metadata: Metadata = {
  title: "Access denied",
};

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const user = await requireSession("/dashboard/access-denied");
  const { view: rawView } = await searchParams;
  const view = parseRoleView(rawView);

  if (view && canAccessRoleView(user, view)) redirect("/dashboard");

  const requestedLabel = view ? getRoleLabel(view) : "That";
  return (
    <PlatformState
      eyebrow="Workspace restricted"
      title={`${requestedLabel} access is not assigned to this account.`}
      description="Bay Forge roles are verified by the authentication service. Ask an event administrator for an invitation if this workspace is required."
      primaryHref="/dashboard"
      primaryLabel="Return to dashboard"
      secondaryHref="/bay-builders-hackathon"
      secondaryLabel="View the hackathon"
    />
  );
}
