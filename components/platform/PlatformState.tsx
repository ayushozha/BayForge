import Link from "next/link";

type PlatformStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function PlatformState({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: PlatformStateProps) {
  return (
    <main className="platform-content">
      <section className="platform-inline-state">
        <div className="platform-state-code" aria-hidden="true">
          403
        </div>
        <div>
          <p className="platform-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="platform-state-actions">
            <Link className="platform-button platform-button-primary" href={primaryHref}>
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel && (
              <Link className="platform-button platform-button-secondary" href={secondaryHref}>
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
