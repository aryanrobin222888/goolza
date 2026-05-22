"use client";
import { useState, useEffect } from "react";

export default function OpeningMatchCard() {
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // World Cup 2026 Starts: June 11, 2026
    const targetDate = new Date("2026-06-11T16:00:00Z").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const TimerUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="w-[60px] h-[64px] sm:w-[72px] sm:h-[76px] bg-slate-950/60 rounded-[14px] border border-[#22d3ee]/20 flex items-center justify-center backdrop-blur-xl shadow-[0_0_15px_rgba(34,211,238,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-[#22d3ee]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent"></div>
        {mounted ? (
          <span className="text-3xl sm:text-4xl font-black text-[#22d3ee]" style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "1px" }}>
            {value}
          </span>
        ) : (
          <span className="text-3xl sm:text-4xl font-bold text-[#22d3ee]/30">--</span>
        )}
      </div>
      <span className="text-slate-400 text-xs sm:text-sm font-bold mt-2.5 tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="w-full h-full min-h-[450px] lg:h-[500px] rounded-[1.5rem] relative overflow-hidden group bg-[#060b19] border border-white/5 flex flex-col justify-between p-6 sm:p-8">
      {/* Background Lighting Effects */}
      <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-[#22d3ee]/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      {/* Grid Pattern Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
        
        {/* Header Tags */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22d3ee]"></span>
            </span>
            <span className="text-[#22d3ee] text-sm font-bold uppercase tracking-widest bg-[#22d3ee]/10 px-3 py-1 rounded-full border border-[#22d3ee]/20">
              المباراة الافتتاحية
            </span>
          </div>
          <h3 className="text-white/90 text-base font-medium">11 يونيو 2026</h3>
        </div>

        {/* Matchup Layout */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 w-full my-4">
          {/* Mexico */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.15)] bg-slate-900 group-hover:scale-105 transition-transform duration-500">
               <img src="https://flagcdn.com/w160/mx.png" alt="Mexico" className="w-full h-full object-cover" />
             </div>
             <span className="text-white font-black text-lg sm:text-xl shrink-0">المكسيك</span>
          </div>

          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-700 italic">
              VS
            </span>
          </div>

          {/* South Africa */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-slate-900 group-hover:scale-105 transition-transform duration-500">
               <img src="https://flagcdn.com/w160/za.png" alt="South Africa" className="w-full h-full object-cover" />
             </div>
             <span className="text-white font-black text-lg sm:text-xl shrink-0">جنوب أفريقيا</span>
          </div>
        </div>

        {/* Venue Information */}
        <div className="text-center w-full mb-8 mt-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span className="text-slate-300 text-sm font-semibold">ملعب أزتيكا — مكسيكو سيتي</span>
          </div>
        </div>

        {/* Precise Countdown Segment */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full" dir="ltr">
          <TimerUnit value={timeLeft.days} label="يوم" />
          <span className="text-2xl text-[#22d3ee]/40 pb-6">:</span>
          <TimerUnit value={timeLeft.hours} label="ساعة" />
          <span className="text-2xl text-[#22d3ee]/40 pb-6">:</span>
          <TimerUnit value={timeLeft.minutes} label="دقيقة" />
          <span className="text-2xl text-[#22d3ee]/40 pb-6">:</span>
          <TimerUnit value={timeLeft.seconds} label="ثانية" />
        </div>

      </div>

      {/* Floating Host Badges */}
      <div className="absolute top-6 right-6 flex items-center gap-1.5 p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/5 shadow-2xl z-20">
         <div className="text-[10px] font-bold text-white/50 px-2 uppercase tracking-wide">الاستضافة</div>
         <div className="flex items-center gap -ml-1">
           <img src="https://flagcdn.com/w40/mx.png" className="w-5 h-5 rounded-full object-cover border border-white/20 -ml-1.5" alt="Mexico"/>
           <img src="https://flagcdn.com/w40/ca.png" className="w-5 h-5 rounded-full object-cover border border-white/20 -ml-1.5" alt="Canada"/>
           <img src="https://flagcdn.com/w40/us.png" className="w-5 h-5 rounded-full object-cover border border-white/20 -ml-1.5" alt="USA"/>
         </div>
      </div>
    </div>
  );
}
