import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/PasswordResetForms";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Reset password — Bay Forge",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <ForgotPasswordForm />
      </main>
      <SiteFooter />
    </>
  );
}
