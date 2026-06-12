import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Sign in — Bay Forge",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <AuthForm mode="login" initialError={error} />
      </main>
      <SiteFooter />
    </>
  );
}
