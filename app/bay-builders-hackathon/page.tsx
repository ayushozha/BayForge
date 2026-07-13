import type { Metadata } from "next";
import Link from "next/link";
import { GUESTS } from "@/lib/bay-builders/guests";
import { EVENT } from "@/lib/bay-builders/types";

export const metadata: Metadata = {
  title: "Bay Builders Hackathon 2026 · Build your own AI organization",
  description:
    "One day. Build an entire AI organization from scratch, ship it, and demo live — July 13, 2026 at AWS Builders Loft, San Francisco. Hosted by Crewbase Collective + BayForge.",
  openGraph: {
    title: "Bay Builders Hackathon 2026",
    description:
      "Build your own AI organization in a single day — July 13, 2026, AWS Builders Loft, San Francisco.",
    images: ["/bay-builders-hackathon/assets/cover.jpg"],
  },
};

const AGENDA = [
  { time: "9:30 AM", title: "Doors & Check-in", desc: "Registration, name tags, coffee, and sponsor booths open." },
  { time: "10:00 AM", title: "Welcome & Opening Ceremony", desc: "Ayush + Yuran open the room and set the tone for the day." },
  { time: "10:05 – 11:10 AM", title: "Lightning Talks", desc: "12 five-minute talks from sponsors, founders, and partners.", hi: true },
  { time: "11:10 AM", title: "Hacking Begins", desc: "The room splits into teams and starts building. Workshops 11 AM – 12 PM.", hi: true },
  { time: "1:00 – 2:00 PM", title: "Lunch & Networking", desc: "Food and conversation with hosts, sponsors, and judges." },
  { time: "2:00 – 3:00 PM", title: "Mentor Checkpoint", desc: "Sponsor and mentor table visits — feedback and guidance for every team." },
  { time: "5:00 PM", title: "Submissions Close", desc: "Projects due on Sublet. Eligibility verified." },
  { time: "5:00 – 6:30 PM", title: "Demos & Judging", desc: "3-min demo + 2-min Q&A per team, scored across five dimensions.", hi: true },
  { time: "6:30 – 8:00 PM", title: "Winners & Closing", desc: "Winners announced, big-stage demos, thank-yous, and the group photo.", hi: true },
];

const CRITERIA = [
  { t: "Presentation", d: "A clear, confident demo that lands in 3 minutes." },
  { t: "Execution", d: "A working build, shipped within the day." },
  { t: "Innovation", d: "Original ideas that push what's possible." },
  { t: "Impact", d: "A problem worth solving, for people who need it." },
  { t: "Implementation", d: "Smart engineering under the hood — sponsor tools included." },
];

const PARTNERS = ["AWS", "Nebius", "InsForge", "AgentOS", "You.com", "Tavily", "HydraDB"];

