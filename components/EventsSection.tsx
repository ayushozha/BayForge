import Image, { type StaticImageData } from "next/image";
import workshop from "@/public/assets/3.png";
import goldenGate from "@/public/assets/2.png";
import mixer from "@/public/assets/6.png";

type Event = {
  image: StaticImageData;
  imageAlt: string;
  type: string;
  title: string;
  date: string;
  location: string;
  description: string;
  attending: number;
  action: string;
};

const EVENTS: Event[] = [
  {
    image: goldenGate,
    imageAlt: "Bay Forge builders gathered near the Golden Gate Bridge",
    type: "Hackathon",
    title: "AI for Good Hackathon",
    date: "Jun 14 - 15, 2025",
    location: "San Francisco, CA",
    description: "Build AI-powered solutions for social impact with mentors, workshops, and prizes.",
    attending: 127,
    action: "Register Now",
  },
  {
    image: mixer,
    imageAlt: "Bay Forge members at a community mixer",
    type: "Meetup",
    title: "Founders & Builders Mixer",
    date: "Jun 26, 2025",
    location: "Palo Alto, CA",
    description: "Connect with founders, investors, and operators building the future.",
    attending: 89,
    action: "RSVP",
  },
  {
    image: workshop,
    imageAlt: "Bay Forge workshop with builders learning AI agents",
    type: "Workshop",
    title: "Build with LLMs Workshop",
    date: "Jul 12, 2025",
    location: "Berkeley, CA",
    description: "Hands-on workshop to build production apps with LLMs and modern tools.",
    attending: 64,
    action: "Save Spot",
  },
];

const COMMUNITY_BAND = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 11a4 4 0 1 0-3.2-6.4A5 5 0 0 1 14 8a5 5 0 0 1-1.2 3.2A4 4 0 0 0 16 11Zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.8-6 4v2h12v-2c0-2.2-2.7-4-6-4Zm8 0c-.8 0-1.6.1-2.3.4 1.4.9 2.3 2.1 2.3 3.6v2h6v-2c0-2.2-2.7-4-6-4Z" />
      </svg>
    ),
    value: "8,500+",
    label: "Builders & Creators",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2h2v3h6V2h2v3h3v17H4V5h3V2Zm11 8H6v10h12V10Z" />
      </svg>
    ),
    value: "120+",
    label: "Events Hosted",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.1a15 15 0 0 0-1.1-5 8 8 0 0 1 4.2 5ZM12 4.1c.8 1.2 1.5 3.5 1.7 6.9h-3.4c.2-3.4.9-5.7 1.7-6.9ZM4.3 13h3.9c.1 1.9.4 3.6.9 5a8 8 0 0 1-4.8-5Zm3.9-2H4.3A8 8 0 0 1 9.1 6c-.5 1.4-.8 3.1-.9 5Zm3.8 8.9c-.8-1.2-1.5-3.5-1.7-6.9h3.4c-.2 3.4-.9 5.7-1.7 6.9Zm2.9-1.9c.5-1.4.8-3.1.9-5h3.1a8 8 0 0 1-4 5Z" />
      </svg>
    ),
    value: "65+",
    label: "Cities Represented",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.2 14.2 8l5.2.6-3.8 3.5 1 5.1L12 14.6l-4.6 2.6 1-5.1-3.8-3.5 5.2-.6L12 3.2Z" />
      </svg>
    ),
    value: "280+",
    label: "Volunteer Leaders",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12a8 8 0 1 1 8 8v-2a6 6 0 1 0-6-6H4Zm8 0h8v2h-8v-2Zm0 0V4h2v8h-2Z" />
      </svg>
    ),
    value: "150+",
    label: "Partners & Supporters",
  },
];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2h2v3h6V2h2v3h3v17H4V5h3V2Zm11 8H6v10h12V10Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
    </svg>
  );
}

export default function EventsSection() {
  return (
    <section className="events-section" id="events" aria-labelledby="events-title">
      <div className="section-shell">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Upcoming events</p>
            <h2 id="events-title">Join us at our next events</h2>
          </div>
          <a className="text-link" href="#subscribe">
            View all events
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.3 5.3 20 12l-6.7 6.7-1.4-1.4 4.3-4.3H4v-2h12.2l-4.3-4.3 1.4-1.4Z" />
            </svg>
          </a>
        </div>

        <div className="event-grid">
          {EVENTS.map(event => (
            <article className="event-card" key={event.title}>
              <Image
                src={event.image}
                alt={event.imageAlt}
                fill
                sizes="(max-width: 860px) 100vw, 33vw"
              />
              <div className="event-card-content">
                <span className="event-type">{event.type}</span>
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span>
                    <CalendarIcon />
                    {event.date}
                  </span>
                  <span>
                    <LocationIcon />
                    {event.location}
                  </span>
                </div>
                <p>{event.description}</p>
                <div className="event-card-footer">
                  <div className="avatar-stack" aria-label={`${event.attending} attending`}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <strong>+{event.attending} attending</strong>
                  </div>
                  <a className="event-action" href="#subscribe">
                    {event.action}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <dl className="community-band" id="community" aria-label="Bay Forge community numbers">
          {COMMUNITY_BAND.map(item => (
            <div key={item.label}>
              <dt>
                {item.icon}
                <strong>{item.value}</strong>
              </dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
