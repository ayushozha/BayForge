import BrandSymbol from "./BrandSymbol";
import CurrentYear from "./CurrentYear";

const contactEmails = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "outreach@bayforge.events")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="Bay Forge home">
            <BrandSymbol className="brand-logo" idPrefix="footer-brand" />
            <span className="brand-name">Bay Forge</span>
          </a>
          <p>
            A Bay Area community hosting hackathons, events, meetups, and gatherings for builders,
            creators, and innovators.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer explore links">
          <h3>Explore</h3>
          <a href="#events">Events</a>
          <a href="#community">Community</a>
          <a href="#sponsors">Partners</a>
          <a href="#about">About</a>
        </nav>

        <nav className="footer-links" aria-label="Social links">
          <h3>Connect</h3>
          <a href="#community">Twitter</a>
          <a href="#community">LinkedIn</a>
          <a href="#community">Instagram</a>
          <a href="#community">YouTube</a>
        </nav>

        <div className="footer-links">
          <h3>Location</h3>
          <p>Bay Area, California</p>
          {contactEmails.map((email) => (
            <a key={email} href={`mailto:${email}`}>{email}</a>
          ))}
        </div>
      </div>
      <p className="copyright">
        &copy; <CurrentYear /> Bay Forge. All rights reserved.
      </p>
    </footer>
  );
}