export default function BayBuildersLanding() {
  const judges = GUESTS.filter((g) => g.role === "judge" || g.role === "speaker-judge");
  const talks = GUESTS.filter((g) => g.talk && (g.role === "speaker" || g.role === "speaker-judge"))
    .map((g) => ({ name: g.name, company: g.company, talk: g.talk as string }));

  return (
    <div className="bb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Archivo:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
        .bb-root{
          --paper:#faf8f2; --card:#fffdf8; --ink:#191734; --muted:#5d5b78; --faint:#8b89a3;
          --cyan:#0993b8; --violet:#6d3fe0; --magenta:#d6336c;
          --grad:linear-gradient(100deg,#0aa9cf 0%,#6d3fe0 52%,#e0447c 100%);
          --edge:rgba(25,23,52,0.14);
          min-height:100vh;color:var(--ink);font-family:'Archivo',sans-serif;
          background:
            repeating-linear-gradient(0deg, rgba(38,60,150,0.045) 0 1px, transparent 1px 28px),
            repeating-linear-gradient(90deg, rgba(38,60,150,0.045) 0 1px, transparent 1px 28px),
            radial-gradient(120% 60% at 50% -8%, rgba(10,169,207,0.12) 0%, rgba(250,248,242,0) 60%),
            var(--paper);
        }
        .bb-wrap{max-width:1040px;margin:0 auto;padding:0 24px;}
        .bb-grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .bb-mono{font-family:'Space Mono',monospace;}
        .bb-disp{font-family:'Unbounded',sans-serif;}

        /* nav */
        .bb-nav{display:flex;align-items:center;justify-content:space-between;padding:26px 0 8px;}
        .bb-nav img{height:34px;width:auto;}
        .bb-nav a{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;color:var(--ink);text-decoration:none;border:1.5px solid var(--ink);border-radius:999px;padding:9px 16px;transition:transform .15s ease,box-shadow .15s ease;box-shadow:3px 3px 0 rgba(25,23,52,0.10);}
        .bb-nav a:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 rgba(10,169,207,0.28);}

        /* hero */
        .bb-hero{padding:56px 0 40px;text-align:center;}
        .bb-eyebrow{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:5px;color:var(--faint);}
        .bb-title{font-family:'Unbounded',sans-serif;font-weight:900;font-size:66px;line-height:1.02;margin:18px auto 0;max-width:900px;}
        .bb-sub{font-size:18px;line-height:1.55;color:var(--muted);max-width:620px;margin:22px auto 0;}
        .bb-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:28px 0 0;}
        .bb-chip{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:1px;color:var(--ink);background:var(--card);border:1.5px solid var(--ink);border-radius:999px;padding:9px 15px;box-shadow:3px 3px 0 rgba(25,23,52,0.08);}
        .bb-cta{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin:34px 0 0;}
        .bb-btn{font-family:'Space Mono',monospace;font-weight:700;font-size:12px;letter-spacing:2px;text-decoration:none;border:1.5px solid var(--ink);border-radius:999px;padding:15px 26px;transition:transform .15s ease,box-shadow .15s ease;}
        .bb-btn.primary{color:#fff;background:var(--ink);box-shadow:4px 4px 0 rgba(10,169,207,0.4);}
        .bb-btn.primary:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 rgba(214,51,108,0.45);}
        .bb-btn.ghost{color:var(--ink);background:var(--card);box-shadow:4px 4px 0 rgba(25,23,52,0.10);}
        .bb-btn.ghost:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 rgba(109,63,224,0.3);}

        .bb-cover{margin:46px auto 0;max-width:920px;border:2px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:8px 8px 0 rgba(25,23,52,0.12);}
        .bb-cover img{display:block;width:100%;height:auto;}

        /* section scaffold */
        .bb-sec{padding:64px 0 8px;}
        .bb-kicker{font-family:'Space Mono',monospace;font-weight:700;font-size:11px;letter-spacing:4px;margin-bottom:14px;}
        .bb-h2{font-family:'Unbounded',sans-serif;font-weight:700;font-size:34px;line-height:1.12;margin:0 0 10px;}
        .bb-lead{font-size:16px;color:var(--muted);max-width:640px;line-height:1.55;}

        /* card grid */
        .bb-grid{display:grid;gap:16px;margin-top:30px;}
        .g3{grid-template-columns:repeat(3,1fr);}
        .g2{grid-template-columns:repeat(2,1fr);}
        .bb-card{background:var(--card);border:1.5px solid var(--ink);border-radius:14px;padding:24px;box-shadow:5px 5px 0 rgba(25,23,52,0.10);}
        .bb-card .n{font-family:'Space Mono',monospace;font-size:12px;color:var(--cyan);}
        .bb-card h3{font-family:'Unbounded',sans-serif;font-weight:700;font-size:19px;margin:10px 0 8px;line-height:1.2;}
        .bb-card p{font-size:15px;color:var(--muted);line-height:1.55;margin:0;}

        /* timeline */
        .bb-time{margin-top:30px;border-left:2px solid var(--edge);}
        .bb-row{display:grid;grid-template-columns:150px 1fr;gap:20px;padding:16px 0 16px 22px;position:relative;border-bottom:1px dashed var(--edge);}
        .bb-row::before{content:"";position:absolute;left:-7px;top:22px;width:11px;height:11px;border-radius:50%;background:var(--paper);border:2px solid var(--faint);}
        .bb-row.hi::before{background:var(--violet);border-color:var(--violet);box-shadow:0 0 0 4px rgba(109,63,224,0.16);}
        .bb-row .t{font-family:'Space Mono',monospace;font-weight:700;font-size:13px;color:var(--ink);}
        .bb-row .b h4{font-family:'Unbounded',sans-serif;font-weight:600;font-size:16px;margin:0 0 4px;}
        .bb-row .b p{font-size:14px;color:var(--muted);margin:0;line-height:1.5;}

        /* partners */
        .bb-partners{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;}
        .bb-partner{font-family:'Unbounded',sans-serif;font-weight:700;font-size:16px;padding:14px 22px;border:1.5px solid var(--ink);border-radius:12px;background:var(--card);box-shadow:4px 4px 0 rgba(25,23,52,0.08);}

        /* people */
        .bb-people{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin-top:28px;}
        .bb-person{background:var(--card);border:1.5px solid var(--ink);border-radius:12px;padding:16px 18px;box-shadow:4px 4px 0 rgba(25,23,52,0.08);}
        .bb-person .pn{font-family:'Unbounded',sans-serif;font-weight:700;font-size:16px;}
        .bb-person .pc{font-family:'Space Mono',monospace;font-size:11px;color:var(--muted);margin-top:5px;letter-spacing:1px;}

        .bb-talks{margin-top:28px;display:grid;gap:10px;}
        .bb-talk{display:flex;gap:14px;align-items:baseline;padding:14px 18px;background:var(--card);border:1.5px solid var(--ink);border-radius:12px;box-shadow:3px 3px 0 rgba(25,23,52,0.08);}
        .bb-talk .who{font-family:'Unbounded',sans-serif;font-weight:700;font-size:15px;white-space:nowrap;}
        .bb-talk .what{font-size:14px;color:var(--muted);}

        /* closing */
        .bb-close{margin:70px 0 90px;text-align:center;border:2px solid var(--ink);border-radius:20px;padding:52px 30px;background:var(--card);box-shadow:8px 8px 0 rgba(10,169,207,0.2);}
        .bb-close h2{font-family:'Unbounded',sans-serif;font-weight:900;font-size:40px;margin:0 0 14px;}
        .bb-meta{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:1px;color:var(--muted);margin-top:22px;line-height:2;}

        @media (max-width:820px){
          .g3,.g2{grid-template-columns:1fr;}
          .bb-title{font-size:44px;}
          .bb-close h2{font-size:30px;}
          .bb-row{grid-template-columns:1fr;gap:6px;}
        }
      `}</style>

      <div className="bb-wrap">
        <nav className="bb-nav">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bay-builders-hackathon/assets/brand-logo.png" alt="BayForge" />
          <a href="https://bayforge.ai" target="_blank" rel="noreferrer">BAYFORGE.AI →</a>
        </nav>

        <header className="bb-hero">
          <div className="bb-eyebrow">BAY BUILDERS HACKATHON · 2026</div>
          <h1 className="bb-title bb-grad">Build your own AI organization</h1>
          <p className="bb-sub">
            One room. One day. Assemble a team, design an AI org from scratch, ship a working
            build, and demo it live to a panel of Bay Area founders and operators.
          </p>
          <div className="bb-chips">
            <span className="bb-chip">📅 {EVENT.date}</span>
            <span className="bb-chip">⏱ {EVENT.time}</span>
            <span className="bb-chip">📍 {EVENT.venue}</span>
          </div>
          <div className="bb-cta">
            <a className="bb-btn primary" href={EVENT.discord} target="_blank" rel="noreferrer">JOIN THE DISCORD →</a>
            <a className="bb-btn ghost" href="#run-of-show">SEE THE RUN OF SHOW</a>
          </div>
          <div className="bb-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bay-builders-hackathon/assets/cover.jpg" alt="Bay Builders Hackathon" />
          </div>
        </header>

        <section className="bb-sec">
          <div className="bb-kicker bb-grad">THE CHALLENGE</div>
          <h2 className="bb-h2">A company, built in a day.</h2>
          <p className="bb-lead">
            Forget building one feature. You&apos;re building the whole org — agents that plan,
            ship, sell, and support — powered by the best tools in the ecosystem.
          </p>
          <div className="bb-grid g3">
            <div className="bb-card">
              <div className="n">01</div>
              <h3>Assemble</h3>
              <p>Form a team, pick a mission, and architect an AI organization that runs itself.</p>
            </div>
            <div className="bb-card">
              <div className="n">02</div>
              <h3>Build</h3>
              <p>Ship a real, working product in hours using sponsor tools, live mentors, and workshops.</p>
            </div>
            <div className="bb-card">
              <div className="n">03</div>
              <h3>Demo</h3>
              <p>Three minutes on stage. Convince the judges. Take home the win.</p>
            </div>
          </div>
        </section>

        <section className="bb-sec" id="run-of-show">
          <div className="bb-kicker bb-grad">RUN OF SHOW</div>
          <h2 className="bb-h2">The day, hour by hour.</h2>
          <div className="bb-time">
            {AGENDA.map((a) => (
              <div key={a.time} className={`bb-row${a.hi ? " hi" : ""}`}>
                <div className="t">{a.time}</div>
                <div className="b">
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bb-sec">
          <div className="bb-kicker bb-grad">HOW YOU WIN</div>
          <h2 className="bb-h2">Five ways to stand out.</h2>
          <p className="bb-lead">Every project is scored out of 100 across five dimensions — plus virtual investments from judges in the builds they believe in.</p>
          <div className="bb-grid g3">
            {CRITERIA.map((c, i) => (
              <div key={c.t} className="bb-card">
                <div className="n">{String(i + 1).padStart(2, "0")}</div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bb-sec">
          <div className="bb-kicker bb-grad">POWERED BY</div>
          <h2 className="bb-h2">The tools you&apos;ll build with.</h2>
          <div className="bb-partners">
            {PARTNERS.map((p) => (
              <div key={p} className="bb-partner">{p}</div>
            ))}
          </div>
        </section>

        <section className="bb-sec">
          <div className="bb-kicker bb-grad">THE STAGE</div>
          <h2 className="bb-h2">Talks that kick off the build.</h2>
          <div className="bb-talks">
            {talks.map((t) => (
              <div key={t.name} className="bb-talk">
                <span className="who">{t.name}{t.company ? ` · ${t.company}` : ""}</span>
                <span className="what">{t.talk}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bb-sec">
          <div className="bb-kicker bb-grad">THE PANEL</div>
          <h2 className="bb-h2">{judges.length} judges deciding the winners.</h2>
          <p className="bb-lead">Founders, operators, and investors from across the Bay Area AI ecosystem.</p>
          <div className="bb-people">
            {judges.map((g) => (
              <div key={g.slug} className="bb-person">
                <div className="pn">{g.name}</div>
                {g.company && <div className="pc">{g.company}</div>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bb-close">
            <h2 className="bb-grad">Come build the future.</h2>
            <p className="bb-lead" style={{ margin: "0 auto" }}>
              Spots are limited. Join the Discord to claim yours and meet your teammates before the day.
            </p>
            <div className="bb-cta">
              <a className="bb-btn primary" href={EVENT.discord} target="_blank" rel="noreferrer">JOIN THE DISCORD →</a>
              <Link className="bb-btn ghost" href="/">BACK TO BAYFORGE</Link>
            </div>
            <div className="bb-meta">
              HOSTED BY {EVENT.hosts.toUpperCase()}<br />
              MC · {EVENT.mc.toUpperCase()}<br />
              {EVENT.venue.toUpperCase()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
