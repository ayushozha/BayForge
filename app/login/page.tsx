import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { safeReturnPath } from "@/lib/authRedirect";

export const metadata: Metadata = {
  title: "Sign in — Bay Forge",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <AuthForm
          mode="login"
          initialError={error}
          returnTo={safeReturnPath(from)}
        />
      </main>
      <SiteFooter />
    </>
  );
}
