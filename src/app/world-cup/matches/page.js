import WorldCupMatchesList from "../_components/WorldCupMatchesList";

export const metadata = {
  title: "مباريات كأس العالم 2026 | جدول شامل | يلا شوت",
  description: "جدول مواعيد مباريات كأس العالم 2026 كاملاً مع التوقيت والقنوات الناقلة. تابع نتائج مباريات اليوم في المونديال، بث مباشر للأدوار الإقصائية والنهائي على يلا شوت."
};

const STATS = [
  { label: "التواريخ", value: "11 يونيو — 19 يوليو", icon: "📅", accent: "#22d3ee" },
  { label: "الاستضافة", flags: ["us","ca","mx"], accent: "#34d399" },
  { label: "البطل الحالي", value: "الأرجنتين 🇦🇷", accent: "#fbbf24" },
  { label: "الأكثر تتويجاً", value: "البرازيل 🏆×5", accent: "#f472b6" },
];

export default function MatchesPage() {
  return (
    <div className="w-full min-h-screen bg-[#020617] overflow-hidden">

      {/* ── Page Hero ── */}
      <div className="relative w-full overflow-hidden"
           style={{ background: "linear-gradient(180deg, rgba(34,211,238,0.06) 0%, transparent 100%)" }}>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}/>

        {/* Top center glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-30 pointer-events-none"
             style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.4) 0%, transparent 70%)" }}/>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">

          {/* Breadcrumb */}
          <p className="text-xs font-bold text-slate-600 mb-4 flex items-center gap-2" dir="rtl">
            <span>كأس العالم 2026</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-slate-400">جدول المباريات</span>
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight" dir="rtl">
            جدول{" "}
            <span style={{
              background: "linear-gradient(135deg, #22d3ee, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              المباريات الكامل
            </span>
          </h1>
          <p className="text-sm text-slate-500 mb-10 max-w-xl" dir="rtl">
            104 مباراة، 48 منتخباً، 3 دول مستضيفة — كل التفاصيل في مكان واحد
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" dir="rtl">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                   style={{
                     background: "rgba(255,255,255,0.025)",
                     border: "1px solid rgba(255,255,255,0.06)",
                   }}>
                <span className="text-[10px] font-black uppercase tracking-[2px]" style={{ color: s.accent }}>{s.label}</span>
                {s.flags ? (
                  <div className="flex items-center gap-1.5">
                    {s.flags.map(f => (
                      <img key={f} src={`https://flagcdn.com/w40/${f}.png`} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10" alt={f}/>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm font-bold text-white">{s.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-6" dir="rtl">
            {[
              { v: "48", l: "منتخباً", c: "#22d3ee" },
              { v: "104", l: "مباراة", c: "#34d399" },
              { v: "16", l: "ملعباً", c: "#fbbf24" },
              { v: "39", l: "يوماً", c: "#f472b6" },
            ].map(p => (
              <div key={p.l} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
                   style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                <span className="font-black" style={{ color: p.c }}>{p.v}</span>
                {p.l}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
             style={{ background: "linear-gradient(to bottom, transparent, #020617)" }}/>
      </div>

      {/* ── Match List ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <WorldCupMatchesList tournamentId={16} seasonId={58210} />
      </div>

    </div>
  );
}
