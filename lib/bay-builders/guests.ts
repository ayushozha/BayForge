// Bay Builders Hackathon 2026 guest roster. Mirrors the campaign roster in
// Events/07-13-2026 Bay Builders Hackathon by BayForge/Guests/bay-builders-guests.json.
// Each guest opens a personalized page at /bay-builders-hackathon/<slug>.
// Ayush appears twice on purpose (judge page + cohost page), same as Wizard 2026.
import type { Guest } from "./types";

export const GUESTS: Guest[] = [
  { slug: "vince-kohli", name: "Vince Kohli", role: "judge", roleLabel: "HONORED JUDGE" },
  { slug: "abhi-vasanth", name: "Abhi Vasanth", role: "judge", roleLabel: "HONORED JUDGE" },
  { slug: "ayush-ojha", name: "Ayush Ojha", role: "judge", roleLabel: "HONORED JUDGE", company: "BayForge" },
  { slug: "katherine-brough", name: "Katherine Brough", role: "judge", roleLabel: "HONORED JUDGE", company: "NuPath" },
  { slug: "anya-ozmen", name: "Anya Ozmen", role: "judge", roleLabel: "HONORED JUDGE", company: "Gameer" },
  { slug: "katherine-gao", name: "Katherine Gao", role: "judge", roleLabel: "HONORED JUDGE", company: "UCSD" },
  { slug: "eeshan-gulhati", name: "Eeshan Gulhati", role: "judge", roleLabel: "HONORED JUDGE", company: "Argide" },
  { slug: "devinder-sodhi", name: "Devinder Sodhi", role: "judge", roleLabel: "HONORED JUDGE" },
  { slug: "dathan-guiley", name: "Dathan Guiley", role: "judge", roleLabel: "HONORED JUDGE", company: "Wilde Agency" },
  { slug: "ruomeng-sun", name: "Ruomeng Sun", role: "judge", roleLabel: "HONORED JUDGE" },
  { slug: "kollaikal-rupesh", name: "Kollaikal Rupesh", role: "judge", roleLabel: "HONORED JUDGE" },
  { slug: "shouvik-sharma", name: "Shouvik Sharma", role: "judge", roleLabel: "HONORED JUDGE" },
  { slug: "zhi-ling", name: "Zhi Ling", role: "judge", roleLabel: "HONORED JUDGE", company: "Attrilo" },
  { slug: "elaine-h", name: "Elaine H", role: "judge", roleLabel: "HONORED JUDGE", company: "Clera" },
  { slug: "can-lyu", name: "Can Lyu", role: "judge", roleLabel: "HONORED JUDGE", company: "InsForge" },
  { slug: "paramita-banik", name: "Paramita Banik", role: "judge", roleLabel: "HONORED JUDGE", company: "AIxccelerate" },

  { slug: "amitabh-das", name: "Amitabh Das", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "AgentOS", talk: "AgentOS — AI Agent Operating System · 10:07 AM" },
  { slug: "wei-dou", name: "Wei Dou", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "InsForge", talk: "InsForge — Agent-native backend · 10:12 AM" },
  { slug: "merve-isler", name: "Merve Isler", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "AI Insiders", talk: "AI Insiders — AI ecosystem for founders & investors · 10:25 AM" },
  { slug: "alice-shikova", name: "Alice Shikova", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "Space ID", talk: "Space ID — GTM for AI companies · 10:30 AM" },
  { slug: "gunjan-ramteke", name: "Gunjan Ramteke", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "AWS", talk: "AWS — Building with AWS · 10:35 AM" },
  { slug: "colin-lowenberg", name: "Colin Lowenberg", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "Nebius", talk: "Nebius AI Cloud + Tavily · 10:40 AM" },
  { slug: "harnoor-singh", name: "Harnoor Singh", role: "speaker-judge", roleLabel: "GUEST SPEAKER & JUDGE", company: "HydraDB", talk: "HydraDB · 10:45 AM" },

  { slug: "mansi-more", name: "Mansi More", role: "speaker", roleLabel: "FEATURED SPEAKER", company: "RocketRide", talk: "RocketRide · 10:50 AM" },
  { slug: "eva", name: "Eva", role: "speaker", roleLabel: "FEATURED SPEAKER", company: "GrowthMasters", talk: "Kylon and Nimbus · 10:55 AM" },

  { slug: "tony-chang", name: "Tony Chang", role: "sponsor", roleLabel: "SPONSOR · INSFORGE", company: "InsForge" },
  { slug: "ivar-guerrero", name: "Ivar Guerrero", role: "sponsor", roleLabel: "SPONSOR · TAVILY", company: "Tavily" },

  { slug: "coco", name: "Coco", role: "cohost", roleLabel: "CO-HOST · CORE TEAM", company: "FinChip" },
  { slug: "chenxi-huang", name: "Chenxi Huang", role: "cohost", roleLabel: "CO-HOST · CORE TEAM", company: "FinChip" },
  { slug: "gary", name: "Gary", role: "cohost", roleLabel: "CO-HOST · CORE TEAM", company: "FinChip", talk: "FinChip · 11:00 AM" },
  { slug: "saurabh-khire", name: "Saurabh Khire", role: "cohost", roleLabel: "CO-HOST · CORE TEAM", company: "Crewbase Collective", talk: "About Crewbase · 10:05 AM + Govia · 10:17 AM + Rules & Tracks · 11:05 AM" },
  { slug: "yuran-liu", name: "Yuran Liu", role: "cohost", roleLabel: "CO-HOST · CORE TEAM · MC", company: "AGI Summit · Bay AI Circle", talk: "AGI Summit & BayAICircle · 10:20 AM + co-MC" },
  { slug: "ayush", name: "Ayush Ojha", role: "cohost", roleLabel: "CO-HOST · CORE TEAM · MC", company: "BayForge" },
];

const BY_SLUG = new Map(GUESTS.map((g) => [g.slug, g]));

export function getGuest(slug: string): Guest | undefined {
  return BY_SLUG.get(slug);
}

export function allSlugs(): string[] {
  return GUESTS.map((g) => g.slug);
}
