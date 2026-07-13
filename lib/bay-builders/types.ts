// Types for the Bay Builders Hackathon guest experience.

export type BayRole = "judge" | "speaker" | "speaker-judge" | "sponsor" | "vip" | "cohost";

export interface Guest {
  slug: string;
  name: string;
  role: BayRole;
  /** Display role label, e.g. "SPONSOR · INSFORGE" or "HONORED JUDGE". */
  roleLabel: string;
  company?: string;
  /** Talk slot line for speakers, e.g. "AgentOS — AI Agent Operating System (10:07 AM)". */
  talk?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

export interface NamedBlurb {
  t: string;
  d: string;
}

export interface RoleContent {
  /** Three-line welcome message shown on the invitation. */
  email: { m1: string; m2: string; m3: string; cta: string };
  /** Whether the invitation prints "Dear". */
  dear: boolean;
  /** Detail-view content. */
  d: {
    kicker: string;
    title: string;
    intro: string;
    youBadge: string;
    spotlight: { tag: string; time: string; title: string; lines: string[] };
    timeline: TimelineItem[];
    prep?: string;
    briefNote?: string;
    briefItems?: NamedBlurb[];
    judgingNote?: string;
    judgingItems?: NamedBlurb[];
    perksNote?: string;
    perks?: NamedBlurb[];
    hasPass?: boolean;
    ctaPrimary: string;
  };
}

export const EVENT = {
  date: "Monday, July 13, 2026",
  time: "9:30 AM – 8:00 PM PDT",
  venue: "AWS Builders Loft, San Francisco",
  hosts: "Crewbase Collective + BayForge",
  mc: "Ayush Ojha + Yuran Liu (co-MC)",
  tools: "InsForge · Nebius · AgentOS · You.com",
  discord: "https://discord.gg/r8wrvsfDS5",
} as const;
