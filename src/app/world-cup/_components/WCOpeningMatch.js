"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function Unit({ v, l }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl lg:text-3xl font-black tabular-nums"
            style={{ background: "linear-gradient(180deg, #34d399, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {v}
      </span>
      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{l}</span>
    </div>
  );
}

export default function WCOpeningMatch() {
  const [t, setT] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-06-11T16:00:00Z").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff < 0) return setT({ d: "00", h: "00", m: "00", s: "00" });
      setT({
        d: Math.floor(diff / 86400000).toString().padStart(2, "0"),
        h: Math.floor((diff % 86400000) / 3600000).toString().padStart(2, "0"),
        m: Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0"),
        s: Math.floor((diff % 60000) / 1000).toString().padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full rounded-2xl overflow-hidden flex flex-col"
         style={{
           background: "linear-gradient(135deg, #040d1a 0%, #03080f 100%)",
           border: "1px solid rgba(34, 211, 238, 0.12)",
           boxShadow: "0 0 60px rgba(34,211,238,0.05), inset 0 1px 0 rgba(255,255,255,0.04)"
         }}>

      {/* Corner glow */}
      <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)" }} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"/>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"/>
          </span>
          <span className="text-[11px] font-black text-cyan-300 uppercase tracking-[3px]">المباراة الافتتاحية</span>
        </div>
        <span className="text-[11px] font-bold text-slate-500">11 يونيو 2026</span>
      </div>

      {/* Teams */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-6 gap-5">

        <div className="flex items-center justify-between w-full gap-4">
          {/* Mexico */}
          <div className="flex flex-col items-center gap-2.5 flex-1">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-xl ring-2 ring-white/10"
                 style={{ boxShadow: "0 0 25px rgba(16,185,129,0.2)" }}>
              <img src="https://flagcdn.com/w160/mx.png" alt="Mexico" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-black text-white">المكسيك</span>
          </div>

          {/* VS Divider */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs"
                 style={{
                   background: "rgba(34,211,238,0.08)",
                   border: "1px solid rgba(34,211,238,0.2)",
                   color: "#22d3ee"
                 }}>
              ضد
            </div>
            <span className="text-[10px] text-slate-600 font-bold">20:00</span>
          </div>

          {/* South Africa */}
          <div className="flex flex-col items-center gap-2.5 flex-1">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-xl ring-2 ring-white/10"
                 style={{ boxShadow: "0 0 25px rgba(16,185,129,0.2)" }}>
              <img src="https://flagcdn.com/w160/za.png" alt="South Africa" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-black text-white">جنوب أفريقيا</span>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-400"
             style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ملعب أزتيكا — مكسيكو سيتي
        </div>
      </div>

      {/* Countdown */}
      <div className="relative z-10 border-t border-white/[0.04] px-5 py-4">
        <div className="flex items-end justify-center gap-3" dir="ltr">
          <Unit v={mounted ? t.d : "--"} l="يوم" />
          <span className="text-emerald-400/30 text-lg pb-4 font-thin">:</span>
          <Unit v={mounted ? t.h : "--"} l="ساعة" />
          <span className="text-emerald-400/30 text-lg pb-4 font-thin">:</span>
          <Unit v={mounted ? t.m : "--"} l="دقيقة" />
          <span className="text-emerald-400/30 text-lg pb-4 font-thin">:</span>
          <Unit v={mounted ? t.s : "--"} l="ثانية" />
        </div>
      </div>

      {/* Host flags */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 border-t border-white/[0.04]">
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">الاستضافة</span>
        <div className="flex items-center gap-1.5">
          {["us","ca","mx"].map(c => (
            <img key={c} src={`https://flagcdn.com/w40/${c}.png`} className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10" alt={c}/>
          ))}
        </div>
      </div>
    </div>
  );
}
