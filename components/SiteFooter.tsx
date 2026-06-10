import Image from "next/image";
import logo from "@/public/assets/7.png";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-grid">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="Bay Forge home">
            <Image className="brand-logo" src={logo} alt="" width={42} height={42} />
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
          <a href="mailto:hello@bayforge.dev">hello@bayforge.dev</a>
        </div>
      </div>
      <p className="copyright">&copy; 2025 Bay Forge. All rights reserved.</p>
    </footer>
  );
}
