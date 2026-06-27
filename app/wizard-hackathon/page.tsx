import type { Metadata } from "next";
import Link from "next/link";
import { GUESTS } from "@/lib/wizard/guests";
import type { WizardRole } from "@/lib/wizard/types";

export const metadata: Metadata = {
  title: "Wizard Hackathon 2026 · Guests",
  description: "The judges, speakers, and sponsors of Wizard Hackathon 2026.",
  robots: { index: false, follow: false },
};

const GROUP_ORDER: { role: WizardRole; label: string }[] = [
  { role: "speaker-judge", label: "Guest Speaker & Judge" },
  { role: "sponsor", label: "Sponsors" },
  { role: "judge", label: "Honored Judges" },
  { role: "vip", label: "VIP" },
];

export default function GuestIndex() {
  return (
    <div className="wzi-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500&display=swap');
        .wzi-root{min-height:100vh;background:radial-gradient(120% 60% at 50% -8%, rgba(46,30,90,0.42) 0%, rgba(7,7,13,0) 55%), #07070d;font-family:'Jost',sans-serif;color:#c8cee6;padding:64px 24px 96px;}
        .wzi-wrap{max-width:1040px;margin:0 auto;}
        .wzi-head{text-align:center;margin-bottom:48px;}
        .wzi-crest{display:block;margin:0 auto 18px;width:64px;height:auto;}
        .wzi-eyebrow{font-weight:300;font-size:11px;letter-spacing:5px;color:#9aa2c4;}
        .wzi-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:54px;line-height:1.05;margin:14px 0 0;background:linear-gradient(105deg,#7fe0ff 0%,#9db4ff 32%,#c9a6ff 58%,#ff9ed0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .wzi-group{margin-top:44px;}
        .wzi-group-label{font-weight:500;font-size:11px;letter-spacing:4px;color:#c9a96a;margin-bottom:18px;}
        .wzi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;}
        .wzi-card{display:flex;flex-direction:column;gap:6px;padding:22px 22px 20px;background:linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.008));border:1px solid rgba(201,169,106,0.26);border-radius:14px;transition:transform .16s ease,border-color .16s ease;}
        .wzi-card:hover{transform:translateY(-3px);border-color:rgba(201,169,106,0.6);}
        .wzi-name{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:26px;line-height:1.1;background:linear-gradient(102deg,#7fe0ff 0%,#a7b6ff 34%,#cda6ff 62%,#ff9ed0 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
        .wzi-role{font-size:10.5px;letter-spacing:2.5px;color:#aeb6d8;}
        .wzi-open{font-weight:500;font-size:10.5px;letter-spacing:2px;color:#c9a96a;margin-top:6px;}
        @media (max-width:680px){.wzi-title{font-size:40px;}}
      `}</style>
      <div className="wzi-wrap">
        <div className="wzi-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/wizard-hackathon/assets/crest.png" alt="" className="wzi-crest" />
          <div className="wzi-eyebrow">WIZARD HACKATHON 2026 · GUESTS</div>
          <div className="wzi-title">The people of the forge</div>
        </div>
        {GROUP_ORDER.map(({ role, label }) => {
          const people = GUESTS.filter((g) => g.role === role);
          if (people.length === 0) return null;
          return (
            <div key={role} className="wzi-group">
              <div className="wzi-group-label">{label}</div>
              <div className="wzi-grid">
                {people.map((g) => (
                  <Link key={g.slug} href={`/wizard-hackathon/${g.slug}`} className="wzi-card">
                    <div className="wzi-name">{g.name}</div>
                    <div className="wzi-role">{g.roleLabel}</div>
                    <div className="wzi-open">OPEN INVITATION →</div>
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
