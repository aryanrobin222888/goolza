"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 6,
  opacity: Math.random() * 0.5 + 0.1,
}));

function CountdownUnit({ value, label }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  return (
    <div className="wc-timer-unit flex flex-col items-center gap-1">
      <div className="wc-timer-box relative w-[52px] h-[56px] sm:w-[64px] sm:h-[68px] rounded-xl overflow-hidden flex items-center justify-center" 
           style={{
             background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)",
             border: "1px solid rgba(16,185,129,0.25)",
             boxShadow: "0 0 20px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
           }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        <span className="text-2xl sm:text-3xl font-black tabular-nums" 
              style={{ background: "linear-gradient(180deg, #34d399 0%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {mounted ? value : "--"}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function WCHeroBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date("2026-06-11T16:00:00Z").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff < 0) return setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      const d = Math.floor(diff / 86400000).toString().padStart(2, "0");
      const h = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "480px" }}>
      
      {/* ── Deep Space Background ── */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.06) 30%, #020617 70%)"
      }}/>
      
      {/* ── Pitch grid overlay ── */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }}/>
      
      {/* ── Radial center spotlight ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
           style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.5) 0%, transparent 70%)" }}/>

      {/* ── Floating particles ── */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full wc-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.id % 3 === 0 ? "#34d399" : p.id % 3 === 1 ? "#22d3ee" : "#fbbf24",
                opacity: p.opacity,
                animation: `wcFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-12 flex flex-col items-center text-center">
        
        {/* Top badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 text-xs font-bold uppercase tracking-[3px]"
             style={{ 
               background: "rgba(16,185,129,0.08)", 
               border: "1px solid rgba(16,185,129,0.3)",
               color: "#34d399",
               boxShadow: "0 0 20px rgba(16,185,129,0.1)"
             }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          FIFA World Cup™
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        
        {/* Giant Title */}
        <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] mb-4 select-none" dir="rtl"
            style={{ fontFamily: "var(--font-cairo)" }}>
          <span className="block text-white/10 text-lg sm:text-xl md:text-2xl font-bold tracking-[8px] uppercase mb-3 wc-subtitle">
            كأس العالم
          </span>
          <span className="wc-hero-text" style={{
            background: "linear-gradient(135deg, #ffffff 0%, #34d399 40%, #22d3ee 70%, #ffffff 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "wcGradientShift 4s ease infinite",
          }}>
            2026
          </span>
        </h1>
        
        {/* Host nations */}
        <div className="flex items-center gap-2 mt-4 mb-8">
          <div className="flex items-center gap-1.5">
            <img src="https://flagcdn.com/w40/us.png" className="w-6 h-6 rounded-full object-cover shadow-lg" alt="USA"/>
            <span className="text-xs font-bold text-slate-300">أمريكا</span>
          </div>
          <span className="text-white/20 font-light">·</span>
          <div className="flex items-center gap-1.5">
            <img src="https://flagcdn.com/w40/ca.png" className="w-6 h-6 rounded-full object-cover shadow-lg" alt="Canada"/>
            <span className="text-xs font-bold text-slate-300">كندا</span>
          </div>
          <span className="text-white/20 font-light">·</span>
          <div className="flex items-center gap-1.5">
            <img src="https://flagcdn.com/w40/mx.png" className="w-6 h-6 rounded-full object-cover shadow-lg" alt="Mexico"/>
            <span className="text-xs font-bold text-slate-300">المكسيك</span>
          </div>
        </div>

        {/* Tournament stats line */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">48</span>
            <span>منتخباً</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">104</span>
            <span>مباراة</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">16</span>
            <span>ملعباً</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-rose-400">39</span>
            <span>يوماً من الإثارة</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[4px]">الوقت المتبقي للانطلاق</p>
          <div className="flex items-end gap-2 sm:gap-3" dir="ltr">
            <CountdownUnit value={timeLeft.days} label="يوم" />
            <span className="text-emerald-400/40 text-xl mb-3 font-thin">:</span>
            <CountdownUnit value={timeLeft.hours} label="ساعة" />
            <span className="text-emerald-400/40 text-xl mb-3 font-thin">:</span>
            <CountdownUnit value={timeLeft.minutes} label="دقيقة" />
            <span className="text-emerald-400/40 text-xl mb-3 font-thin">:</span>
            <CountdownUnit value={timeLeft.seconds} label="ثانية" />
          </div>
        </div>

        {/* CTA Link */}
        <Link href="/world-cup/matches" className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group/cta"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%)",
                border: "1px solid rgba(16,185,129,0.4)",
                color: "#34d399",
                boxShadow: "0 0 30px rgba(16,185,129,0.1)",
              }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          جدول المباريات الكامل
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/cta:-translate-x-1 transition-transform duration-300"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
           style={{ background: "linear-gradient(to bottom, transparent, #020617)" }}/>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes wcFloat {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-20px) translateX(8px); }
        }
        @keyframes wcGradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
