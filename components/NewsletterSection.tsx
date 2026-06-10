import CommunityCountLabel from "./CommunityCountLabel";
import { NewsletterSubscribeForm } from "./SubscribeForm";

export default function NewsletterSection() {
  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="section-shell newsletter-shell">
        <div>
          <h2 id="newsletter-title">Never miss a thing. Stay in the loop.</h2>
        </div>
        <NewsletterSubscribeForm />
        <p className="newsletter-counter">
          <CommunityCountLabel /> builders are already in the loop. Be one of them.
        </p>
      </div>
    </section>
  );
}
