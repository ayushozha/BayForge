import type { Metadata } from "next";
import WorkspaceOverview from "@/components/platform/WorkspaceOverview";
import { requireSession } from "@/lib/server/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireSession("/dashboard");
  return <WorkspaceOverview user={user} />;
}
