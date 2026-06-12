"use client";

import { useEffect, useState } from "react";
import type { EventCardData, EventSectionStats } from "@/lib/events";
import CommunityCountLabel from "./CommunityCountLabel";

type EventsApiResponse = {
  configured: boolean;
  events: EventCardData[];
  stats: EventSectionStats;
};

const EMPTY_STATS: EventSectionStats = {
  eventsHosted: null,
  citiesRepresented: null,
  volunteerLeaders: null,
  partnersSupporters: null,
};

const COMMUNITY_BAND = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 11a4 4 0 1 0-3.2-6.4A5 5 0 0 1 14 8a5 5 0 0 1-1.2 3.2A4 4 0 0 0 16 11Zm-8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.8-6 4v2h12v-2c0-2.2-2.7-4-6-4Zm8 0c-.8 0-1.6.1-2.3.4 1.4.9 2.3 2.1 2.3 3.6v2h6v-2c0-2.2-2.7-4-6-4Z" />
      </svg>
    ),
    value: "community-count",
    label: "Builders & Creators",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 2h2v3h6V2h2v3h3v17H4V5h3V2Zm11 8H6v10h12V10Z" />
      </svg>
    ),
    value: "eventsHosted",
    label: "Events Hosted",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3.1a15 15 0 0 0-1.1-5 8 8 0 0 1 4.2 5ZM12 4.1c.8 1.2 1.5 3.5 1.7 6.9h-3.4c.2-3.4.9-5.7 1.7-6.9ZM4.3 13h3.9c.1 1.9.4 3.6.9 5a8 8 0 0 1-4.8-5Zm3.9-2H4.3A8 8 0 0 1 9.1 6c-.5 1.4-.8 3.1-.9 5Zm3.8 8.9c-.8-1.2-1.5-3.5-1.7-6.9h3.4c-.2 3.4-.9 5.7-1.7 6.9Zm2.9-1.9c.5-1.4.8-3.1.9-5h3.1a8 8 0 0 1-4 5Z" />
      </svg>
    ),
    value: "citiesRepresented",
    label: "Cities Represented",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.2 14.2 8l5.2.6-3.8 3.5 1 5.1L12 14.6l-4.6 2.6 1-5.1-3.8-3.5 5.2-.6L12 3.2Z" />
      </svg>
    ),
    value: "volunteerLeaders",
    label: "Volunteer Leaders",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12a8 8 0 1 1 8 8v-2a6 6 0 1 0-6-6H4Zm8 0h8v2h-8v-2Zm0 0V4h2v8h-2Z" />
      </svg>
    ),
    value: "partnersSupporters",
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

function formatMetric(value: number | null): string {
  return typeof value === "number" ? value.toLocaleString("en-US") : "...";
}

function getCommunityMetric(value: string, stats: EventSectionStats): number | null {
  if (
    value === "eventsHosted" ||
    value === "citiesRepresented" ||
    value === "volunteerLeaders" ||
    value === "partnersSupporters"
  ) {
    return stats[value];
  }

  return null;
}

function isExternalHref(href: string): boolean {
  return href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:");
}

export default function EventsSection() {
  const [eventsData, setEventsData] = useState<EventsApiResponse>({
    configured: false,
    events: [],
    stats: EMPTY_STATS,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/events", { headers: { Accept: "application/json" } })
      .then(response => response.json())
      .then((data: EventsApiResponse) => {
        if (!cancelled) {
          setEventsData({
            configured: Boolean(data.configured),
            events: Array.isArray(data.events) ? data.events : [],
            stats: data.stats ?? EMPTY_STATS,
          });
        }
      })
      .catch(() => {
        // Keep the organizer-published empty state when the backend is unavailable.
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

  const events = eventsData.events;
  const stats = eventsData.stats;
  const emptyMessage = isLoading
    ? "Loading organizer events."
    : "Upcoming events will appear once organizers publish them.";

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

        <div className={events.length > 0 ? "event-grid" : "event-grid event-grid-empty"}>
          {events.length > 0 ? (
            events.map(event => {
              const externalHref = isExternalHref(event.href);

              return (
                <article className="event-card" key={event.id}>
                  <img src={event.imageUrl} alt={event.imageAlt} />
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
                      <div
                        className="avatar-stack"
                        aria-label={
                          typeof event.attending === "number"
                            ? `${event.attending} attending`
                            : "Attendance syncing"
                        }
                      >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <strong>
                          {typeof event.attending === "number"
                            ? `+${event.attending.toLocaleString("en-US")} attending`
                            : "RSVPs syncing"}
                        </strong>
                      </div>
                      <a
                        className="event-action"
                        href={event.href}
                        target={externalHref ? "_blank" : undefined}
                        rel={externalHref ? "noreferrer" : undefined}
                      >
                        {event.action}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="event-empty" role="status">
              <p>{emptyMessage}</p>
            </div>
          )}
        </div>

        <dl className="community-band" id="community" aria-label="Bay Forge community numbers">
          {COMMUNITY_BAND.map(item => (
            <div key={item.label}>
              <dt>
                {item.icon}
                {item.value === "community-count" ? (
                  <CommunityCountLabel />
                ) : (
                  <strong>{formatMetric(getCommunityMetric(item.value, stats))}</strong>
                )}
              </dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
