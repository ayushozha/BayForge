import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WizardExperience from "@/components/wizard/WizardExperience";
import { getGuest, allSlugs } from "@/lib/wizard/guests";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guest = getGuest(slug);
  if (!guest) return { title: "Wizard Hackathon 2026" };
  const title = `${guest.name} · Wizard Hackathon 2026`;
  const description = `Your personalized Wizard Hackathon 2026 invitation and brief, ${guest.name}.`;
  const image = guest.card
    ? `/wizard-hackathon/cards/${guest.slug}.webp`
    : "/wizard-hackathon/assets/cover.webp";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayforge.ai"),
    title,
    description,
    openGraph: { title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: { index: false, follow: false },
  };
}

export default async function GuestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = getGuest(slug);
  if (!guest) notFound();
  return <WizardExperience guest={guest} />;
}
