// Per-role experience content for the Wizard Hackathon guest pages.
// Keyed by role so every judge/sponsor/etc. shares the same brief; the guest's
// own name, company, slug, and card overlay it at render time.
import type { RoleContent, WizardRole } from "./types";

export const ROLE_CONTENT: Record<WizardRole, RoleContent> = {
  sponsor: {
    dear: false,
    laurel: true,
    email: {
      m1: "We are thrilled to welcome you as a sponsor.",
      m2: "{{company}} helps power the builders, bold experiments, and magical innovation behind Wizard Hackathon 2026.",
      m3: "Thank you for fueling the future.",
      cta: "Open Sponsor Brief",
    },
    d: {
      kicker: "SPONSOR BRIEF",
      title: "Your Run of Show",
      intro: "Everything for your talk, booth, and media interviews on June 28.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR TALK",
        time: "Lightning talk",
        title: "Your 5-minute sponsor talk",
        lines: [
          "5-minute talk — you present your own slides",
          "MC intro by Melly (~30s)",
          "Booth time before and after to meet builders",
        ],
      },
      timeline: [
        { time: "8:00 – 9:00 AM", title: "Setup & Booth", desc: "Arrive, set up your sponsor booth, AV / Wi-Fi check, load slides & mic-check." },
        { time: "9:30 – 10:00 AM", title: "Sponsor Lightning Talks", desc: "5 minutes on stage. Intro by Melly.", highlight: true },
        { time: "11:00 AM – 12:00 PM", title: "Optional Sponsor Workshop", desc: "Run a hands-on workshop as hacking begins." },
        { time: "11:15 AM – 12:15 PM", title: "Morning Media Interview", desc: "Off-stage with Melly + Coco, 5–8 min — doesn’t interrupt the room.", highlight: true },
        { time: "2:00 – 3:30 PM", title: "Mentor Table Visits", desc: "Visit teams and answer questions at your booth." },
        { time: "3:30 – 4:30 PM", title: "Afternoon Media Interview", desc: "If you return early, interviewed off-stage before judging." },
        { time: "6:00 – 7:00 PM", title: "Finalist Deliberation", desc: "Join the judges to help pick the winners.", highlight: true },
      ],
      hasInterview: true,
      interviewNote: "Two windows, off-stage with Melly + Coco. Aim for 5–8 minutes — pick 3–4 questions.",
      questions: [
        "In one sentence — what does {{company}} do, and who is it for?",
        "Why did you want to sponsor a hackathon like Wizard?",
        "What can builders do with {{company}} today that they couldn’t a year ago?",
        "What’s the most exciting thing you’ve seen built with it?",
        "Any tips for teams chasing the “Best Use of {{company}}” prize?",
        "Where should people go to learn more or get started?",
      ],
      prep: "Please prepare a short 5-minute slide deck before the day.",
      ctaPrimary: "Confirm talk & interview slot",
    },
  },

  "speaker-judge": {
    dear: false,
    laurel: false,
    email: {
      m1: "We are honored to welcome you as our guest speaker and judge.",
      m2: "Your voice and expertise will help inspire magical ideas and meaningful innovation.",
      m3: "Thank you for being part of Wizard Hackathon 2026.",
      cta: "Open Speaker Brief",
    },
    d: {
      kicker: "SPEAKER & JUDGE BRIEF",
      title: "Your Run of Show",
      intro: "You open the talks — then return to judge the finals.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR TALK",
        time: "9:30 – 9:35 AM",
        title: "Opening Talk",
        lines: [
          "5-minute opening lightning talk",
          "MC intro by Melly (~30s)",
          "Load slides & mic-check 8:00–9:00 AM",
        ],
      },
      timeline: [
        { time: "8:00 – 9:00 AM", title: "Load Slides & Mic-check", desc: "Arrive early, test audio, load your deck." },
        { time: "9:00 – 9:30 AM", title: "Welcome & Opening Ceremony", desc: "“Enter the forge.” Hosts Bay Forge + FinChip." },
        { time: "9:30 – 9:35 AM", title: "Your Opening Talk", desc: "5-minute opening lightning talk. Intro by Melly.", highlight: true },
        { time: "10:15 – 10:35 AM", title: "Rules, Tracks & Submission Brief", desc: "Ayush walks through tracks, tools, and deadlines — worth a listen." },
        { time: "5:00 – 6:00 PM", title: "Demos & Judging — Round 1", desc: "All teams demo to judges. MC keeps the clock.", highlight: true },
        { time: "6:00 – 7:00 PM", title: "Finalist Demos & Deliberation", desc: "Top teams re-demo; judges + sponsors pick winners.", highlight: true },
        { time: "7:00 – 8:00 PM", title: "Winners & Closing", desc: "Announcements, thanks, group photo." },
      ],
      judgingNote: "When you judge the finals in the evening, look for:",
      judgingItems: [
        { t: "Innovation", d: "Original ideas that push what’s possible." },
        { t: "Imagination", d: "Magic in the concept and the craft." },
        { t: "Execution", d: "A working, well-demoed build under time." },
        { t: "Best Use of Tools", d: "Smart use of FinChip, InsForge & Nebius." },
      ],
      prep: "Please prepare a 5-minute slide deck for your opening talk.",
      ctaPrimary: "Confirm speaking slot",
    },
  },

  judge: {
    dear: true,
    laurel: false,
    email: {
      m1: "We are delighted to welcome you as a judge.",
      m2: "Your insight will help champion innovation, imagination, and outstanding execution.",
      m3: "Thank you for helping lead Wizard Hackathon 2026.",
      cta: "Open Judge Brief",
    },
    d: {
      kicker: "JUDGE BRIEF",
      title: "Your Run of Show",
      intro: "You help judge the demos and crown the winners.",
      youBadge: "YOU",
      spotlight: {
        tag: "YOUR ROLE",
        time: "5:00 – 7:00 PM",
        title: "Demos & Finalist Judging",
        lines: [
          "Score Round 1 demos from every team",
          "Deliberate on the finalists with fellow judges",
          "Help pick the overall and category winners",
        ],
      },
      timeline: [
        { time: "9:00 – 9:30 AM", title: "Welcome & Opening", desc: "“Enter the forge.” Hosts Bay Forge + FinChip." },
        { time: "10:15 – 10:35 AM", title: "Rules, Tracks & Submission Brief", desc: "Tracks, required tools, Sublet submission, Discord, deadlines, prizes." },
        { time: "1:00 – 2:00 PM", title: "Lunch & Mentoring", desc: "Optional: visit teams and answer questions." },
        { time: "5:00 – 6:00 PM", title: "Demos & Judging — Round 1", desc: "All teams demo to the judges.", highlight: true },
        { time: "6:00 – 7:00 PM", title: "Finalist Demos & Deliberation", desc: "Top teams re-demo; deliberate and pick winners.", highlight: true },
        { time: "7:00 – 8:00 PM", title: "Winners Announcement & Closing", desc: "Announce winners, thank everyone, wrap.", highlight: true },
      ],
      judgingNote: "In the evening rounds, what you’re scoring:",
      judgingItems: [
        { t: "Innovation", d: "Original ideas that push what’s possible." },
        { t: "Imagination", d: "Magic in the concept and the craft." },
        { t: "Outstanding Execution", d: "A working, well-demoed build under time." },
        { t: "Best Use of Tools", d: "Smart use of FinChip, InsForge & Nebius." },
      ],
      ctaPrimary: "Confirm judging role",
    },
  },

  vip: {
    dear: true,
    laurel: false,
    email: {
      m1: "We are honored to grant you VIP access.",
      m2: "Step beyond the veil into a day where magic meets innovation — reserved seating and moments crafted for our most valued guests.",
      m3: "Your presence makes the experience extraordinary.",
      cta: "View Your VIP Pass",
    },
    d: {
      kicker: "VIP ACCESS",
      title: "Your Pass & Day",
      intro: "Priority everything — and a front-row seat to the magic.",
      youBadge: "VIP",
      spotlight: {
        tag: "YOUR ACCESS",
        time: "ALL DAY",
        title: "Inner Circle · Reserved Seating",
        lines: [
          "Priority check-in — skip the line",
          "Reserved seating for talks & finale",
          "All-day access to talks, demos & the finale",
        ],
      },
      hasPass: true,
      timeline: [
        { time: "8:00 – 9:00 AM", title: "Priority Check-in", desc: "Skip the line, grab your name tag and VIP lanyard.", highlight: true },
        { time: "9:00 – 9:30 AM", title: "Opening Ceremony", desc: "“Enter the forge.” Reserved seating up front.", highlight: true },
        { time: "9:30 – 10:00 AM", title: "Sponsor Lightning Talks", desc: "Founders, five minutes each." },
        { time: "10:45 AM", title: "Kickoff — Hacking Begins", desc: "The countdown, then builders start." },
        { time: "1:00 – 2:00 PM", title: "Lunch & Networking", desc: "Food and conversation with the inner circle." },
        { time: "5:00 – 7:00 PM", title: "Demos & Judging", desc: "Watch teams demo to the judges.", highlight: true },
        { time: "7:00 – 8:00 PM", title: "Winners & Closing", desc: "The finale, group photo, and wrap.", highlight: true },
      ],
      perksNote: "What your pass unlocks",
      perks: [
        { t: "Priority Check-in", d: "A dedicated, no-wait entrance." },
        { t: "Reserved Seating", d: "Front-row for the ceremony and finale." },
        { t: "Inner Circle", d: "Networking with hosts, sponsors & judges." },
        { t: "Full Access", d: "Every talk, demo, and the winners’ reveal." },
      ],
      ctaPrimary: "Add VIP pass to wallet",
    },
  },
};
