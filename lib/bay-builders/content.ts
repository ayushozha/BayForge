// Per-role experience content for the Bay Builders Hackathon guest pages.
// Keyed by role; the guest's own name, company, slug, and talk overlay it at
// render time. Times follow the organizer agenda (schedule table).
import type { RoleContent, BayRole, TimelineItem } from "./types";

const SHARED_EVENING: TimelineItem[] = [
  { time: "5:00 – 6:00 PM", title: "Demos & Judging — Round 1", desc: "Teams demo to judges in groups assigned by Sublet. Strict 5-minute slots: 3-min demo + 2-min Q&A." },
  { time: "6:00 – 6:30 PM", title: "Judges' Deliberation", desc: "Cross-group scoring, discussion, and the winners decision." },
  { time: "6:30 – 8:00 PM", title: "Winners, Demos & Closing", desc: "Winners announced across categories, big-stage demos, thank-yous, group photo." },
];

const JUDGING_ITEMS = [
  { t: "Presentation", d: "A clear, confident demo that lands in 3 minutes." },
  { t: "Execution", d: "A working build, shipped within the day." },
  { t: "Innovation", d: "Original ideas that push what's possible." },
  { t: "Impact", d: "A problem worth solving, for people who need it." },
  { t: "Implementation", d: "Smart engineering under the hood — including the sponsor tools." },
];

