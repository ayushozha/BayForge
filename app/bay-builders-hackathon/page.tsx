import type { Metadata } from "next";
import Link from "next/link";
import { GUESTS } from "@/lib/bay-builders/guests";
import type { BayRole } from "@/lib/bay-builders/types";

export const metadata: Metadata = {
  title: "Bay Builders Hackathon · Guests",
  description: "The judges, speakers, sponsors, and hosts of Bay Builders Hackathon 2026.",
  robots: { index: false, follow: false },
};

const GROUP_ORDER: { role: BayRole; label: string }[] = [
  { role: "cohost", label: "CO-HOSTS · CORE TEAM" },
  { role: "speaker-judge", label: "GUEST SPEAKERS & JUDGES" },
  { role: "speaker", label: "FEATURED SPEAKERS" },
  { role: "sponsor", label: "SPONSORS" },
  { role: "judge", label: "HONORED JUDGES" },
  { role: "vip", label: "VIP" },
];

export default function GuestIndex() {
  return (
    <div className="bbi-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Archivo:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
        .bbi-root{
          --paper:#faf8f2; --card:#fffdf8; --ink:#191734; --muted:#5d5b78; --faint:#8b89a3;
          --cyan:#0993b8; --violet:#6d3fe0; --magenta:#d6336c;
          --grad:linear-gradient(100deg,#0aa9cf 0%,#6d3fe0 52%,#e0447c 100%);
          --edge:rgba(25,23,52,0.14);
          min-height:100vh;color:var(--ink);font-family:'Archivo',sans-serif;padding:64px 24px 96px;
          background:
            repeating-linear-gradient(0deg, rgba(38,60,150,0.045) 0 1px, transparent 1px 28px),
            repeating-linear-gradient(90deg, rgba(38,60,150,0.045) 0 1px, transparent 1px 28px),
            radial-gradient(110% 55% at 50% -6%, rgba(10,169,207,0.10) 0%, rgba(250,248,242,0) 58%),
            var(--paper);
        }
        .bbi-wrap{max-width:1040px;margin:0 auto;}
        .bbi-head{text-align:center;margin-bottom:48px;}
        .bbi-logo{display:block;margin:0 auto 18px;width:180px;height:auto;}
        .bbi-eyebrow{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:5px;color:var(--faint);}
        .bbi-title{font-family:'Unbounded',sans-serif;font-weight:900;font-size:48px;line-height:1.08;margin:16px 0 0;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .bbi-tag{font-family:'Space Mono',monospace;font-size:10.5px;letter-spacing:3px;color:var(--cyan);margin-top:14px;}
        .bbi-group{margin-top:44px;}
        .bbi-group-label{font-family:'Space Mono',monospace;font-weight:700;font-size:10.5px;letter-spacing:4px;color:var(--cyan);margin-bottom:18px;}
        .bbi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
        .bbi-card{display:flex;flex-direction:column;gap:6px;padding:22px 22px 20px;background:var(--card);border:1.5px solid var(--ink);border-radius:12px;box-shadow:4px 4px 0 rgba(25,23,52,0.10);transition:transform .15s ease,box-shadow .15s ease;text-decoration:none;}
        .bbi-card:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 rgba(10,169,207,0.28);}
        .bbi-name{font-family:'Unbounded',sans-serif;font-weight:700;font-size:19px;line-height:1.2;color:var(--ink);}
        .bbi-role{font-family:'Space Mono',monospace;font-size:9.5px;letter-spacing:2px;color:var(--muted);}
        .bbi-open{font-family:'Space Mono',monospace;font-weight:700;font-size:10px;letter-spacing:2px;margin-top:8px;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        @media (max-width:680px){.bbi-title{font-size:34px;}}
      `}</style>
      <div className="bbi-wrap">
        <div className="bbi-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bbi-logo" src="/bay-builders-hackathon/assets/brand-logo.png" alt="BayForge" />
          <div className="bbi-eyebrow">BAY BUILDERS HACKATHON · GUESTS</div>
          <div className="bbi-title">The people of the build</div>
          <div className="bbi-tag">▸▸▸ BUILD YOUR OWN AI ORGANIZATION ◂◂◂</div>
        </div>
        {GROUP_ORDER.map(({ role, label }) => {
          const people = GUESTS.filter((g) => g.role === role);
          if (people.length === 0) return null;
          return (
            <div key={role} className="bbi-group">
              <div className="bbi-group-label">{label}</div>
              <div className="bbi-grid">
                {people.map((g) => (
                  <Link key={g.slug} href={`/bay-builders-hackathon/${g.slug}`} className="bbi-card">
                    <div className="bbi-name">{g.name}</div>
                    <div className="bbi-role">{g.roleLabel}</div>
                    <div className="bbi-open">OPEN INVITATION →</div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
