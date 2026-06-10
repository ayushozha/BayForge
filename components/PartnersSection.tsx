const PARTNERS = [
  "Google",
  "AWS",
  "GitHub",
  "stripe",
  "Notion",
  "Vercel",
  "MongoDB",
  "OpenAI",
  "Figma",
];

export default function PartnersSection() {
  return (
    <section className="partners-section" id="sponsors" aria-labelledby="partners-title">
      <div className="section-shell">
        <div className="partner-card">
          <p className="section-kicker" id="partners-title">
            Thanks to our partners
          </p>
          <div className="partner-logos" aria-label="Partner logos">
            {PARTNERS.map(partner => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