export const ROLE_CONTENT: Record<BayRole, RoleContent> = {
  judge: {
    dear: true,
    email: {
      m1: "We are honored to welcome you to the judging panel.",
      m2: "Your expertise will decide which AI organizations built in a single day deserve to win.",
      m3: "Thank you for helping lead Bay Builders Hackathon.",
      cta: "Open Judge Brief",
    },
    d: {
      kicker: "JUDGE BRIEF",
      title: "Your Run of Show",
      intro: "Everything you need to judge Bay Builders Hackathon on July 13.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR ROLE",
        time: "4:00 – 6:30 PM",
        title: "Demos, Scoring & the Winners Decision",
        lines: [
          "Arrive 4:00 – 4:30 PM and check in with the organizers",
          "Log in to Sublet and share your email for judge access",
          "Score each project out of 100 — plus virtual investments in your favorites",
        ],
      },
      timeline: [
        { time: "4:00 – 4:30 PM", title: "Judge Arrival & Sublet Access", desc: "Check in, log in to the submission app, share your email with organizers for judge access.", highlight: true },
        { time: "5:00 PM", title: "Groups Assigned", desc: "Your judging group and project list appear in the Judging section on Sublet.", highlight: true },
        { time: "5:00 – 6:00 PM", title: "Demos & Judging — Round 1", desc: "Teams demo in your group. Strict 5-minute slots: 3-min demo + 2-min Q&A. Keep the clock.", highlight: true },
        { time: "6:00 – 6:30 PM", title: "Cross-group Scoring & Deliberation", desc: "Score remaining projects from other groups, then decide the winners together.", highlight: true },
        { time: "6:30 – 8:00 PM", title: "Winners & Closing", desc: "Winners announced — your verdict, on the big stage." },
      ],
      judgingNote: "Score each project out of 100 across five dimensions — and make virtual investments in the projects you find most promising:",
      judgingItems: JUDGING_ITEMS,
      prep: "Please join the event Discord before the day — judging groups, the project list, and the rubric are shared there.",
      ctaPrimary: "Confirm judging role",
    },
  },

  speaker: {
    dear: false,
    email: {
      m1: "We are thrilled to feature you on the Bay Builders stage.",
      m2: "Your talk kicks off the day that turns a room of builders into AI organizations.",
      m3: "Thank you for being part of Bay Builders Hackathon.",
      cta: "Open Speaker Brief",
    },
    d: {
      kicker: "SPEAKER BRIEF",
      title: "Your Run of Show",
      intro: "Everything for your talk on the Bay Builders stage on July 13.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR TALK",
        time: "Morning block · 10:05 – 11:10 AM",
        title: "Your 5-minute lightning talk",
        lines: [
          "5 minutes total, including a short intro",
          "Arrive by 9:45 AM for an AV + slides check",
          "Punchy beats polished — the room hacks right after you",
        ],
      },
      timeline: [
        { time: "9:45 AM", title: "Arrive & AV Check", desc: "Load slides, mic check, meet the MCs before doors.", highlight: true },
        { time: "10:00 AM", title: "Welcome & Opening Ceremony", desc: "Ayush + Yuran open the room and set the tone." },
        { time: "10:05 – 11:10 AM", title: "Lightning Talk Block", desc: "Your 5-minute slot — exact time is in your spotlight above.", highlight: true },
        { time: "11:10 AM", title: "Hacking Begins", desc: "Stay to mentor, meet teams, and see what they build with it." },
        ...SHARED_EVENING,
      ],
      prep: "Please prepare a short 5-minute slide deck before the day.",
      ctaPrimary: "Confirm speaking slot",
    },
  },

  "speaker-judge": {
    dear: false,
    email: {
      m1: "You are pulling double duty — opening the day on stage, then closing it on the judging panel.",
      m2: "Your voice sets the tone in the morning; your verdict crowns the winners at night.",
      m3: "Thank you for carrying Bay Builders Hackathon end to end.",
      cta: "Open Speaker & Judge Brief",
    },
    d: {
      kicker: "SPEAKER & JUDGE BRIEF",
      title: "Your Run of Show",
      intro: "You open the talks in the morning — and return to judge the finals.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR TALK",
        time: "Morning block · 10:05 – 11:10 AM",
        title: "Your 5-minute lightning talk",
        lines: [
          "5 minutes total, including a short intro — arrive by 9:45 AM for AV check",
          "Back by 4:00 – 4:30 PM for judge check-in and Sublet access",
          "Score projects out of 100 + virtual investments in your favorites",
        ],
      },
      timeline: [
        { time: "9:45 AM", title: "Arrive & AV Check", desc: "Load slides, mic check before doors open at 10:00 AM.", highlight: true },
        { time: "10:05 – 11:10 AM", title: "Lightning Talk Block", desc: "Your 5-minute slot — exact time is in your spotlight above.", highlight: true },
        { time: "11:10 AM", title: "Hacking Begins", desc: "Mentor, meet teams — or step out and return for judging." },
        { time: "4:00 – 4:30 PM", title: "Judge Arrival & Sublet Access", desc: "Check in, log in to Sublet, share your email for judge access.", highlight: true },
        { time: "5:00 – 6:00 PM", title: "Demos & Judging — Round 1", desc: "Teams demo in your assigned group. 3-min demo + 2-min Q&A per team.", highlight: true },
        { time: "6:00 – 6:30 PM", title: "Cross-group Scoring & Deliberation", desc: "Score the remaining projects and decide the winners together.", highlight: true },
        { time: "6:30 – 8:00 PM", title: "Winners & Closing", desc: "Winners announced, big-stage demos, group photo." },
      ],
      judgingNote: "In the evening, score each project out of 100 across five dimensions:",
      judgingItems: JUDGING_ITEMS,
      prep: "Please prepare a 5-minute slide deck, and join the event Discord before the day.",
      ctaPrimary: "Confirm talk & judging role",
    },
  },

  sponsor: {
    dear: false,
    email: {
      m1: "Thank you for powering Bay Builders Hackathon.",
      m2: "Every AI organization built on July 13 will be built on the tools and support {{company}} brings.",
      m3: "Thank you for fueling the builders.",
      cta: "Open Sponsor Brief",
    },
    d: {
      kicker: "SPONSOR BRIEF",
      title: "Your Run of Show",
      intro: "Your booth, talk, workshop, and checkpoint on July 13.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR DAY",
        time: "9:00 AM – 8:00 PM",
        title: "Booth · Talk · Workshop · Checkpoint",
        lines: [
          "Booth setup 9:00 – 10:00 AM with the core team",
          "5-minute talk in the 10:05 – 11:10 AM block",
          "Optional workshop hour 11:00 AM – 12:00 PM as hacking begins",
        ],
      },
      timeline: [
        { time: "9:00 – 10:00 AM", title: "Booth & Signage Setup", desc: "Arrive, set up your booth, AV/Wi-Fi check, load slides.", highlight: true },
        { time: "10:05 – 11:10 AM", title: "Sponsor Lightning Talks", desc: "Your 5-minute talk. Intro included in the slot.", highlight: true },
        { time: "11:00 AM – 12:00 PM", title: "Optional Sponsor Workshop", desc: "Run a hands-on session as teams start building with your tools.", highlight: true },
        { time: "2:00 – 3:00 PM", title: "Mentor / Sponsor Checkpoint", desc: "Informal table visits, feedback, and guidance for the teams." },
        ...SHARED_EVENING,
      ],
      prep: "Please prepare a short 5-minute slide deck, and bring booth materials for the day.",
      ctaPrimary: "Confirm sponsor activation",
    },
  },

  vip: {
    dear: true,
    email: {
      m1: "Your VIP access to Bay Builders Hackathon is confirmed.",
      m2: "Watch a room full of builders assemble entire AI organizations in a single day — and stay for the demos.",
      m3: "Your presence makes the day extraordinary.",
      cta: "View Your VIP Pass",
    },
    d: {
      kicker: "VIP ACCESS",
      title: "Your Pass & Day",
      intro: "Priority everything — and a front-row seat to the builds.",
      youBadge: "VIP",
      spotlight: {
        tag: "YOUR ACCESS",
        time: "ALL DAY",
        title: "Priority Check-in · Reserved Seating",
        lines: [
          "Priority check-in — skip the line",
          "Reserved seating for talks and the finale",
          "All-day access to talks, demos, and the winners' reveal",
        ],
      },
      hasPass: true,
      timeline: [
        { time: "10:00 AM", title: "Doors & Opening Ceremony", desc: "Priority check-in, reserved seating up front.", highlight: true },
        { time: "10:05 – 11:10 AM", title: "Lightning Talks", desc: "AWS, Nebius, InsForge, AgentOS, and more — five minutes each." },
        { time: "11:10 AM", title: "Hacking Begins", desc: "The room splits into teams and starts building." },
        { time: "1:00 – 2:00 PM", title: "Lunch & Networking", desc: "Food and conversation with hosts, sponsors, and judges." },
        ...SHARED_EVENING,
      ],
      perksNote: "What your pass unlocks",
      perks: [
        { t: "Priority Check-in", d: "A dedicated, no-wait entrance." },
        { t: "Reserved Seating", d: "Front-row for the ceremony and finale." },
        { t: "Inner Circle", d: "Networking with hosts, sponsors & judges." },
        { t: "Full Access", d: "Every talk, demo, and the winners' reveal." },
      ],
      ctaPrimary: "Confirm VIP attendance",
    },
  },

  cohost: {
    dear: false,
    email: {
      m1: "The build is yours to run.",
      m2: "As a co-host, you set the tempo of the day — the welcome, the transitions, the energy that carries Bay Builders Hackathon from setup to the final reveal.",
      m3: "Let's make it unforgettable.",
      cta: "Open the Run of Show",
    },
    d: {
      kicker: "CO-HOST · CORE TEAM",
      title: "Your Command of the Day",
      intro: "Everything you run, cue, and hand off on July 13 — start to close.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR ROLE",
        time: "9:00 AM – 8:00 PM",
        title: "Host the room · Keep the clock · Land the finale",
        lines: [
          "Core team on site at 9:00 AM — registration, name tags, signage, AV/Wi-Fi, booths",
          "Ayush + Yuran MC; keep every talk to its 5-minute slot",
          "Run the closing: winners, thank-yous, and the group photo",
        ],
      },
      timeline: [
        { time: "9:00 – 10:00 AM", title: "Pre-Event Setup", desc: "Registration desk, name tags, signage, AV/Wi-Fi check, sponsor booths.", highlight: true },
        { time: "10:00 AM", title: "Welcome & Opening Ceremony", desc: "Doors open. Ayush + Yuran set the tone and introduce Crewbase Collective + BayForge.", highlight: true },
        { time: "10:05 – 11:10 AM", title: "Lightning Talk Block", desc: "12 talks, ~5 minutes each. Crisp intros, tight clock.", highlight: true },
        { time: "11:05 – 11:10 AM", title: "Rules, Tracks & Submission Brief", desc: "Saurabh covers tracks, sponsor tools, Sublet, Discord, deadlines, prizes." },
        { time: "11:10 AM", title: "Hacking Begins", desc: "Help desk live, Discord monitored, workshops 11 AM – 12 PM.", highlight: true },
        { time: "1:00 – 3:00 PM", title: "Lunch, then Mentor Checkpoint", desc: "Lunch 1–2 PM; sponsor/mentor table visits 2–3 PM." },
        { time: "5:00 PM", title: "Submissions Close", desc: "Projects due on Sublet; eligibility verified.", highlight: true },
        { time: "5:00 – 6:30 PM", title: "Demos, Judging & Deliberation", desc: "MC the demos, enforce the 5-minute timer, shepherd judges through deliberation.", highlight: true },
        { time: "6:30 – 8:00 PM", title: "Winners & Closing", desc: "Winners, big-stage demos, thank-yous, group photo, wrap.", highlight: true },
      ],
      briefNote: "Your hosting checklist for the day:",
      briefItems: [
        { t: "Set the Tempo", d: "Every block starts and ends on time — you hold the clock." },
        { t: "Smooth Handoffs", d: "Clean intros and transitions between MCs, speakers, and Saurabh's brief." },
        { t: "Read the Room", d: "Lift the energy at kickoff, demos, and the finale." },
        { t: "Speaker Intros", d: "A crisp intro before each 5-minute lightning talk." },
        { t: "Land the Close", d: "Winners, thank-yous, group photo — end on a high." },
      ],
      prep: "Skim the full run of show before the day, and sync with the core team on who calls each block.",
      ctaPrimary: "Confirm co-host role",
    },
  },
};
