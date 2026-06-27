"use client";

import { useEffect, useMemo, useState } from "react";
import type { Guest } from "@/lib/wizard/types";
import { EVENT } from "@/lib/wizard/types";
import { ROLE_CONTENT } from "@/lib/wizard/content";

type View = "invitation" | "details";

/** Replace {{company}} in a string with the guest's company (or a neutral fallback). */
function fill(text: string, guest: Guest): string {
  return text.replaceAll("{{company}}", guest.company || "your team");
}

const ORGANIZER_EMAIL = "outreach@bayforge.events";

/** mailto: the organizers with a role-aware, guest-aware subject + body. */
function confirmMailto(guest: Guest): string {
  const subject = `Wizard Hackathon 2026 — ${guest.name} (${guest.roleLabel})`;
  const body = [
    `Hi Bay Forge team,`,
    ``,
    `This is ${guest.name}. Confirming my role for Wizard Hackathon 2026 on June 28.`,
    `Role: ${guest.roleLabel}.`,
    ``,
    `[Add any questions or scheduling notes here.]`,
  ].join("\n");
  return `mailto:${ORGANIZER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function WizardExperience({ guest }: { guest: Guest }) {
  const [view, setView] = useState<View>("invitation");
  const content = ROLE_CONTENT[guest.role];
  const cardSrc = guest.card ? `/wizard-hackathon/cards/${guest.slug}.webp` : null;
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
      { k: "REQUIRED TOOLS", v: EVENT.tools },
    ],
    [],
  );

  const d = content.d;

  return (
    <div className="wz-root">
      <WizardStyles />

      {/* top bar */}
      <div className="wz-bar">
        <a href="/wizard-hackathon" className="wz-pill-btn">
          ← ALL GUESTS
        </a>
        <div className="wz-bar-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wizard-hackathon/assets/crest.png" width={22} height={22} alt="" />
          <span>WIZARD HACKATHON 2026</span>
        </div>
        <div className="wz-toggle">
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
        <section className="wz-invite-wrap">
          <div className="wz-kick-top">YOUR INVITATION</div>
          <div className="wz-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wizard-hackathon/assets/cover.png"
              width={600}
              height={360}
              alt="Wizard Hackathon 2026"
              className="wz-cover"
            />
            <div className="wz-card-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/wizard-hackathon/assets/crest.png"
                width={62}
                height={62}
                alt=""
                className="wz-crest"
              />
              <div className="wz-eyebrow">WELCOME TO</div>
              <div className="wz-eventname">WIZARD HACKATHON 2026</div>
              <Divider />
              {content.dear && <div className="wz-dear">Dear</div>}
              <div className="wz-name">{guest.name}</div>
              <div className="wz-rolerow">
                <span className="wz-line short" />
                <span className="wz-rolelabel">{guest.roleLabel}</span>
                <span className="wz-line short" />
              </div>
              {content.laurel && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/wizard-hackathon/assets/laurel.png"
                  width={118}
                  height={70}
                  alt=""
                  className="wz-laurel"
                />
              )}
              <p className="wz-msg">{fill(content.email.m1, guest)}</p>
              <p className="wz-msg">{fill(content.email.m2, guest)}</p>
              <p className="wz-msg wz-msg-accent">{fill(content.email.m3, guest)}</p>
              <div className="wz-star">✦</div>
              <div className="wz-gathering">
                <div className="wz-eyebrow">THE GATHERING</div>
                <div className="wz-gather-lines">
                  <div>✦&nbsp;&nbsp;SUNDAY · JUNE 28, 2026</div>
                  <div>✦&nbsp;&nbsp;9:00 AM – 8:00 PM</div>
                  <div>✦&nbsp;&nbsp;FRONTIER TOWER · SAN FRANCISCO</div>
                </div>
                <button className="wz-cta" onClick={() => setView("details")}>
                  {content.email.cta}
                </button>
              </div>
              <div className="wz-tagline">
                WHERE <span style={{ color: "#5fd8c8" }}>MAGIC</span> MEETS{" "}
                <span style={{ color: "#ff8fc7" }}>INNOVATION</span>
              </div>
              <div className="wz-host">Hosted by Bay Forge &amp; FinChip · Frontier Tower, San Francisco</div>
            </div>
          </div>

          {cardSrc && (
            <div className="wz-yourcard">
              <div className="wz-eyebrow center">YOUR INVITATION CARD</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cardSrc} alt={`${guest.name} invitation card`} className="wz-cardimg" />
            </div>
          )}

          <button className="wz-link" onClick={() => setView("details")}>
            SEE YOUR FULL BRIEF →
          </button>
        </section>
      )}

      {view === "details" && (
        <section className="wz-details">
          <div className="wz-d-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/wizard-hackathon/assets/crest.png" width={50} height={50} alt="" />
            <div className="wz-kicker">{d.kicker}</div>
            <div className="wz-d-title">{d.title}</div>
            <div className="wz-d-intro">{d.intro}</div>
            <div className="wz-chip">
              <span className="wz-chip-name">{guest.name}</span>
              <span className="wz-dot" />
              <span className="wz-chip-role">{guest.roleLabel}</span>
            </div>
          </div>

          {/* spotlight */}
          <div className="wz-spot">
            <div className="wz-spot-top">
              <span className="wz-spot-tag">{d.spotlight.tag}</span>
              <span className="wz-spot-time">{d.spotlight.time}</span>
            </div>
            <div className="wz-spot-title">{d.spotlight.title}</div>
            <div className="wz-spot-lines">
              {d.spotlight.lines.map((l, i) => (
                <div key={i} className="wz-spot-line">
                  <span className="wz-gold">✦</span>
                  <span>{fill(l, guest)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* run of show */}
          <div className="wz-sec">
            <div className="wz-sec-eyebrow">RUN OF SHOW</div>
            <div className="wz-sec-title">Your day, hour by hour</div>
            <div>
              {d.timeline.map((it, i) => (
                <div key={i} className="wz-tl">
                  <div className="wz-tl-time">{it.time}</div>
                  <div className="wz-tl-body">
                    <div className="wz-tl-titlerow">
                      <span className="wz-tl-title">{it.title}</span>
                      {it.highlight && <span className="wz-badge">★ {d.youBadge}</span>}
                    </div>
                    <div className="wz-tl-desc">{it.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {d.prep && <div className="wz-prep">{fill(d.prep, guest)}</div>}

          {d.hasInterview && d.questions && (
            <div className="wz-sec wz-bordered">
              <div className="wz-sec-eyebrow">MEDIA INTERVIEW GUIDE</div>
              <div className="wz-sec-title">A quick, casual chat</div>
              <div className="wz-note">{fill(d.interviewNote ?? "", guest)}</div>
              <div className="wz-stack">
                {d.questions.map((q, i) => (
                  <div key={i} className="wz-qrow">
                    <span className="wz-teal">✦</span>
                    <span>{fill(q, guest)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.judgingItems && (
            <div className="wz-sec wz-bordered">
              <div className="wz-sec-eyebrow">JUDGING</div>
              <div className="wz-sec-title">What you’re scoring</div>
              <div className="wz-note">{fill(d.judgingNote ?? "", guest)}</div>
              <div className="wz-grid2">
                {d.judgingItems.map((j, i) => (
                  <div key={i} className="wz-tile wz-tile-teal">
                    <div className="wz-tile-t wz-teal-text">{j.t}</div>
                    <div className="wz-tile-d">{j.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.perks && (
            <div className="wz-sec wz-bordered">
              <div className="wz-sec-eyebrow">PERKS</div>
              <div className="wz-sec-title">{d.perksNote}</div>
              <div className="wz-grid2">
                {d.perks.map((p, i) => (
                  <div key={i} className="wz-tile wz-tile-pink">
                    <div className="wz-tile-t wz-pink-text">{p.t}</div>
                    <div className="wz-tile-d">{p.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {d.hasPass && (
            <div className="wz-pass">
              <div className="wz-pass-main">
                <div className="wz-pass-tag">VIP ACCESS PASS</div>
                <div className="wz-pass-name">{guest.name}</div>
                <div className="wz-pass-sub">INNER CIRCLE · WIZARD HACKATHON 2026</div>
                <div className="wz-pass-meta">
                  <div>
                    <div className="wz-pass-k">DATE</div>
                    <div className="wz-pass-v">Jun 28, 2026</div>
                  </div>
                  <div>
                    <div className="wz-pass-k">PASS</div>
                    <div className="wz-pass-v">WZ-2026-VIP</div>
                  </div>
                </div>
              </div>
              <div className="wz-pass-qr">
                <div className="wz-qr" />
              </div>
            </div>
          )}

          {/* essentials */}
          <div className="wz-ess">
            <div className="wz-sec-eyebrow center">EVENT ESSENTIALS</div>
            <div className="wz-grid2">
              {essentials.map((e, i) => (
                <div key={i}>
                  <div className="wz-ess-k">{e.k}</div>
                  <div className="wz-ess-v">{e.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="wz-foot">
            <a className="wz-cta" href={confirmHref}>
              {d.ctaPrimary}
            </a>
            <div>
              <button className="wz-link" onClick={() => setView("invitation")}>
                ← BACK TO INVITATION
              </button>
            </div>
            <div className="wz-star">✦</div>
          </div>
        </section>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="wz-divider">
      <span className="wz-line" />
      <span className="wz-gold">✦</span>
      <span className="wz-line" />
    </div>
  );
}

function WizardStyles() {
  // Scoped, self-contained styling that matches the invitation cards (gold/teal/lavender
  // on near-black), independent of the BayForge neon palette.
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');
      .wz-root{min-height:100vh;background:radial-gradient(120% 60% at 50% -8%, rgba(46,30,90,0.42) 0%, rgba(7,7,13,0) 55%), #07070d;font-family:'Jost',sans-serif;color:#c8cee6;}
      .wz-root *{box-sizing:border-box;}
      .wz-gold{color:#c9a96a;}
      .wz-teal{color:#7fd8c8;}
      .wz-bar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 26px;background:rgba(9,9,17,0.85);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid rgba(201,169,106,0.16);}
      .wz-pill-btn{display:inline-flex;align-items:center;gap:8px;background:transparent;border:1px solid rgba(170,179,214,0.22);color:#aab3d6;font-size:11px;letter-spacing:2px;padding:8px 14px;border-radius:999px;cursor:pointer;}
      .wz-bar-brand{display:flex;align-items:center;gap:10px;font-weight:300;font-size:10.5px;letter-spacing:4px;color:#8a93b8;}
      .wz-toggle{display:flex;gap:4px;padding:3px;border:1px solid rgba(201,169,106,0.22);border-radius:999px;}
      .wz-toggle button{font-size:10.5px;letter-spacing:1.5px;padding:6px 13px;border-radius:999px;background:transparent;border:none;color:#9aa2c4;cursor:pointer;font-family:inherit;}
      .wz-toggle button.on{background:linear-gradient(100deg,#e2cf9c,#c9a96a);color:#0a0a13;}

      .wz-invite-wrap{display:flex;flex-direction:column;align-items:center;padding:40px 20px 80px;}
      .wz-kick-top{font-weight:300;font-size:11px;letter-spacing:4px;color:#6f7798;margin-bottom:20px;}
      .wz-card{width:600px;max-width:100%;background:#0a0a13;border:1px solid rgba(201,169,106,0.30);border-radius:16px;overflow:hidden;box-shadow:0 40px 90px -35px rgba(90,50,170,0.5);}
      .wz-cover{display:block;width:100%;height:auto;}
      .wz-card-body{padding:46px 54px 40px;text-align:center;background:radial-gradient(120% 60% at 50% 0%, rgba(48,34,92,0.30) 0%, rgba(10,10,19,0) 58%), #0a0a13;}
      .wz-crest{display:block;margin:0 auto 18px;height:auto;}
      .wz-eyebrow{font-weight:300;font-size:11px;letter-spacing:5px;color:#9aa2c4;}
      .wz-eyebrow.center{text-align:center;}
      .wz-eventname{font-weight:400;font-size:18px;letter-spacing:5px;margin-top:9px;background:linear-gradient(100deg,#5fd8c8 0%,#9db4ff 45%,#ff9ed0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .wz-divider{display:flex;align-items:center;justify-content:center;gap:13px;margin:24px 0 20px;}
      .wz-line{height:1px;width:60px;background:linear-gradient(90deg,transparent,rgba(201,169,106,0.6));}
      .wz-line.short{width:34px;}
      .wz-dear{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:21px;color:#aab3d6;margin-bottom:2px;}
      .wz-name{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:52px;line-height:1.04;margin:4px 0 14px;background:linear-gradient(102deg,#7fe0ff 0%,#a7b6ff 32%,#cda6ff 60%,#ff9ed0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;filter:drop-shadow(0 0 24px rgba(150,140,255,0.35));}
      .wz-rolerow{display:flex;align-items:center;justify-content:center;gap:14px;}
      .wz-rolelabel{font-weight:400;font-size:12.5px;letter-spacing:4px;color:#aeb6d8;}
      .wz-laurel{display:block;margin:26px auto 4px;height:auto;}
      .wz-msg{font-family:'Cormorant Garamond',serif;font-size:20px;line-height:1.55;color:#c8cee6;margin:14px 0 0;}
      .wz-msg:first-of-type{margin-top:30px;}
      .wz-msg-accent{font-style:italic;font-weight:500;background:linear-gradient(100deg,#5fd8c8 0%,#b9a6ff 50%,#ff9ed0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .wz-star{color:#c9a96a;font-size:22px;line-height:1;margin:34px 0 28px;}
      .wz-gathering{padding-top:28px;border-top:1px solid rgba(201,169,106,0.18);}
      .wz-gather-lines{font-size:13px;letter-spacing:2.5px;color:#d7ddef;line-height:2.15;margin-top:14px;}
      .wz-cta{display:inline-block;margin-top:24px;padding:15px 40px;border:none;border-radius:999px;background:linear-gradient(100deg,#e2cf9c 0%,#c9a96a 100%);color:#0a0a13;font-family:'Jost',sans-serif;font-weight:500;letter-spacing:2.5px;font-size:12px;text-transform:uppercase;cursor:pointer;text-decoration:none;box-shadow:0 12px 34px -10px rgba(201,169,106,0.6);}
      .wz-tagline{font-weight:400;font-size:11px;letter-spacing:4px;color:#7e87ab;margin-top:34px;}
      .wz-host{font-weight:300;font-size:10.5px;letter-spacing:1px;color:#565e7d;margin-top:14px;line-height:1.7;}
      .wz-yourcard{margin-top:40px;width:600px;max-width:100%;text-align:center;}
      .wz-cardimg{display:block;width:100%;height:auto;border-radius:14px;margin-top:14px;border:1px solid rgba(201,169,106,0.18);}
      .wz-link{margin-top:26px;background:transparent;border:none;color:#9aa2c4;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:2px;cursor:pointer;}

      .wz-details{max-width:760px;margin:0 auto;padding:54px 28px 100px;}
      .wz-d-head{text-align:center;}
      .wz-d-head img{display:block;margin:0 auto 16px;height:auto;}
      .wz-kicker{font-weight:400;font-size:11px;letter-spacing:5px;color:#c9a96a;}
      .wz-d-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:46px;line-height:1.06;margin:12px 0;background:linear-gradient(102deg,#7fe0ff 0%,#a7b6ff 34%,#cda6ff 62%,#ff9ed0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .wz-d-intro{font-family:'Cormorant Garamond',serif;font-size:20px;line-height:1.5;color:#c4cae2;max-width:520px;margin:0 auto;}
      .wz-chip{display:inline-flex;align-items:center;gap:10px;margin-top:20px;padding:9px 18px;border:1px solid rgba(201,169,106,0.3);border-radius:999px;}
      .wz-chip-name{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:#e7ecff;}
      .wz-dot{width:4px;height:4px;border-radius:999px;background:#c9a96a;}
      .wz-chip-role{font-size:10px;letter-spacing:2.5px;color:#aeb6d8;}

      .wz-spot{margin:38px 0 0;padding:26px 30px;border:1px solid rgba(201,169,106,0.32);border-radius:16px;background:linear-gradient(180deg,rgba(201,169,106,0.07),rgba(201,169,106,0.015));}
      .wz-spot-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;}
      .wz-spot-tag{font-weight:500;font-size:10.5px;letter-spacing:3.5px;color:#c9a96a;}
      .wz-spot-time{font-size:13px;letter-spacing:2px;color:#9fe6da;}
      .wz-spot-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:28px;line-height:1.1;color:#eef1ff;margin:8px 0 14px;}
      .wz-spot-lines{display:flex;flex-direction:column;gap:9px;}
      .wz-spot-line{display:flex;align-items:flex-start;gap:11px;font-weight:300;font-size:14px;color:#cdd4ec;line-height:1.5;}

      .wz-sec{margin-top:46px;}
      .wz-bordered{padding-top:30px;border-top:1px solid rgba(201,169,106,0.18);}
      .wz-sec-eyebrow{font-weight:500;font-size:11px;letter-spacing:4px;color:#8a93b8;}
      .wz-sec-eyebrow.center{text-align:center;}
      .wz-sec-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:30px;color:#e7ecff;margin:6px 0 18px;}
      .wz-note{font-family:'Cormorant Garamond',serif;font-size:19px;color:#aab3d6;line-height:1.5;margin-bottom:18px;}
      .wz-tl{display:flex;gap:20px;padding:16px 0;border-top:1px solid rgba(255,255,255,0.06);}
      .wz-tl-time{flex:0 0 124px;font-size:12px;letter-spacing:1.5px;color:#c9a96a;padding-top:2px;}
      .wz-tl-body{flex:1;}
      .wz-tl-titlerow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
      .wz-tl-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:20px;color:#e7ecff;line-height:1.2;}
      .wz-badge{font-weight:500;font-size:9px;letter-spacing:2px;color:#0a0a13;background:linear-gradient(100deg,#e2cf9c,#c9a96a);padding:3px 8px;border-radius:999px;}
      .wz-tl-desc{font-weight:300;font-size:13.5px;color:#9aa2c4;line-height:1.55;margin-top:4px;}
      .wz-prep{margin-top:30px;padding:18px 22px;border-left:2px solid #c9a96a;background:rgba(201,169,106,0.06);border-radius:0 10px 10px 0;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:18px;color:#e2d6b6;}
      .wz-stack{display:flex;flex-direction:column;gap:10px;}
      .wz-qrow{display:flex;align-items:flex-start;gap:12px;padding:13px 16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;font-family:'Cormorant Garamond',serif;font-size:18px;color:#d3d9ef;line-height:1.45;}
      .wz-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
      .wz-tile{padding:18px 20px;background:rgba(255,255,255,0.02);border-radius:12px;}
      .wz-tile-teal{border:1px solid rgba(127,216,200,0.16);}
      .wz-tile-pink{border:1px solid rgba(255,143,199,0.18);}
      .wz-tile-t{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:21px;}
      .wz-teal-text{color:#9fe6da;}
      .wz-pink-text{color:#ff9ed0;}
      .wz-tile-d{font-weight:300;font-size:13.5px;color:#aab3d6;line-height:1.5;margin-top:6px;}

      .wz-pass{margin-top:34px;display:flex;align-items:stretch;border:1px solid rgba(201,169,106,0.32);border-radius:16px;overflow:hidden;background:linear-gradient(120deg,#11101d,#0c0b16);}
      .wz-pass-main{flex:1;padding:26px 28px;}
      .wz-pass-tag{font-weight:500;font-size:10px;letter-spacing:3.5px;color:#c9a96a;}
      .wz-pass-name{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:30px;line-height:1.05;margin:8px 0 2px;background:linear-gradient(102deg,#7fe0ff,#cda6ff 55%,#ff9ed0);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
      .wz-pass-sub{font-size:10.5px;letter-spacing:3px;color:#aeb6d8;}
      .wz-pass-meta{display:flex;gap:24px;margin-top:18px;}
      .wz-pass-k{font-size:9px;letter-spacing:2px;color:#6f7798;}
      .wz-pass-v{font-size:12.5px;color:#d7ddef;margin-top:3px;}
      .wz-pass-qr{flex:0 0 130px;display:flex;align-items:center;justify-content:center;border-left:1px dashed rgba(201,169,106,0.3);background:rgba(255,255,255,0.02);}
      .wz-qr{width:84px;height:84px;border-radius:8px;background-color:#0a0a13;background-image:repeating-linear-gradient(0deg,#cda6ff 0 6px,transparent 6px 12px),repeating-linear-gradient(90deg,#cda6ff 0 6px,transparent 6px 12px);background-size:24px 24px;opacity:0.85;}

      .wz-ess{margin-top:46px;padding:28px 30px;border:1px solid rgba(255,255,255,0.07);border-radius:16px;background:rgba(255,255,255,0.012);}
      .wz-ess .wz-sec-eyebrow{margin-bottom:18px;}
      .wz-ess-k{font-weight:400;font-size:9.5px;letter-spacing:2.5px;color:#6f7798;}
      .wz-ess-v{font-family:'Cormorant Garamond',serif;font-size:19px;color:#dfe4f5;line-height:1.35;margin-top:4px;}
      .wz-foot{margin-top:40px;text-align:center;}
      .wz-foot .wz-star{margin:30px 0 0;}

      @media (max-width:680px){
        .wz-card-body{padding:34px 24px 30px;}
        .wz-name{font-size:40px;}
        .wz-details{padding:40px 18px 90px;}
        .wz-d-title{font-size:36px;}
        .wz-grid2{grid-template-columns:1fr;}
        .wz-tl{flex-direction:column;gap:4px;}
        .wz-tl-time{flex-basis:auto;}
        .wz-pass{flex-direction:column;}
        .wz-pass-qr{border-left:none;border-top:1px dashed rgba(201,169,106,0.3);padding:18px 0;}
        .wz-bar{padding:11px 14px;gap:8px;}
        .wz-bar-brand{display:none;}
      }
    `}</style>
  );
}
