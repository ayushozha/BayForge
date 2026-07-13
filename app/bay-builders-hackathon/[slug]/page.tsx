import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BayBuildersExperience from "@/components/bay-builders/BayBuildersExperience";
import { getGuest, allSlugs } from "@/lib/bay-builders/guests";

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
  if (!guest) return { title: "Bay Builders Hackathon" };
  const title = `${guest.name} · Bay Builders Hackathon`;
  const description = `Your personalized Bay Builders Hackathon invitation and brief, ${guest.name}.`;
  const image = "/bay-builders-hackathon/assets/cover.jpg";
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
  return <BayBuildersExperience guest={guest} />;
}
