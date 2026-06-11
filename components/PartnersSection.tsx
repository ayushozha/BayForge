"use client";

import { useEffect, useState } from "react";
import type { SponsorData } from "@/lib/sponsors";

type SponsorsApiResponse = {
  configured: boolean;
  sponsors: SponsorData[];
};

function isLinkedSponsor(href: string): boolean {
  return href !== "#";
}

function isExternalHref(href: string): boolean {
  return href.startsWith("https://") || href.startsWith("http://");
}

function SponsorLogo({ sponsor }: { sponsor: SponsorData }) {
  const content = (
    <img
      className="partner-logo-image"
      src={sponsor.logoUrl}
      alt={sponsor.logoAlt}
      loading="lazy"
      decoding="async"
    />
  );

  if (!isLinkedSponsor(sponsor.href)) {
    return <div className="partner-logo">{content}</div>;
  }

  const externalHref = isExternalHref(sponsor.href);
  return (
    <a
      className="partner-logo"
      href={sponsor.href}
      target={externalHref ? "_blank" : undefined}
      rel={externalHref ? "noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

export default function PartnersSection() {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/sponsors", { headers: { Accept: "application/json" } })
      .then(response => response.json())
      .then((data: SponsorsApiResponse) => {
        if (!cancelled) {
          setSponsors(Array.isArray(data.sponsors) ? data.sponsors : []);
        }
      })
      .catch(() => {
        // Keep the dashboard-published empty state when sponsor data is unavailable.
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const emptyMessage = isLoading
    ? "Loading dashboard sponsors."
    : "Sponsors will appear once they are published from the dashboard.";

  return (
    <section className="partners-section" id="sponsors" aria-labelledby="partners-title">
      <div className="section-shell">
        <div className="partner-card">
          <p className="section-kicker" id="partners-title">
            Thanks to our partners
          </p>
          {sponsors.length > 0 ? (
            <div className="partner-logos" aria-label="Partner logos">
              {sponsors.map(sponsor => (
                <SponsorLogo key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          ) : (
            <div className="partner-empty" role="status">
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
