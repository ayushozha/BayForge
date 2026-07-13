import type { Metadata } from "next";
import Link from "next/link";
import BrandSymbol from "@/components/BrandSymbol";
import { GUESTS } from "@/lib/bay-builders/guests";
import { EVENT } from "@/lib/bay-builders/types";

export const metadata: Metadata = {
  title: "Bay Builders Hackathon 2026 · A BayForge Production",
  description:
    "One day. Build an entire AI organization from scratch, ship it, and demo live — July 13, 2026 at AWS Builders Loft, San Francisco. Hosted by Crew Base Collective + BayForge.",
  openGraph: {
    title: "Bay Builders Hackathon 2026 — Build your own AI organization",
    description:
      "Hosted by Crew Base Collective + BayForge · July 13, 2026 · AWS Builders Loft, San Francisco.",
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

const SPONSORS = ["Nebius", "Tavily", "You.com", "RocketRide", "InsForge", "Band", "HydraDB", "Nimble", "Kylon", "AgentOS"];
const PARTNERS = ["FinChip.AI", "Bay AI Circle", "Govia", "Sublet", "AWS", "Devnovate", "NeverZero"];

export default function BayBuildersLanding() {
  const judges = GUESTS.filter((g) => g.role === "judge" || g.role === "speaker-judge");
  const talks = GUESTS.filter((g) => g.talk && (g.role === "speaker" || g.role === "speaker-judge"))
    .map((g) => ({ name: g.name, company: g.company, talk: g.talk as string }));

  return (
    <div className="bb-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        .bb-root{
          --bg:#050611; --bg2:#02030a; --ink:#fff; --muted:#c7c4d8; --soft:#8e8aa7;
          --violet:#b936ff; --violet2:#8a1eff; --magenta:#ff3ef2; --cyan:#39d5ff; --green:#6ef0bc;
          --line:rgba(185,54,255,0.24); --panel:rgba(18,10,38,0.62);
          --grad:linear-gradient(100deg,#39d5ff 0%,#b936ff 52%,#ff3ef2 100%);
          position:relative;min-height:100vh;color:var(--ink);
          font-family:Inter,ui-sans-serif,system-ui,sans-serif;overflow:hidden;
          background:
            radial-gradient(60% 40% at 15% 0%, rgba(57,213,255,0.10) 0%, transparent 55%),
            radial-gradient(55% 45% at 88% 8%, rgba(255,62,242,0.12) 0%, transparent 55%),
            radial-gradient(70% 50% at 50% 108%, rgba(185,54,255,0.14) 0%, transparent 60%),
            linear-gradient(180deg,#02030a 0%,#090313 58%,#050611 100%);
        }
        .bb-root::before{
          content:"";position:absolute;inset:0;pointer-events:none;opacity:0.5;
          background:
            repeating-linear-gradient(0deg, rgba(185,54,255,0.05) 0 1px, transparent 1px 44px),
            repeating-linear-gradient(90deg, rgba(57,213,255,0.04) 0 1px, transparent 1px 44px);
          mask:radial-gradient(90% 70% at 50% 30%, #000 0%, transparent 85%);
        }
        .bb-wrap{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:0 24px;}
        .bb-grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .bb-anton{font-family:'Anton',Impact,sans-serif;letter-spacing:0.5px;text-transform:uppercase;}

        /* nav */
        .bb-nav{display:flex;align-items:center;justify-content:space-between;padding:24px 0;}
        .bb-brand{display:inline-flex;align-items:center;gap:12px;}
        .bb-brand svg{width:40px;height:40px;filter:drop-shadow(0 0 12px rgba(185,54,255,0.5));}
        .bb-brand b{font-weight:800;font-size:18px;letter-spacing:0.5px;}
        .bb-nav .lnk{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:9px 16px;transition:.18s;}
        .bb-nav .lnk:hover{color:#fff;border-color:var(--cyan);box-shadow:0 0 22px rgba(57,213,255,0.28);}

        /* hero */
        .bb-hero{text-align:center;padding:40px 0 20px;}
        .bb-hosted{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:6px;color:var(--soft);margin-bottom:16px;}
        .bb-hostrow{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin-bottom:34px;}
        .bb-host{display:inline-flex;align-items:center;gap:11px;padding:11px 20px;border:1px solid var(--line);border-radius:14px;background:var(--panel);backdrop-filter:blur(10px);box-shadow:inset 0 0 24px rgba(185,54,255,0.08);}
        .bb-host svg{width:30px;height:30px;filter:drop-shadow(0 0 10px rgba(185,54,255,0.6));}
        .bb-host .hn{font-weight:800;font-size:17px;letter-spacing:0.4px;}
        .bb-host .cbc{display:grid;place-items:center;width:30px;height:30px;border-radius:8px;border:1px solid rgba(57,213,255,0.5);font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:var(--cyan);background:rgba(57,213,255,0.08);}
        .bb-host .hn small{display:block;font-family:'JetBrains Mono',monospace;font-weight:400;font-size:9px;letter-spacing:2px;color:var(--soft);margin-top:2px;}
        .bb-hostx{font-family:'Anton',sans-serif;font-size:22px;color:var(--violet);}

        .bb-title{font-family:'Anton',Impact,sans-serif;text-transform:uppercase;font-weight:400;font-size:104px;line-height:0.9;margin:0;letter-spacing:1px;}
        .bb-title .l1{display:block;color:#fff;text-shadow:0 0 40px rgba(57,213,255,0.25);}
        .bb-title .l2{display:block;}
        .bb-tag{font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:4px;color:var(--cyan);margin:22px 0 0;}
        .bb-tag b{color:var(--soft);font-weight:400;}
        .bb-sub{font-size:17px;line-height:1.6;color:var(--muted);max-width:600px;margin:22px auto 0;}

        .bb-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:30px 0 0;}
        .bb-chip{font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:1px;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:10px 16px;backdrop-filter:blur(10px);}
        .bb-cta{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin:34px 0 0;}
        .bb-btn{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;border-radius:999px;padding:16px 30px;transition:.2s;border:1px solid transparent;}
        .bb-btn.primary{color:#08000f;background:var(--grad);box-shadow:0 0 34px rgba(185,54,255,0.5);}
        .bb-btn.primary:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(255,62,242,0.7);}
        .bb-btn.ghost{color:#fff;border-color:var(--line);background:var(--panel);}
        .bb-btn.ghost:hover{border-color:var(--cyan);box-shadow:0 0 26px rgba(57,213,255,0.3);}

        /* stat strip */
        .bb-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin:56px 0 0;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--line);}
        .bb-stat{background:linear-gradient(180deg,rgba(18,10,38,0.85),rgba(8,4,20,0.85));padding:24px 18px;text-align:center;}
        .bb-stat .k{font-family:'Anton',sans-serif;font-size:34px;line-height:1;}
        .bb-stat .v{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;color:var(--soft);margin-top:8px;}

        /* sections */
        .bb-sec{padding:70px 0 0;}
        .bb-kicker{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:11px;letter-spacing:4px;margin-bottom:14px;}
        .bb-h2{font-family:'Anton',Impact,sans-serif;text-transform:uppercase;font-weight:400;font-size:44px;line-height:1;margin:0 0 12px;letter-spacing:0.5px;}
        .bb-lead{font-size:16px;color:var(--muted);max-width:640px;line-height:1.6;}

        .bb-grid{display:grid;gap:16px;margin-top:32px;}
        .g3{grid-template-columns:repeat(3,1fr);}
        .bb-card{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:26px;backdrop-filter:blur(10px);overflow:hidden;transition:.2s;}
        .bb-card:hover{border-color:rgba(57,213,255,0.5);box-shadow:0 0 30px rgba(57,213,255,0.14);transform:translateY(-3px);}
        .bb-card::after{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad);opacity:0.7;}
        .bb-card .n{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--cyan);}
        .bb-card h3{font-family:'Anton',sans-serif;text-transform:uppercase;font-weight:400;font-size:22px;margin:12px 0 8px;letter-spacing:0.5px;}
        .bb-card p{font-size:15px;color:var(--muted);line-height:1.6;margin:0;}

        /* timeline */
        .bb-time{margin-top:32px;border-left:1px solid var(--line);}
        .bb-row{display:grid;grid-template-columns:160px 1fr;gap:22px;padding:18px 0 18px 26px;position:relative;border-bottom:1px solid rgba(185,54,255,0.1);}
        .bb-row::before{content:"";position:absolute;left:-6px;top:24px;width:11px;height:11px;border-radius:50%;background:var(--bg);border:1.5px solid var(--soft);}
        .bb-row.hi::before{background:var(--cyan);border-color:var(--cyan);box-shadow:0 0 0 4px rgba(57,213,255,0.18),0 0 18px rgba(57,213,255,0.6);}
        .bb-row .t{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:13px;color:var(--cyan);}
        .bb-row .b h4{font-weight:700;font-size:16px;margin:0 0 4px;}
        .bb-row .b p{font-size:14px;color:var(--muted);margin:0;line-height:1.55;}

        /* logo rows */
        .bb-logos{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;}
        .bb-logo{font-weight:700;font-size:15px;letter-spacing:0.3px;padding:13px 22px;border:1px solid var(--line);border-radius:12px;background:var(--panel);backdrop-filter:blur(8px);transition:.18s;}
        .bb-logo:hover{border-color:var(--magenta);box-shadow:0 0 22px rgba(255,62,242,0.22);color:#fff;}
        .bb-logo.sm{font-size:13px;color:var(--muted);padding:10px 18px;}

        /* people */
        .bb-people{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:30px;}
        .bb-person{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 18px;backdrop-filter:blur(8px);transition:.18s;}
        .bb-person:hover{border-color:rgba(110,240,188,0.5);box-shadow:0 0 22px rgba(110,240,188,0.14);}
        .bb-person .pn{font-weight:700;font-size:16px;}
        .bb-person .pc{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--soft);margin-top:5px;letter-spacing:1px;}

        .bb-talks{margin-top:30px;display:grid;gap:10px;}
        .bb-talk{display:flex;gap:14px;align-items:baseline;flex-wrap:wrap;padding:15px 20px;background:var(--panel);border:1px solid var(--line);border-radius:12px;backdrop-filter:blur(8px);}
        .bb-talk .who{font-weight:700;font-size:15px;white-space:nowrap;}
        .bb-talk .what{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--cyan);}

        /* closing */
        .bb-close{margin:80px 0 90px;text-align:center;border:1px solid var(--line);border-radius:22px;padding:60px 30px;background:
          radial-gradient(80% 120% at 50% 0%, rgba(185,54,255,0.18) 0%, transparent 60%),var(--panel);
          backdrop-filter:blur(12px);box-shadow:0 0 60px rgba(185,54,255,0.18);}
        .bb-close h2{font-family:'Anton',Impact,sans-serif;text-transform:uppercase;font-weight:400;font-size:52px;margin:0 0 16px;letter-spacing:0.5px;}
        .bb-meta{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:1px;color:var(--soft);margin-top:26px;line-height:2;}
        .bb-meta b{color:var(--cyan);font-weight:400;}

        @media (max-width:860px){
          .g3{grid-template-columns:1fr;}
          .bb-title{font-size:60px;}
          .bb-h2{font-size:34px;}
          .bb-close h2{font-size:36px;}
          .bb-stats{grid-template-columns:repeat(2,1fr);}
          .bb-row{grid-template-columns:1fr;gap:6px;}
        }
      `}</style>

      <div className="bb-wrap">
        <nav className="bb-nav">
          <span className="bb-brand">
            <BrandSymbol idPrefix="bb-nav" />
            <b>BayForge</b>
          </span>
          <a className="lnk" href="https://bayforge.ai" target="_blank" rel="noreferrer">BAYFORGE.AI →</a>
        </nav>

        <header className="bb-hero">
          <div className="bb-hosted">◇ HOSTED BY ◇</div>
          <div className="bb-hostrow">
            <span className="bb-host">
              <span className="cbc">CB</span>
              <span className="hn">Crew Base<small>COLLECTIVE</small></span>
            </span>
            <span className="bb-hostx">×</span>
            <span className="bb-host">
              <BrandSymbol idPrefix="bb-host" />
              <span className="hn">BayForge<small>BUILDER COMMUNITY</small></span>
            </span>
          </div>

          <h1 className="bb-title">
            <span className="l1">Bay Builders</span>
            <span className="l2 bb-grad">Hackathon</span>
          </h1>
          <div className="bb-tag">▸▸▸ BUILD YOUR OWN <b>AI ORGANIZATION</b> ◂◂◂</div>
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
            <a className="bb-btn primary" href={EVENT.discord} target="_blank" rel="noreferrer">Join the Discord →</a>
            <a className="bb-btn ghost" href="#run-of-show">See the run of show</a>
          </div>

          <div className="bb-stats">
            <div className="bb-stat"><div className="k bb-grad">1</div><div className="v">DAY TO BUILD</div></div>
            <div className="bb-stat"><div className="k bb-grad">12</div><div className="v">LIGHTNING TALKS</div></div>
            <div className="bb-stat"><div className="k bb-grad">{judges.length}</div><div className="v">JUDGES</div></div>
            <div className="bb-stat"><div className="k bb-grad">{SPONSORS.length}+</div><div className="v">SPONSOR TOOLS</div></div>
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
            <div className="bb-card"><div className="n">01</div><h3>Assemble</h3><p>Form a team, pick a mission, and architect an AI organization that runs itself.</p></div>
            <div className="bb-card"><div className="n">02</div><h3>Build</h3><p>Ship a real, working product in hours using sponsor tools, live mentors, and workshops.</p></div>
            <div className="bb-card"><div className="n">03</div><h3>Demo</h3><p>Three minutes on stage. Convince the judges. Take home the win.</p></div>
          </div>
        </section>

        <section className="bb-sec" id="run-of-show">
          <div className="bb-kicker bb-grad">RUN OF SHOW</div>
          <h2 className="bb-h2">The day, hour by hour.</h2>
          <div className="bb-time">
            {AGENDA.map((a) => (
              <div key={a.time} className={`bb-row${a.hi ? " hi" : ""}`}>
                <div className="t">{a.time}</div>
                <div className="b"><h4>{a.title}</h4><p>{a.desc}</p></div>
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
              <div key={c.t} className="bb-card"><div className="n">{String(i + 1).padStart(2, "0")}</div><h3>{c.t}</h3><p>{c.d}</p></div>
            ))}
          </div>
        </section>

        <section className="bb-sec">
          <div className="bb-kicker bb-grad">POWERED BY</div>
          <h2 className="bb-h2">The tools you&apos;ll build with.</h2>
          <div className="bb-logos">
            {SPONSORS.map((p) => <span key={p} className="bb-logo">{p}</span>)}
          </div>
          <div className="bb-kicker" style={{ marginTop: 40, color: "var(--soft)" }}>PARTNERS</div>
          <div className="bb-logos">
            {PARTNERS.map((p) => <span key={p} className="bb-logo sm">{p}</span>)}
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
              <a className="bb-btn primary" href={EVENT.discord} target="_blank" rel="noreferrer">Join the Discord →</a>
              <Link className="bb-btn ghost" href="/">Back to BayForge</Link>
            </div>
            <div className="bb-meta">
              HOSTED BY <b>CREW BASE COLLECTIVE × BAYFORGE</b><br />
              MC · {EVENT.mc.toUpperCase()}<br />
              {EVENT.venue.toUpperCase()}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
