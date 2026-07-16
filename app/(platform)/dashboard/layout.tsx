import PlatformShell from "@/components/platform/PlatformShell";
import { requireSession } from "@/lib/server/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession("/dashboard");
  return <PlatformShell user={user}>{children}</PlatformShell>;
}
