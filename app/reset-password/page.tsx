import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/PasswordResetForms";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Choose a new password — Bay Forge",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <ResetPasswordForm token={token ?? ""} />
      </main>
      <SiteFooter />
    </>
  );
}
