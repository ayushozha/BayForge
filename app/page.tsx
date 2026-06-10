import { CommunityCountProvider } from "@/components/CommunityCountProvider";
import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import NewsletterSection from "@/components/NewsletterSection";
import PartnersSection from "@/components/PartnersSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import WhySection from "@/components/WhySection";

export default function HomePage() {
  return (
    <CommunityCountProvider>
      <SiteHeader />
      <main>
        <Hero />
        <EventsSection />
        <WhySection />
        <PartnersSection />
        <NewsletterSection />
        <SiteFooter />
      </main>
    </CommunityCountProvider>
  );
}
