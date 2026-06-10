const WHY_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM8 13c-3.3 0-6 1.8-6 4v3h12v-3c0-2.2-2.7-4-6-4Zm8 0c-.8 0-1.5.1-2.2.3 1.4.9 2.2 2.2 2.2 3.7v3h6v-3c0-2.2-2.7-4-6-4Z" />
      </svg>
    ),
    title: "Find your people",
    description: "Meet builders, founders, designers, and operators across the Bay Area.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 3 21l8-4 8 4-7-19Zm0 5.2 3.2 8.7-3.2-1.6-3.2 1.6L12 7.2Z" />
      </svg>
    ),
    title: "Learn & level up",
    description: "Workshops, talks, and mentorship to grow your skills and ideas.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z" />
      </svg>
    ),
    title: "Build what matters",
    description: "Tackle real problems, launch projects, and make an impact.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.1a15 15 0 0 0-1.1-5 8 8 0 0 1 4.2 5ZM12 4.1c.8 1.2 1.5 3.5 1.7 6.9h-3.4c.2-3.4.9-5.7 1.7-6.9ZM4.3 13h3.9c.1 1.9.4 3.6.9 5a8 8 0 0 1-4.8-5Zm3.9-2H4.3A8 8 0 0 1 9.1 6c-.5 1.4-.8 3.1-.9 5Zm3.8 8.9c-.8-1.2-1.5-3.5-1.7-6.9h3.4c-.2 3.4-.9 5.7-1.7 6.9Zm2.9-1.9c.5-1.4.8-3.1.9-5h3.1a8 8 0 0 1-4 5Z" />
      </svg>
    ),
    title: "Open & inclusive",
    description: "A welcoming space for everyone, from first-timers to seasoned pros.",
  },
];

export default function WhySection() {
  return (
    <section className="why-section" id="about" aria-labelledby="why-title">
      <div className="section-shell why-layout">
        <div className="why-intro">
          <p className="section-kicker">Why Bay Forge?</p>
          <h2 id="why-title">More than events. A community that builds.</h2>
        </div>

        <div className="why-grid">
          {WHY_ITEMS.map(item => (
            <article className="why-item" key={item.title}>
              <span className="why-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
