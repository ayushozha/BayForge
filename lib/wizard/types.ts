// Types for the Wizard Hackathon guest experience.

export type WizardRole = "judge" | "speaker-judge" | "sponsor" | "vip" | "cohost";

export interface Guest {
  slug: string;
  name: string;
  role: WizardRole;
  /** Display role label, e.g. "SPONSOR · NEBIUS" or "HONORED JUDGE". */
  roleLabel: string;
  company?: string;
  /** Source invitation-card number (image lives at /wizard-hackathon/cards/<slug>.png). */
  card?: number;
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
  /** Whether the invitation prints "Dear" / shows the laurel. */
  dear: boolean;
  laurel: boolean;
  /** Detail-view content. */
  d: {
    kicker: string;
    title: string;
    intro: string;
    youBadge: string;
    spotlight: { tag: string; time: string; title: string; lines: string[] };
    timeline: TimelineItem[];
    prep?: string;
    hasInterview?: boolean;
    interviewNote?: string;
    questions?: string[];
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
  date: "Sunday, June 28, 2026",
  time: "9:00 AM – 8:00 PM",
  venue: "Frontier Tower, San Francisco",
  hosts: "Bay Forge + FinChip",
  mc: "Yuran Liu + Ayush Ojha (co-MC)",
  tools: "FinChip · InsForge · Nebius",
} as const;
