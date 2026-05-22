"use client";
import React from 'react';

const NATIONS = [
  { iso: "ma", name: "المغرب" }, { iso: "mx", name: "المكسيك" }, { iso: "za", name: "جنوب أفريقيا" },
  { iso: "kr", name: "كوريا" }, { iso: "ca", name: "كندا" }, { iso: "br", name: "البرازيل" },
  { iso: "us", name: "أمريكا" }, { iso: "de", name: "ألمانيا" }, { iso: "fr", name: "فرنسا" },
  { iso: "es", name: "إسبانيا" }, { iso: "ar", name: "الأرجنتين" }, { iso: "pt", name: "البرتغال" },
  { iso: "nl", name: "هولندا" }, { iso: "gb-eng", name: "إنجلترا" }, { iso: "it", name: "إيطاليا" },
  { iso: "jp", name: "اليابان" }, { iso: "be", name: "بلجيكا" }, { iso: "hr", name: "كرواتيا" },
  { iso: "sn", name: "السنغال" }, { iso: "eg", name: "مصر" }, { iso: "dz", name: "الجزائر" },
  { iso: "sa", name: "السعودية" }, { iso: "ng", name: "نيجيريا" }, { iso: "tr", name: "تركيا" },
  { iso: "pl", name: "بولندا" }, { iso: "pt", name: "البرتغال" }, { iso: "ch", name: "سويسرا" },
  { iso: "dk", name: "الدنمارك" }, { iso: "se", name: "السويد" }, { iso: "au", name: "أستراليا" },
];

export default function NationsMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-7 select-none"
         style={{
           background: "linear-gradient(90deg, rgba(16,185,129,0.03) 0%, rgba(34,211,238,0.06) 50%, rgba(16,185,129,0.03) 100%)",
           borderTop: "1px solid rgba(255,255,255,0.04)",
           borderBottom: "1px solid rgba(255,255,255,0.04)"
         }}>

      {/* Edge fades */}
      <div className="absolute inset-y-0 right-0 w-24 md:w-40 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to left, #020617 0%, transparent 100%)" }}/>
      <div className="absolute inset-y-0 left-0 w-24 md:w-40 z-10 pointer-events-none"
           style={{ background: "linear-gradient(to right, #020617 0%, transparent 100%)" }}/>

      {/* Marquee track */}
      <div className="flex w-max gap-5 px-4 nations-marquee" dir="ltr">
        {[...NATIONS, ...NATIONS].map((n, i) => (
          <div key={i}
               className="nations-flag-item flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
               style={{ width: "56px" }}>
            <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/10 transition-all duration-300 group-hover:ring-2 group-hover:ring-emerald-400 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]"
                 style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.4)" }}>
              <img
                src={`https://flagcdn.com/w80/${n.iso}.png`}
                alt={n.name}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable="false"
              />
            </div>
            <span className="text-[9px] font-bold text-slate-600 group-hover:text-slate-300 transition-colors whitespace-nowrap overflow-hidden max-w-full text-center">
              {n.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes nations-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .nations-marquee {
          animation: nations-scroll 55s linear infinite;
          will-change: transform;
        }
        .nations-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
