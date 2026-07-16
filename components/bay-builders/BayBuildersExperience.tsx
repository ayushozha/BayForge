"use client";

import Link from "next/link";
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

const AGENTS = [
  { glyph: "⌕", label: "RESEARCH" },
  { glyph: "⌨", label: "CODE" },
  { glyph: "▤", label: "DATA" },
  { glyph: "✎", label: "DESIGN" },
  { glyph: "⛨", label: "SECURITY" },
  { glyph: "➹", label: "DEPLOY" },
];

export default function BayBuildersExperience({ guest }: { guest: Guest }) {
  const [view, setView] = useState<View>("invitation");
  const content = ROLE_CONTENT[guest.role];
  const confirmHref = confirmMailto(guest);
  const firstName = guest.name.split(" ")[0];

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
          <div className="bb-kick-top bb-reveal">YOUR INVITATION</div>

          {/* The card: drafted blueprint panel (left) + personalized panel (right). */}
          <div className={`bb-card2 bb-reveal bb-reveal-1${guest.role === "cohost" ? " bb-card2-core" : ""}`}>
            <div className="bb-bp" aria-hidden="true">
              <div className="bb-bp-head">
                <span className="bb-bp-fig">FIG. 01</span>
                <span className="bb-bp-headtitle">AI ORGANIZATION — ASSEMBLY DIAGRAM</span>
              </div>

              <div className="bb-org">
                <div className="bb-org-founder">
                  <div className="bb-org-founder-k">FOUNDER</div>
                  <div className="bb-org-founder-v">{firstName}</div>
                </div>
                <div className="bb-org-stem" />
                <div className="bb-org-bus" />
                <div className="bb-org-grid">
                  {AGENTS.map((a, i) => (
                    <div key={a.label} className={`bb-org-node bb-org-node-${i % 3}`}>
                      <span className="bb-org-glyph">{a.glyph}</span>
                      <span className="bb-org-label">{a.label}</span>
                      <span className="bb-org-sub">AGENT</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bb-bp-mid">
                <div className="bb-bp-measure">
                  <span className="bb-bp-arrow">◂</span>
                  <span className="bb-bp-measure-line" />
                  <span className="bb-bp-measure-txt">1 BUILD DAY — 9.5 HRS</span>
                  <span className="bb-bp-measure-line" />
                  <span className="bb-bp-arrow">▸</span>
                </div>
                <div className="bb-bp-note">⚠ CAUTION: CONTENTS SHIP IN A SINGLE DAY</div>
                <div className="bb-bp-specs">
                  <div><span>PARTS</span><b>1 FOUNDER · 6 AGENTS</b></div>
                  <div><span>POWER</span><b>INSFORGE · NEBIUS · AGENTOS · YOU.COM</b></div>
                  <div><span>OUTPUT</span><b>1 SHIPPED DEMO · 5 MIN</b></div>
                </div>
              </div>

              <div className="bb-bp-stamp">
                CLEARED<br />FOR BUILD<br />JUL 13 · 2026
              </div>

              <div className="bb-bp-titleblock">
                <div>
                  <span>DRAWN BY</span>
                  <b>CREWBASE × BAYFORGE</b>
                </div>
                <div>
                  <span>DRAWING №</span>
                  <b>BB-{guest.slug.replace(/-/g, "").slice(0, 8).toUpperCase()}</b>
                </div>
                <div>
                  <span>SHEET</span>
                  <b>1 OF 1 · SCALE 1:1</b>
                </div>
              </div>
            </div>

            <div className="bb-card2-panel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="bb-logo"
                src="/bay-builders-hackathon/assets/brand-logo.png"
                width={170}
                alt="BayForge"
              />
              <div className="bb-eyebrow">WELCOME TO</div>
              <div className="bb-eventname">BAY BUILDERS HACKATHON</div>
              <div className="bb-tagchip">▸▸▸ BUILD YOUR OWN AI ORGANIZATION ◂◂◂</div>
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

          <button className="bb-link bb-reveal bb-reveal-2" onClick={() => setView("details")}>
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
                  <div key={i} className="bb-tile bb-tile-cyan">
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
  // "Blueprint on bright paper": warm drafting-sheet light theme built from the
  // BayForge logo gradient (cyan → violet → magenta ink on off-white), replacing
  // the earlier dark neon system. All art is CSS — no poster image.
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Archivo:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
      .bb-root{
        --paper:#faf8f2; --card:#fffdf8; --ink:#191734; --muted:#5d5b78; --faint:#8b89a3;
        --cyan:#0993b8; --violet:#6d3fe0; --magenta:#d6336c;
        --grad:linear-gradient(100deg,#0aa9cf 0%,#6d3fe0 52%,#e0447c 100%);
        --edge:rgba(25,23,52,0.14); --hard:4px 4px 0 rgba(25,23,52,0.10);
        min-height:100vh;color:var(--ink);font-family:'Archivo',sans-serif;
        background:
          repeating-linear-gradient(0deg, rgba(38,60,150,0.045) 0 1px, transparent 1px 28px),
          repeating-linear-gradient(90deg, rgba(38,60,150,0.045) 0 1px, transparent 1px 28px),
          radial-gradient(110% 55% at 50% -6%, rgba(10,169,207,0.10) 0%, rgba(250,248,242,0) 58%),
          var(--paper);
      }
      .bb-root *{box-sizing:border-box;}
      .bb-cyan{color:var(--cyan);}
      .bb-violet{color:var(--violet);}
      .bb-magenta{color:var(--magenta);}

      @keyframes bbUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
      .bb-reveal{animation:bbUp .55s cubic-bezier(.2,.7,.3,1) both;}
      .bb-reveal-1{animation-delay:.08s;}
      .bb-reveal-2{animation-delay:.2s;}
      @media (prefers-reduced-motion: reduce){.bb-reveal,.bb-reveal-1,.bb-reveal-2{animation:none;}}

      .bb-bar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 26px;background:rgba(250,248,242,0.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--edge);}
      .bb-pill-btn{display:inline-flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--edge);color:var(--muted);font-size:11px;letter-spacing:2px;padding:8px 14px;border-radius:999px;cursor:pointer;text-decoration:none;font-family:'Space Mono',monospace;}
      .bb-bar-brand{display:flex;align-items:center;gap:10px;font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:3.5px;color:var(--muted);}
      .bb-node{width:9px;height:9px;border-radius:2px;background:var(--grad);box-shadow:2px 2px 0 rgba(25,23,52,0.18);}
      .bb-toggle{display:flex;gap:4px;padding:3px;border:1px solid var(--edge);border-radius:999px;background:var(--card);}
      .bb-toggle button{font-size:10.5px;letter-spacing:1.5px;padding:6px 13px;border-radius:999px;background:transparent;border:none;color:var(--muted);cursor:pointer;font-family:'Space Mono',monospace;}
      .bb-toggle button.on{background:var(--ink);color:#fdfcf7;}

      .bb-invite-wrap{display:flex;flex-direction:column;align-items:center;padding:44px 20px 84px;}
      .bb-kick-top{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:4px;color:var(--faint);margin-bottom:20px;}
      .bb-card2{display:flex;width:1040px;max-width:100%;background:var(--card);border:1.5px solid var(--ink);border-radius:16px;overflow:hidden;box-shadow:8px 8px 0 rgba(25,23,52,0.10);}
      .bb-card2-core{box-shadow:8px 8px 0 rgba(9,147,184,0.22);}
      .bb-ribbon{display:inline-block;margin-top:16px;padding:6px 16px;border-radius:999px;background:var(--ink);color:#fdfcf7;font-family:'Space Mono',monospace;font-weight:700;font-size:10px;letter-spacing:4px;}

      /* ---- left: the drafted blueprint panel ---- */
      .bb-bp{position:relative;flex:0 0 45%;padding:34px 32px 30px;border-right:1.5px dashed rgba(25,23,52,0.28);display:flex;flex-direction:column;justify-content:space-between;gap:20px;
        background:
          repeating-linear-gradient(0deg, rgba(38,60,150,0.06) 0 1px, transparent 1px 22px),
          repeating-linear-gradient(90deg, rgba(38,60,150,0.06) 0 1px, transparent 1px 22px),
          #f4f6ff;
      }
      .bb-bp-head{display:flex;align-items:baseline;gap:12px;border-bottom:1.5px solid var(--ink);padding-bottom:10px;}
      .bb-bp-fig{font-family:'Space Mono',monospace;font-weight:700;font-size:11px;letter-spacing:2px;color:#fdfcf7;background:var(--ink);padding:3px 8px;}
      .bb-bp-headtitle{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1.6px;color:var(--ink);}
      .bb-org{margin-top:6px;display:flex;flex-direction:column;align-items:center;}
      .bb-org-founder{position:relative;text-align:center;padding:12px 26px;background:#fff;border:1.5px solid var(--ink);border-radius:10px;box-shadow:var(--hard);}
      .bb-org-founder::before{content:"";position:absolute;inset:-5px;border-radius:13px;background:var(--grad);z-index:-1;opacity:.9;}
      .bb-org-founder-k{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;color:var(--magenta);}
      .bb-org-founder-v{font-family:'Unbounded',sans-serif;font-weight:700;font-size:18px;color:var(--ink);margin-top:2px;}
      .bb-org-stem{width:1.5px;height:18px;background:var(--ink);}
      .bb-org-bus{width:78%;height:1.5px;background:var(--ink);position:relative;}
      .bb-org-bus::before,.bb-org-bus::after{content:"";position:absolute;top:0;width:1.5px;height:12px;background:var(--ink);}
      .bb-org-bus::before{left:0;} .bb-org-bus::after{right:0;}
      .bb-org-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;margin-top:14px;}
      .bb-org-node{display:flex;align-items:center;gap:9px;background:#fff;border:1px solid var(--edge);border-left:3px solid var(--cyan);border-radius:8px;padding:9px 11px;box-shadow:2px 2px 0 rgba(25,23,52,0.07);}
      .bb-org-node-1{border-left-color:var(--violet);}
      .bb-org-node-2{border-left-color:var(--magenta);}
      .bb-org-glyph{font-size:15px;line-height:1;color:var(--ink);}
      .bb-org-label{font-family:'Space Mono',monospace;font-weight:700;font-size:10px;letter-spacing:1.5px;color:var(--ink);}
      .bb-org-sub{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;color:var(--faint);margin-left:auto;}
      .bb-bp-mid{display:flex;flex-direction:column;gap:14px;}
      .bb-bp-specs{border:1px solid var(--edge);background:#fff;border-radius:8px;padding:4px 0;}
      .bb-bp-specs > div{display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:6px 12px;}
      .bb-bp-specs > div + div{border-top:1px dashed rgba(25,23,52,0.15);}
      .bb-bp-specs span{font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:2px;color:var(--faint);}
      .bb-bp-specs b{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:.6px;color:var(--ink);text-align:right;}
      .bb-bp-measure{display:flex;align-items:center;gap:8px;color:var(--cyan);}
      .bb-bp-measure-line{flex:1;height:1px;background:var(--cyan);}
      .bb-bp-measure-txt{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:1.6px;color:var(--cyan);white-space:nowrap;}
      .bb-bp-arrow{font-size:11px;line-height:1;}
      .bb-bp-note{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:1.4px;color:var(--magenta);border:1px dashed rgba(214,51,108,0.55);padding:7px 10px;text-align:center;background:rgba(214,51,108,0.05);}
      .bb-bp-stamp{position:absolute;right:24px;bottom:132px;transform:rotate(9deg);font-family:'Space Mono',monospace;font-weight:700;font-size:10px;letter-spacing:2px;line-height:1.8;text-align:center;color:var(--violet);border:2.5px double var(--violet);border-radius:10px;padding:10px 12px;opacity:.8;background:rgba(255,255,255,0.75);}
      .bb-bp-titleblock{display:grid;grid-template-columns:1.4fr 1fr;gap:1px;background:var(--ink);border:1.5px solid var(--ink);}
      .bb-bp-titleblock > div{background:#fff;padding:8px 10px;display:flex;flex-direction:column;gap:2px;}
      .bb-bp-titleblock > div:last-child{grid-column:1 / -1;}
      .bb-bp-titleblock span{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;color:var(--faint);}
      .bb-bp-titleblock b{font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:1px;color:var(--ink);}

      /* ---- right: the personalized panel ---- */
      .bb-card2-panel{flex:1;padding:46px 48px 40px;text-align:center;background:var(--card);}
      .bb-logo{display:block;margin:0 auto 18px;height:auto;}
      .bb-eyebrow{font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:5px;color:var(--faint);}
      .bb-eventname{font-family:'Unbounded',sans-serif;font-weight:700;font-size:19px;letter-spacing:1.5px;margin-top:10px;color:var(--ink);}
      .bb-tagchip{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--cyan);margin-top:9px;}
      .bb-divider{display:flex;align-items:center;justify-content:center;gap:13px;margin:24px 0 20px;}
      .bb-line{height:1.5px;width:60px;background:linear-gradient(90deg,transparent,rgba(25,23,52,0.5));}
      .bb-line.short{width:34px;}
      .bb-dear{font-size:14px;color:var(--muted);margin-bottom:4px;}
      .bb-name{font-family:'Unbounded',sans-serif;font-weight:900;font-size:40px;line-height:1.08;margin:4px 0 16px;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .bb-rolerow{display:flex;align-items:center;justify-content:center;gap:14px;}
      .bb-rolelabel{font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:3.5px;color:var(--ink);}
      .bb-msg{font-size:15px;line-height:1.7;color:#3c3a58;margin:14px 0 0;}
      .bb-msg:first-of-type{margin-top:28px;}
      .bb-msg-accent{font-weight:600;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .bb-star{color:var(--cyan);font-size:16px;line-height:1;margin:28px 0 24px;}
      .bb-gathering{padding-top:26px;border-top:1.5px dashed rgba(25,23,52,0.25);}
      .bb-gather-lines{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:1.8px;color:var(--ink);line-height:2.3;margin-top:14px;}
      .bb-cta{display:inline-block;margin-top:24px;padding:15px 40px;border:1.5px solid var(--ink);border-radius:999px;background:var(--grad);color:#fff;font-family:'Space Mono',monospace;font-weight:700;letter-spacing:2.5px;font-size:12px;text-transform:uppercase;cursor:pointer;text-decoration:none;box-shadow:var(--hard);transition:transform .15s ease, box-shadow .15s ease;}
      .bb-cta:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 rgba(25,23,52,0.14);}
      .bb-tagline{font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:3.5px;color:var(--muted);margin-top:32px;}
      .bb-host{font-size:11px;letter-spacing:.4px;color:var(--faint);margin-top:12px;line-height:1.7;}
      .bb-link{margin-top:26px;background:transparent;border:none;color:var(--muted);font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;cursor:pointer;}

      /* ---- details view ---- */
      .bb-details{max-width:760px;margin:0 auto;padding:54px 28px 100px;}
      .bb-d-head{text-align:center;}
      .bb-kicker{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:5px;color:var(--cyan);}
      .bb-d-title{font-family:'Unbounded',sans-serif;font-weight:900;font-size:40px;line-height:1.1;margin:14px 0 12px;color:var(--ink);}
      .bb-d-intro{font-size:15px;line-height:1.65;color:var(--muted);max-width:520px;margin:0 auto;}
      .bb-chip{display:inline-flex;align-items:center;gap:10px;margin-top:20px;padding:9px 18px;background:var(--card);border:1.5px solid var(--ink);border-radius:999px;box-shadow:3px 3px 0 rgba(25,23,52,0.10);}
      .bb-chip-name{font-family:'Unbounded',sans-serif;font-weight:700;font-size:13px;color:var(--ink);}
      .bb-dot{width:5px;height:5px;border-radius:999px;background:var(--grad);}
      .bb-chip-role{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:2.5px;color:var(--muted);}

      .bb-spot{margin:38px 0 0;padding:26px 30px;background:var(--card);border:1.5px solid var(--ink);border-radius:14px;box-shadow:var(--hard);position:relative;overflow:hidden;}
      .bb-spot::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--grad);}
      .bb-spot-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;}
      .bb-spot-tag{font-family:'Space Mono',monospace;font-weight:700;font-size:10.5px;letter-spacing:3.5px;color:var(--cyan);}
      .bb-spot-time{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:1px;color:var(--magenta);}
      .bb-spot-title{font-family:'Unbounded',sans-serif;font-weight:700;font-size:22px;line-height:1.2;color:var(--ink);margin:10px 0 14px;}
      .bb-spot-lines{display:flex;flex-direction:column;gap:9px;}
      .bb-spot-line{display:flex;align-items:flex-start;gap:11px;font-size:14px;color:#3c3a58;line-height:1.55;}

      .bb-sec{margin-top:46px;}
      .bb-bordered{padding-top:30px;border-top:1.5px dashed rgba(25,23,52,0.25);}
      .bb-sec-eyebrow{font-family:'Space Mono',monospace;font-weight:700;font-size:10.5px;letter-spacing:4px;color:var(--faint);}
      .bb-sec-eyebrow.center{text-align:center;}
      .bb-sec-title{font-family:'Unbounded',sans-serif;font-weight:700;font-size:24px;color:var(--ink);margin:8px 0 18px;}
      .bb-note{font-size:14px;color:var(--muted);line-height:1.65;margin-bottom:18px;}
      .bb-tl{display:flex;gap:20px;padding:16px 0;border-top:1px solid rgba(25,23,52,0.10);}
      .bb-tl-time{flex:0 0 130px;font-family:'Space Mono',monospace;font-size:11.5px;letter-spacing:.5px;color:var(--cyan);padding-top:3px;}
      .bb-tl-body{flex:1;}
      .bb-tl-titlerow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
      .bb-tl-title{font-family:'Unbounded',sans-serif;font-weight:500;font-size:15px;color:var(--ink);line-height:1.3;}
      .bb-badge{font-family:'Space Mono',monospace;font-weight:700;font-size:9px;letter-spacing:2px;color:#fff;background:var(--grad);padding:3px 9px;border-radius:999px;}
      .bb-tl-desc{font-size:13.5px;color:var(--muted);line-height:1.6;margin-top:5px;}
      .bb-prep{margin-top:30px;padding:18px 22px;border:1px dashed rgba(9,147,184,0.6);border-left:4px solid var(--cyan);background:rgba(10,169,207,0.06);border-radius:0 10px 10px 0;font-size:14px;color:#155e73;line-height:1.65;}
      .bb-stack{display:flex;flex-direction:column;gap:10px;}
      .bb-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
      .bb-tile{padding:18px 20px;background:var(--card);border:1px solid var(--edge);border-radius:12px;box-shadow:3px 3px 0 rgba(25,23,52,0.07);}
      .bb-tile-cyan{border-top:3px solid var(--cyan);}
      .bb-tile-violet{border-top:3px solid var(--violet);}
      .bb-tile-magenta{border-top:3px solid var(--magenta);}
      .bb-tile-t{font-family:'Unbounded',sans-serif;font-weight:700;font-size:14.5px;}
      .bb-violet-text{color:var(--violet);}
      .bb-magenta-text{color:var(--magenta);}
      .bb-cyan-text{color:var(--cyan);}
      .bb-tile-d{font-size:13.5px;color:var(--muted);line-height:1.55;margin-top:6px;}

      .bb-pass{margin-top:34px;display:flex;align-items:stretch;border:1.5px solid var(--ink);border-radius:14px;overflow:hidden;background:var(--card);box-shadow:var(--hard);}
      .bb-pass-main{flex:1;padding:26px 28px;}
      .bb-pass-tag{font-family:'Space Mono',monospace;font-weight:700;font-size:10px;letter-spacing:3.5px;color:var(--cyan);}
      .bb-pass-name{font-family:'Unbounded',sans-serif;font-weight:900;font-size:26px;line-height:1.1;margin:8px 0 4px;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .bb-pass-sub{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2.5px;color:var(--muted);}
      .bb-pass-meta{display:flex;gap:24px;margin-top:18px;}
      .bb-pass-k{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--faint);}
      .bb-pass-v{font-size:12.5px;color:var(--ink);margin-top:3px;font-weight:600;}
      .bb-pass-qr{flex:0 0 130px;display:flex;align-items:center;justify-content:center;border-left:1.5px dashed rgba(25,23,52,0.35);background:#f4f6ff;}
      .bb-qr{width:84px;height:84px;border-radius:8px;background-color:#fff;border:1px solid var(--edge);background-image:repeating-linear-gradient(0deg,var(--ink) 0 6px,transparent 6px 12px),repeating-linear-gradient(90deg,var(--ink) 0 6px,transparent 6px 12px);background-size:24px 24px;opacity:.85;}

      .bb-ess{margin-top:46px;padding:28px 30px;background:var(--card);border:1.5px solid var(--ink);border-radius:14px;box-shadow:var(--hard);}
      .bb-ess .bb-sec-eyebrow{margin-bottom:18px;}
      .bb-ess-k{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2.5px;color:var(--faint);}
      .bb-ess-v{font-size:14px;color:var(--ink);line-height:1.45;margin-top:4px;font-weight:500;}
      .bb-discord{margin-top:20px;padding-top:16px;border-top:1px dashed rgba(25,23,52,0.25);font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:2px;color:var(--muted);text-align:center;}
      .bb-discord a{color:var(--cyan);text-decoration:underline;}
      .bb-foot{margin-top:40px;text-align:center;}
      .bb-foot .bb-star{margin:30px 0 0;}

      @media (max-width:880px){
        .bb-card2{flex-direction:column;width:600px;}
        .bb-bp{flex:none;border-right:none;border-bottom:1.5px dashed rgba(25,23,52,0.28);}
        .bb-bp-stamp{right:14px;top:auto;bottom:118px;}
      }
      @media (max-width:680px){
        .bb-card2-panel{padding:34px 24px 30px;}
        .bb-bp{padding:26px 20px 24px;}
        .bb-name{font-size:30px;}
        .bb-details{padding:40px 18px 90px;}
        .bb-d-title{font-size:30px;}
        .bb-grid2{grid-template-columns:1fr;}
        .bb-tl{flex-direction:column;gap:4px;}
        .bb-tl-time{flex-basis:auto;}
        .bb-pass{flex-direction:column;}
        .bb-pass-qr{border-left:none;border-top:1.5px dashed rgba(25,23,52,0.35);padding:18px 0;}
        .bb-bar{padding:11px 14px;gap:8px;}
        .bb-bar-brand{display:none;}
      }
    `}</style>
  );
}
