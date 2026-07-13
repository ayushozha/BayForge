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
  { role: "cohost", label: "Co-Hosts · Core Team" },
  { role: "speaker-judge", label: "Guest Speakers & Judges" },
  { role: "speaker", label: "Featured Speakers" },
  { role: "sponsor", label: "Sponsors" },
  { role: "judge", label: "Honored Judges" },
  { role: "vip", label: "VIP" },
];

export default function GuestIndex() {
  return (
    <div className="bbi-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Chakra+Petch:wght@300;400;500&display=swap');
        .bbi-root{min-height:100vh;background:radial-gradient(130% 65% at 50% -10%, rgba(88,40,180,0.38) 0%, rgba(5,5,16,0) 55%), #050510;font-family:'Chakra Petch',sans-serif;color:#c8cee6;padding:64px 24px 96px;}
        .bbi-wrap{max-width:1040px;margin:0 auto;}
        .bbi-head{text-align:center;margin-bottom:48px;}
        .bbi-logochip{display:inline-block;background:#f6f4ef;border-radius:10px;padding:8px 16px;margin-bottom:18px;}
        .bbi-logochip img{display:block;width:170px;height:auto;}
        .bbi-eyebrow{font-weight:300;font-size:11px;letter-spacing:5px;color:#8f96bd;}
        .bbi-title{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:54px;line-height:1.05;margin:14px 0 0;background:linear-gradient(105deg,#22d3ee 0%,#818cf8 36%,#a855f7 64%,#e879f9 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .bbi-tag{font-size:11px;letter-spacing:3px;color:#22d3ee;margin-top:12px;}
        .bbi-group{margin-top:44px;}
        .bbi-group-label{font-weight:500;font-size:11px;letter-spacing:4px;color:#22d3ee;margin-bottom:18px;}
        .bbi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
        .bbi-card{display:flex;flex-direction:column;gap:6px;padding:22px 22px 20px;background:linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.008));border:1px solid rgba(168,85,247,0.28);border-radius:14px;transition:transform .16s ease,border-color .16s ease;text-decoration:none;}
        .bbi-card:hover{transform:translateY(-3px);border-color:rgba(34,211,238,0.6);}
        .bbi-name{font-family:'Rajdhani',sans-serif;font-weight:700;font-size:24px;line-height:1.1;background:linear-gradient(102deg,#22d3ee 0%,#818cf8 38%,#a855f7 66%,#e879f9 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .bbi-role{font-size:10.5px;letter-spacing:2.5px;color:#aeb6d8;}
        .bbi-open{font-weight:500;font-size:10.5px;letter-spacing:2px;color:#22d3ee;margin-top:6px;}
        @media (max-width:680px){.bbi-title{font-size:40px;}}
      `}</style>
      <div className="bbi-wrap">
        <div className="bbi-head">
          <div className="bbi-logochip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bay-builders-hackathon/assets/brand-logo.png" alt="BayForge" />
          </div>
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
