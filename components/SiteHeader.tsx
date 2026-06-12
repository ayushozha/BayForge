import AuthStatus from "./AuthStatus";
import BrandSymbol from "./BrandSymbol";

export default function SiteHeader() {
  return (
    <header className="site-header" aria-label="Primary navigation">
      <a className="brand" href="/" aria-label="Bay Forge home">
        <BrandSymbol className="brand-logo" idPrefix="header-brand" />
        <span className="brand-name">Bay Forge</span>
      </a>

      <nav className="nav-links" aria-label="Site navigation">
        <a href="#events">Events</a>
        <a href="#community">Community</a>
        <a href="#projects">Projects</a>
        <a href="#sponsors">Sponsors</a>
        <a href="#about">About</a>
      </nav>

      <div className="nav-actions">
        <AuthStatus />
        <a className="button button-secondary" href="#community" aria-label="Join Bay Forge Discord">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.8 9.2c-.7 0-1.2.6-1.2 1.3s.5 1.3 1.2 1.3 1.2-.6 1.2-1.3-.5-1.3-1.2-1.3Zm6.4 0c-.7 0-1.2.6-1.2 1.3s.5 1.3 1.2 1.3 1.2-.6 1.2-1.3-.5-1.3-1.2-1.3Z" />
            <path d="M18.8 4.7A16 16 0 0 0 14.9 3l-.2.4c1.3.3 2.5.9 3.6 1.7A12.5 12.5 0 0 0 12 3.4c-2.2 0-4.4.6-6.3 1.7 1.1-.8 2.3-1.4 3.6-1.7L9.1 3a16 16 0 0 0-3.9 1.7C2.7 8.4 2 12 2.4 15.5A16 16 0 0 0 7.3 18l1-1.4c-.6-.2-1.2-.5-1.7-.8l.4-.3c3.2 1.5 6.7 1.5 9.9 0l.4.3c-.5.3-1.1.6-1.7.8l1 1.4a16 16 0 0 0 5-2.5c.5-4.1-.8-7.6-2.8-10.8Zm-3.9 9.1c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm-5.8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
          </svg>
          Join Discord
        </a>
        <a className="button button-primary" href="#subscribe">
          Subscribe
        </a>
      </div>
    </header>
  );
}
