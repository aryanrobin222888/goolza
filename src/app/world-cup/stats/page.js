import { Trophy, Target, Gauge, Flag, Star } from "lucide-react";

export const metadata = { title: "إحصائيات كأس العالم 2026 | يلا شوت" };

export default function StatsPage() {
  return (
    <div className="w-full min-h-screen bg-[#020617] overflow-hidden">
      
      {/* ── Page Hero ── */}
      <div className="relative w-full overflow-hidden"
           style={{ background: "linear-gradient(180deg, rgba(245,158,11,0.06) 0%, transparent 100%)" }}>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}/>

        {/* Top center glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-30 pointer-events-none"
             style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.3) 0%, transparent 70%)" }}/>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">
          <p className="text-xs font-bold text-slate-600 mb-4 flex items-center gap-2" dir="rtl">
            <span>كأس العالم 2026</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-slate-400">الإحصائيات والأرقام</span>
          </p>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight" dir="rtl">
            مركز{" "}
            <span style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              الإحصائيات الشامل
            </span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl" dir="rtl">
            الأهداف، التمريرات الحاسمة، البطاقات، وكل أرقام المونديال القياسية تُحدّث هنا لحظة بلحظة.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
             style={{ background: "linear-gradient(to bottom, transparent, #020617)" }}/>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-32 mt-6" dir="rtl">
        
        {/* Waiting State Card */}
        <div className="w-full relative overflow-hidden rounded-[2rem] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-2xl"
             style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
             
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"/>
             
             <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 relative"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
               <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"/>
               <Gauge className="w-8 h-8 text-amber-500" />
             </div>

             <h2 className="text-2xl md:text-3xl font-black text-white mb-4">في انتظار انطلاق المونديال</h2>
             <p className="text-slate-400 max-w-lg mb-10 leading-relaxed">
               تُفعّل هذه الصفحة تلقائياً مع أول صافرة للمباراة الافتتاحية. سنعرض لك هنا سباق الهدافين، صناع اللعب، الإحصائيات الفردية والجماعية.
             </p>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
                {[
                  { l: "الهدّافين", i: Trophy },
                  { l: "صناعة اللعب", i: Target },
                  { l: "البطاقات", i: Flag },
                  { l: "رجل المباراة", i: Star },
                ].map((item, idx) => {
                  const Icon = item.i;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-white/5 bg-black/20">
                      <Icon className="w-6 h-6 text-slate-600" />
                      <span className="text-xs font-bold text-slate-500">{item.l}</span>
                    </div>
                  )
                })}
             </div>
        </div>

      </div>
    </div>
  );
}
