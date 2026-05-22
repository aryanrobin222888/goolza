import WorldCupGroups from "../_components/WorldCupGroups";

export const metadata = {
  title: "مجموعات كأس العالم 2026 | يلا شوت",
  description: "جدول ترتيب مجموعات كأس العالم 2026 بالتفصيل. تابع نقاط المنتخبات، أهداف المواجهات، ترتيب المجموعات الـ 12، ومراكز التأهل للدور المقبل لحظة بلحظة على يلا شوت.",
};

export default function GroupsPage() {
  return (
    <div className="w-full min-h-screen bg-[#020617] overflow-hidden">
      
      {/* ── Page Hero ── */}
      <div className="relative w-full overflow-hidden"
           style={{ background: "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 100%)" }}>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}/>

        {/* Top center glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-30 pointer-events-none"
             style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.3) 0%, transparent 70%)" }}/>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">
          
          {/* Breadcrumb */}
          <p className="text-xs font-bold text-slate-600 mb-4 flex items-center gap-2" dir="rtl">
            <span>كأس العالم 2026</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-slate-400">المجموعات</span>
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight" dir="rtl">
            ترتيب{" "}
            <span style={{
              background: "linear-gradient(135deg, #10b981, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              المجموعات الـ 12
            </span>
          </h1>
          <p className="text-sm text-slate-500 mb-6 max-w-xl" dir="rtl">
            تنافس 48 منتخباً للمرة الأولى في تاريخ المونديال، موزعين على 12 مجموعة. يتأهل الأول والثاني من كل مجموعة إلى جانب أفضل 8 ثوالث.
          </p>

          {/* Rule Cards */}
          <div className="flex flex-wrap items-center gap-3" dir="rtl">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300"
                 style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}>
              <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>
              <span className="text-slate-300">المركز الأول والثاني (مؤهل مباشر)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300"
                 style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.1)" }}>
              <span className="w-2.5 h-2.5 rounded bg-amber-400"></span>
              <span className="text-slate-300">أفضل 8 ثوالث (مؤهل)</span>
            </div>
          </div>

        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
             style={{ background: "linear-gradient(to bottom, transparent, #020617)" }}/>
      </div>

      <WorldCupGroups />
    </div>
  );
}
