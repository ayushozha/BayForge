import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Create account — Bay Forge",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <AuthForm mode="signup" initialError={error} />
      </main>
      <SiteFooter />
    </>
  );
}
