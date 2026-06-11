"use client";

import { useEffect, useState } from "react";
import type { NewsletterContent } from "@/lib/newsletter";
import CommunityCountLabel from "./CommunityCountLabel";
import { NewsletterSubscribeForm } from "./SubscribeForm";

type NewsletterApiResponse = {
  configured: boolean;
  content: NewsletterContent | null;
};

function renderCounterText(counterText: string) {
  const marker = "{count}";
  if (!counterText.includes(marker)) {
    return counterText;
  }

  const [before, after] = counterText.split(marker);
  return (
    <>
      {before}
      <CommunityCountLabel /> {after}
    </>
  );
}

export default function NewsletterSection() {
  const [content, setContent] = useState<NewsletterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/newsletter", { headers: { Accept: "application/json" } })
      .then(response => response.json())
      .then((data: NewsletterApiResponse) => {
        if (!cancelled) {
          setContent(data.content ?? null);
        }
      })
      .catch(() => {
        // Keep the dashboard-published empty state when content is unavailable.
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

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="section-shell newsletter-shell">
        {content ? (
          <>
            <div>
              <h2 id="newsletter-title">{content.title}</h2>
            </div>
            <NewsletterSubscribeForm
              emailLabel={content.emailLabel}
              placeholder={content.placeholder}
              buttonLabel={content.buttonLabel}
              submittingLabel={content.submittingLabel}
              helperText={content.helperText}
              source={content.source}
            />
            {content.counterText ? (
              <p className="newsletter-counter">{renderCounterText(content.counterText)}</p>
            ) : null}
          </>
        ) : (
          <div className="newsletter-empty" role="status">
            {isLoading
              ? "Loading dashboard newsletter content."
              : "Newsletter content will appear once it is published from the dashboard."}
          </div>
        )}
      </div>
    </section>
  );
}
