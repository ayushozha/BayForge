"use client";

import { useEffect, useMemo, useState } from "react";
import type { Guest } from "@/lib/bay-builders/types";
import { EVENT } from "@/lib/bay-builders/types";
import { ROLE_CONTENT } from "@/lib/bay-builders/content";

type View = "invitation" | "details";

/** Replace {{company}} in a string with the guest's company (or a neutral fallback). */
function fill(text: string, guest: Guest): string {
  return text.replaceAll("{{company}}", guest.company || "your team");
}

const ORGANIZER_EMAIL = "outreach@bayforge.events";

/** mailto: the organizers with a role-aware, guest-aware subject + body. */
function confirmMailto(guest: Guest): string {
  const subject = `Bay Builders Hackathon — ${guest.name} (${guest.roleLabel})`;
  const body = [
    `Hi BayForge team,`,
    ``,
    `This is ${guest.name}. Confirming my role for Bay Builders Hackathon on July 13.`,
    `Role: ${guest.roleLabel}.`,
    ``,
    `[Add any questions or scheduling notes here.]`,
  ].join("\r\n");
  return `mailto:${ORGANIZER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function BayBuildersExperience({ guest }: { guest: Guest }) {
  const [view, setView] = useState<View>("invitation");
  const content = ROLE_CONTENT[guest.role];
  const confirmHref = confirmMailto(guest);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, [view]);

  const essentials = useMemo(
    () => [
      { k: "DATE", v: EVENT.date },
      { k: "TIME", v: EVENT.time },
      { k: "VENUE", v: EVENT.venue },
      { k: "HOSTS", v: EVENT.hosts },
      { k: "HOSTING / MC", v: EVENT.mc },
      { k: "SPONSOR TOOLS", v: EVENT.tools },
    ],
    [],
  );

  const d = content.d;

  return (
    <div className="bb-root">
      <BayBuildersStyles />

      {/* top bar */}
      <div className="bb-bar">
        <Link href="/bay-builders-hackathon" className="bb-pill-btn">
          ← ALL GUESTS
        </Link>
        <div className="bb-bar-brand">
          <span className="bb-node" />
          <span>BAY BUILDERS HACKATHON</span>
        </div>
        <div className="bb-toggle">
          <button
            className={view === "invitation" ? "on" : ""}
            onClick={() => setView("invitation")}
          >
            INVITATION
          </button>
          <button className={view === "details" ? "on" : ""} onClick={() => setView("details")}>
            DETAILS
          </button>
        </div>
      </div>

      {view === "invitation" && (
        <section className="bb-invite-wrap">
          <div className="bb-kick-top">YOUR INVITATION</div>

          {/* The card: left cover art + right personalized panel. */}
          <div className={`bb-card2${guest.role === "cohost" ? " bb-card2-core" : ""}`}>
            <div
              className="bb-card2-cover"
              style={{ backgroundImage: "url('/bay-builders-hackathon/assets/cover.jpg')" }}
              role="img"
              aria-label="Bay Builders Hackathon — Build Your Own AI Organization"
            />
            <div className="bb-card2-panel">
              <div className="bb-logochip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/bay-builders-hackathon/assets/brand-logo.png"
                  width={160}
                  alt="BayForge"
                />
              </div>
              <div className="bb-eyebrow">WELCOME TO</div>
              <div className="bb-eventname">BAY BUILDERS HACKATHON</div>
              <div className="bb-tagchip">
                <span className="bb-magenta">▸▸▸</span> BUILD YOUR OWN AI ORGANIZATION{" "}
                <span className="bb-magenta">◂◂◂</span>
              </div>
              {guest.role === "cohost" && <div className="bb-ribbon">CORE TEAM</div>}
              <Divider />
              {content.dear && <div className="bb-dear">Dear</div>}
              <div className="bb-name">{guest.name}</div>
              <div className="bb-rolerow">
                <span className="bb-line short" />
                <span className="bb-rolelabel">{guest.roleLabel}</span>
                <span className="bb-line short" />
              </div>
              <p className="bb-msg">{fill(content.email.m1, guest)}</p>
              <p className="bb-msg">{fill(content.email.m2, guest)}</p>
              <p className="bb-msg bb-msg-accent">{fill(content.email.m3, guest)}</p>
              <div className="bb-star">◆</div>
              <div className="bb-gathering">
                <div className="bb-eyebrow">THE BUILD DAY</div>
                <div className="bb-gather-lines">
                  <div>◆&nbsp;&nbsp;MONDAY · JULY 13, 2026</div>
                  <div>◆&nbsp;&nbsp;9:30 AM – 8:00 PM PDT</div>
                  <div>◆&nbsp;&nbsp;AWS BUILDERS LOFT · SAN FRANCISCO</div>
                </div>
                <button className="bb-cta" onClick={() => setView("details")}>
                  {content.email.cta}
                </button>
              </div>
              <div className="bb-tagline">
                WHERE <span className="bb-cyan">BUILDERS</span> BECOME{" "}
                <span className="bb-magenta">FOUNDERS</span>
              </div>
              <div className="bb-host">
                Hosted by Crewbase Collective &amp; BayForge · AWS Builders Loft, San Francisco
              </div>
            </div>
          </div>

          <button className="bb-link" onClick={() => setView("details")}>
            SEE YOUR FULL BRIEF →
          </button>
        </section>
      )}

      {view === "details" && (
        <section className="bb-details">
          <div className="bb-d-head">
            <div className="bb-kicker">{d.kicker}</div>
            <div className="bb-d-title">{d.title}</div>
            <div className="bb-d-intro">{d.intro}</div>
            <div className="bb-chip">
              <span className="bb-chip-name">{guest.name}</span>
              <span className="bb-dot" />
              <span className="bb-chip-role">{guest.roleLabel}</span>
            </div>
          </div>

          {/* spotlight */}
          <div className="bb-spot">
            <div className="bb-spot-top">
              <span className="bb-spot-tag">{d.spotlight.tag}</span>
              <span className="bb-spot-time">{guest.talk ?? d.spotlight.time}</span>
            </div>
            <div className="bb-spot-title">{d.spotlight.title}</div>
            <div className="bb-spot-lines">
              {d.spotlight.lines.map((l, i) => (
                <div key={i} className="bb-spot-line">
                  <span className="bb-violet">◆</span>
                  <span>{fill(l, guest)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* run of show */}
          <div className="bb-sec">
            <div className="bb-sec-eyebrow">RUN OF SHOW</div>
            <div className="bb-sec-title">Your day, hour by hour</div>
            <div>
              {d.timeline.map((it, i) => (
                <div key={i} className="bb-tl">
                  <div className="bb-tl-time">{it.time}</div>
                  <div className="bb-tl-body">
                    <div className="bb-tl-titlerow">
                      <span className="bb-tl-title">{it.title}</span>
                      {it.highlight && <span className="bb-badge">★ {d.youBadge}</span>}
                    </div>
                    <div className="bb-tl-desc">{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {d.prep && <div className="bb-prep">{fill(d.prep, guest)}</div>}

          {d.briefItems && (
            <div className="bb-sec bb-bordered">
              <div className="bb-sec-eyebrow">HOSTING CHECKLIST</div>
              <div className="bb-sec-title">What you own on the day</div>
              <div className="bb-note">{fill(d.briefNote ?? "", guest)}</div>
              <div className="bb-stack">
                {d.briefItems.map((b, i) => (
                  <div key={i} className="bb-tile">
                    <div className="bb-tile-t bb-cyan-text">{b.t}</div>
                    <div className="bb-tile-d">{fill(b.d, guest)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.judgingItems && (
            <div className="bb-sec bb-bordered">
              <div className="bb-sec-eyebrow">JUDGING</div>
              <div className="bb-sec-title">What you&rsquo;re scoring</div>
              <div className="bb-note">{fill(d.judgingNote ?? "", guest)}</div>
              <div className="bb-grid2">
                {d.judgingItems.map((j, i) => (
                  <div key={i} className="bb-tile bb-tile-violet">
                    <div className="bb-tile-t bb-violet-text">{j.t}</div>
                    <div className="bb-tile-d">{j.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.perks && (
            <div className="bb-sec bb-bordered">
              <div className="bb-sec-eyebrow">PERKS</div>
              <div className="bb-sec-title">{d.perksNote}</div>
              <div className="bb-grid2">
                {d.perks.map((p, i) => (
                  <div key={i} className="bb-tile bb-tile-magenta">
                    <div className="bb-tile-t bb-magenta-text">{p.t}</div>
                    <div className="bb-tile-d">{p.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.hasPass && (
            <div className="bb-pass">
              <div className="bb-pass-main">
                <div className="bb-pass-tag">VIP ACCESS PASS</div>
                <div className="bb-pass-name">{guest.name}</div>
                <div className="bb-pass-sub">INNER CIRCLE · BAY BUILDERS HACKATHON</div>
                <div className="bb-pass-meta">
                  <div>
                    <div className="bb-pass-k">DATE</div>
                    <div className="bb-pass-v">Jul 13, 2026</div>
                  </div>
                  <div>
                    <div className="bb-pass-k">PASS</div>
                    <div className="bb-pass-v">BB-2026-VIP</div>
                  </div>
                </div>
              </div>
              <div className="bb-pass-qr">
                <div className="bb-qr" />
              </div>
            </div>
          )}

          {/* essentials */}
          <div className="bb-ess">
            <div className="bb-sec-eyebrow center">EVENT ESSENTIALS</div>
            <div className="bb-grid2">
              {essentials.map((e, i) => (
                <div key={i}>
                  <div className="bb-ess-k">{e.k}</div>
                  <div className="bb-ess-v">{e.v}</div>
                </div>
              ))}
            </div>
            <div className="bb-discord">
              EVENT DISCORD ·{" "}
              <a href={EVENT.discord} target="_blank" rel="noreferrer">
                discord.gg/r8wrvsfDS5
              </a>
            </div>
          </div>

          <div className="bb-foot">
            <a className="bb-cta" href={confirmHref}>
              {d.ctaPrimary}
            </a>
            <div>
              <button className="bb-link" onClick={() => setView("invitation")}>
                ← BACK TO INVITATION
              </button>
            </div>
            <div className="bb-star">◆</div>
          </div>
        </section>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="bb-divider">
      <span className="bb-line" />
      <span className="bb-cyan">◆</span>
      <span className="bb-line" />
    </div>
  );
}

function BayBuildersStyles() {
  // Scoped, self-contained styling matching the Bay Builders flyer (neon violet /
  // cyan / magenta agents-in-the-city look), distinct from the Wizard gold/serif system.
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Chakra+Petch:wght@300;400;500;600&display=swap');
      .bb-root{min-height:100vh;background:radial-gradient(130% 65% at 50% -10%, rgba(88,40,180,0.38) 0%, rgba(5,5,16,0) 55%), radial-gradient(90% 40% at 85% 8%, rgba(34,211,238,0.10) 0%, rgba(5,5,16,0) 60%), #050510;font-family:'Chakra Petch',sans-serif;color:#c8cee6;}
      .bb-root *{box-sizing:border-box;}
      .bb-violet{color:#a855f7;}
      .bb-cyan{color:#22d3ee;}
      .bb-magenta{color:#e879f9;}
      .bb-bar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 26px;background:rgba(7,7,18,0.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(168,85,247,0.22);}
      .bb-pill-btn{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid rgba(170,179,214,0.22);color:#aab3d6;font-size:11px;letter-spacing:2px;padding:8px 14px;border-radius:999px;cursor:pointer;text-decoration:none;}
      .bb-bar-brand{display:flex;align-items:center;gap:10px;font-weight:400;font-size:10.5px;letter-spacing:4px;color:#8a93b8;}
      .bb-node{width:8px;height:8px;border-radius:2px;background:linear-gradient(135deg,#22d3ee,#a855f7);box-shadow:0 0 10px rgba(168,85,247,0.8);}
      .bb-toggle{display:flex;gap:4px;padding:3px;border:1px solid rgba(168,85,247,0.28);border-radius:999px;}
      .bb-toggle button{font-size:10.5px;letter-spacing:1.5px;padding:6px 13px;border-radius:999px;background:transparent;border:none;color:#9aa2c4;cursor:pointer;font-family:inherit;}
      .bb-toggle button.on{background:linear-gradient(100deg,#22d3ee,#a855f7);color:#050510;font-weight:600;}

      .bb-invite-wrap{display:flex;flex-direction:column;align-items:center;padding:40px 20px 80px;}
      .bb-kick-top{font-weight:300;font-size:11px;letter-spacing:4px;color:#6f7798;margin-bottom:20px;}
      .bb-card2{display:flex;width:1020px;max-width:100%;background:#0a0a18;border:1px solid rgba(168,85,247,0.35);border-radius:18px;overflow:hidden;box-shadow:0 40px 110px -38px rgba(120,50,220,0.6);}
      .bb-card2-core{border-color:rgba(34,211,238,0.55);box-shadow:0 40px 110px -36px rgba(34,211,238,0.45), 0 0 0 1px rgba(34,211,238,0.22) inset;}
      .bb-ribbon{display:inline-block;margin-top:16px;padding:6px 16px;border-radius:999px;background:linear-gradient(100deg,#22d3ee,#a855f7);color:#050510;font-weight:600;font-size:10px;letter-spacing:4px;box-shadow:0 8px 22px -8px rgba(34,211,238,0.7);}
      .bb-card2-cover{flex:0 0 46%;background-size:cover;background-position:center top;background-repeat:no-repeat;border-right:1px solid rgba(168,85,247,0.25);min-height:620px;}
      .bb-card2-panel{flex:1;padding:44px 46px 40px;text-align:center;background:radial-gradient(120% 70% at 50% 0%, rgba(88,40,180,0.30) 0%, rgba(10,10,24,0) 60%), #0a0a18;}
      .bb-logochip{display:inline-block;background:#f6f4ef;border-radius:10px;padding:8px 16px;margin-bottom:18px;}
      .bb-logochip img{display:block;height:auto;}
      .bb-eyebrow{font-weight:300;font-size:11px;letter-spacing:5px;color:#8f96bd;}
      .bb-eyebrow.center{text-align:center;}
      .bb-eventname{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:24px;letter-spacing:4px;margin-top:9px;color:#e8eaf6;}
      .bb-tagchip{font-size:10.5px;letter-spacing:3px;color:#22d3ee;margin-top:8px;}
      .bb-divider{display:flex;align-items:center;justify-content:center;gap:13px;margin:24px 0 20px;}
      .bb-line{height:1px;width:60px;background:linear-gradient(90deg,transparent,rgba(168,85,247,0.7));}
      .bb-line.short{width:34px;}
      .bb-dear{font-size:15px;color:#9aa2c9;margin-bottom:2px;}
      .bb-name{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:50px;line-height:1.04;margin:4px 0 14px;background:linear-gradient(102deg,#22d3ee 0%,#818cf8 40%,#a855f7 68%,#e879f9 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;filter:drop-shadow(0 0 24px rgba(168,85,247,0.4));}
      .bb-rolerow{display:flex;align-items:center;justify-content:center;gap:14px;}
      .bb-rolelabel{font-weight:400;font-size:12.5px;letter-spacing:4px;color:#aeb6d8;}
      .bb-msg{font-size:15px;line-height:1.65;color:#c8cee6;margin:14px 0 0;font-weight:300;}
      .bb-msg:first-of-type{margin-top:28px;}
      .bb-msg-accent{font-weight:500;background:linear-gradient(100deg,#22d3ee 0%,#a78bfa 50%,#e879f9 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .bb-star{color:#22d3ee;font-size:18px;line-height:1;margin:30px 0 26px;}
      .bb-gathering{padding-top:28px;border-top:1px solid rgba(168,85,247,0.22);}
      .bb-gather-lines{font-size:13px;letter-spacing:2.5px;color:#d7ddef;line-height:2.15;margin-top:14px;}
      .bb-cta{display:inline-block;margin-top:24px;padding:15px 40px;border:none;border-radius:999px;background:linear-gradient(100deg,#22d3ee 0%,#a855f7 100%);color:#050510;font-family:'Chakra Petch',sans-serif;font-weight:600;letter-spacing:2.5px;font-size:12px;text-transform:uppercase;cursor:pointer;text-decoration:none;box-shadow:0 12px 34px -10px rgba(168,85,247,0.7);}
      .bb-tagline{font-weight:400;font-size:11px;letter-spacing:4px;color:#7e87ab;margin-top:32px;}
      .bb-host{font-weight:300;font-size:10.5px;letter-spacing:1px;color:#565e7d;margin-top:14px;line-height:1.7;}
      .bb-link{margin-top:26px;background:transparent;border:none;color:#9aa2c4;font-family:'Chakra Petch',sans-serif;font-size:11px;letter-spacing:2px;cursor:pointer;}

      .bb-details{max-width:760px;margin:0 auto;padding:54px 28px 100px;}
      .bb-d-head{text-align:center;}
      .bb-kicker{font-weight:500;font-size:11px;letter-spacing:5px;color:#22d3ee;}
      .bb-d-title{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:46px;line-height:1.06;margin:12px 0;background:linear-gradient(102deg,#22d3ee 0%,#818cf8 38%,#a855f7 66%,#e879f9 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .bb-d-intro{font-size:15px;line-height:1.6;color:#c4cae2;max-width:520px;margin:0 auto;font-weight:300;}
      .bb-chip{display:inline-flex;align-items:center;gap:10px;margin-top:20px;padding:9px 18px;border:1px solid rgba(168,85,247,0.35);border-radius:999px;}
      .bb-chip-name{font-family:'Rajdhani',sans-serif;font-weight:600;font-size:16px;color:#e7ecff;}
      .bb-dot{width:4px;height:4px;border-radius:999px;background:#22d3ee;}
      .bb-chip-role{font-size:10px;letter-spacing:2.5px;color:#aeb6d8;}

      .bb-spot{margin:38px 0 0;padding:26px 30px;border:1px solid rgba(34,211,238,0.30);border-radius:16px;background:linear-gradient(180deg,rgba(34,211,238,0.06),rgba(168,85,247,0.03));}
      .bb-spot-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;}
      .bb-spot-tag{font-weight:500;font-size:10.5px;letter-spacing:3.5px;color:#22d3ee;}
      .bb-spot-time{font-size:13px;letter-spacing:1.5px;color:#e879f9;}
      .bb-spot-title{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:26px;line-height:1.15;color:#eef1ff;margin:8px 0 14px;}
      .bb-spot-lines{display:flex;flex-direction:column;gap:9px;}
      .bb-spot-line{display:flex;align-items:flex-start;gap:11px;font-weight:300;font-size:14px;color:#cdd4ec;line-height:1.5;}

      .bb-sec{margin-top:46px;}
      .bb-bordered{padding-top:30px;border-top:1px solid rgba(168,85,247,0.20);}
      .bb-sec-eyebrow{font-weight:500;font-size:11px;letter-spacing:4px;color:#8a93b8;}
      .bb-sec-eyebrow.center{text-align:center;}
      .bb-sec-title{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:28px;color:#e7ecff;margin:6px 0 18px;}
      .bb-note{font-size:14px;color:#aab3d6;line-height:1.6;margin-bottom:18px;font-weight:300;}
      .bb-tl{display:flex;gap:20px;padding:16px 0;border-top:1px solid rgba(255,255,255,0.06);}
      .bb-tl-time{flex:0 0 130px;font-size:12px;letter-spacing:1.5px;color:#22d3ee;padding-top:2px;}
      .bb-tl-body{flex:1;}
      .bb-tl-titlerow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
      .bb-tl-title{font-family:'Rajdhani',sans-serif;font-weight:600;font-size:18px;color:#e7ecff;line-height:1.2;}
      .bb-badge{font-weight:600;font-size:9px;letter-spacing:2px;color:#050510;background:linear-gradient(100deg,#22d3ee,#a855f7);padding:3px 8px;border-radius:999px;}
      .bb-tl-desc{font-weight:300;font-size:13.5px;color:#9aa2c4;line-height:1.55;margin-top:4px;}
      .bb-prep{margin-top:30px;padding:18px 22px;border-left:2px solid #22d3ee;background:rgba(34,211,238,0.05);border-radius:0 10px 10px 0;font-size:14px;color:#bde9f2;line-height:1.6;}
      .bb-stack{display:flex;flex-direction:column;gap:10px;}
      .bb-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
      .bb-tile{padding:18px 20px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.05);}
      .bb-tile-violet{border:1px solid rgba(168,85,247,0.22);}
      .bb-tile-magenta{border:1px solid rgba(232,121,249,0.22);}
      .bb-tile-t{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:18px;}
      .bb-violet-text{color:#c4b5fd;}
      .bb-magenta-text{color:#e879f9;}
      .bb-cyan-text{color:#7fe3f2;}
      .bb-tile-d{font-weight:300;font-size:13.5px;color:#aab3d6;line-height:1.5;margin-top:6px;}

      .bb-pass{margin-top:34px;display:flex;align-items:stretch;border:1px solid rgba(34,211,238,0.35);border-radius:16px;overflow:hidden;background:linear-gradient(120deg,#0e0d20,#0a0a18);}
      .bb-pass-main{flex:1;padding:26px 28px;}
      .bb-pass-tag{font-weight:500;font-size:10px;letter-spacing:3.5px;color:#22d3ee;}
      .bb-pass-name{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:30px;line-height:1.05;margin:8px 0 2px;background:linear-gradient(102deg,#22d3ee,#a855f7 55%,#e879f9);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .bb-pass-sub{font-size:10.5px;letter-spacing:3px;color:#aeb6d8;}
      .bb-pass-meta{display:flex;gap:24px;margin-top:18px;}
      .bb-pass-k{font-size:9px;letter-spacing:2px;color:#6f7798;}
      .bb-pass-v{font-size:12.5px;color:#d7ddef;margin-top:3px;}
      .bb-pass-qr{flex:0 0 130px;display:flex;align-items:center;justify-content:center;border-left:1px dashed rgba(34,211,238,0.35);background:rgba(255,255,255,0.02);}
      .bb-qr{width:84px;height:84px;border-radius:8px;background-color:#0a0a18;background-image:repeating-linear-gradient(0deg,#22d3ee 0 6px,transparent 6px 12px),repeating-linear-gradient(90deg,#a855f7 0 6px,transparent 6px 12px);background-size:24px 24px;opacity:0.8;}

      .bb-ess{margin-top:46px;padding:28px 30px;border:1px solid rgba(255,255,255,0.07);border-radius:16px;background:rgba(255,255,255,0.012);}
      .bb-ess .bb-sec-eyebrow{margin-bottom:18px;}
      .bb-ess-k{font-weight:400;font-size:9.5px;letter-spacing:2.5px;color:#6f7798;}
      .bb-ess-v{font-size:14.5px;color:#dfe4f5;line-height:1.4;margin-top:4px;}
      .bb-discord{margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;letter-spacing:2px;color:#8a93b8;text-align:center;}
      .bb-discord a{color:#22d3ee;text-decoration:underline;}
      .bb-foot{margin-top:40px;text-align:center;}
      .bb-foot .bb-star{margin:30px 0 0;}

      @media (max-width:860px){
        .bb-card2{flex-direction:column;width:560px;}
        .bb-card2-cover{flex:none;min-height:0;aspect-ratio:1/1;max-height:62vh;border-right:none;border-bottom:1px solid rgba(168,85,247,0.25);}
      }
      @media (max-width:680px){
        .bb-card2-panel{padding:34px 24px 30px;}
        .bb-name{font-size:38px;}
        .bb-details{padding:40px 18px 90px;}
        .bb-d-title{font-size:34px;}
        .bb-grid2{grid-template-columns:1fr;}
        .bb-tl{flex-direction:column;gap:4px;}
        .bb-tl-time{flex-basis:auto;}
        .bb-pass{flex-direction:column;}
        .bb-pass-qr{border-left:none;border-top:1px dashed rgba(34,211,238,0.35);padding:18px 0;}
        .bb-bar{padding:11px 14px;gap:8px;}
        .bb-bar-brand{display:none;}
      }
    `}</style>
  );
}
