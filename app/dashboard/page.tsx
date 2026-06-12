import type { Metadata } from "next";
import RoleDashboard from "@/components/RoleDashboard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Dashboard - Bay Forge",
};

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="dashboard-page">
        <RoleDashboard />
      </main>
      <SiteFooter />
    </>
  );
}
