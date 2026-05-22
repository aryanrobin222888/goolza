import Link from "next/link";
import connectDB from "@/lib/db";

export const dynamic = "force-dynamic";
import WCArticle from "@/models/WCArticle";
import WCHeroBanner from "./_components/WCHeroBanner";
import WCSlider from "./_components/WCSlider";
import WCOpeningMatch from "./_components/WCOpeningMatch";
import NationsMarquee from "./_components/NationsMarquee";
import WorldCupMatchesList from "./_components/WorldCupMatchesList";

async function getArticles() {
  try {
    await connectDB();
    const articles = await WCArticle.find({ status: "PUBLISHED" })
      .sort({ publishedAt: -1 })
      .limit(4)
      .select("title slug excerpt imageUrl imageAlt tags author publishedAt")
      .lean();
    return articles.map(a => ({
      ...a,
      _id: a._id.toString(),
      publishedAt: a.publishedAt.toISOString()
    }));
  } catch {
    return [];
  }
}

const QUICK_STATS = [
  { label: "منتخباً مشاركاً", value: "48", accent: "#34d399", icon: "👥" },
  { label: "مباراة رسمية", value: "104", accent: "#22d3ee", icon: "⚽" },
  { label: "ملعباً في 3 دول", value: "16", accent: "#fbbf24", icon: "🏟️" },
  { label: "يوم من الإثارة", value: "39", accent: "#f472b6", icon: "📅" },
];

const WC_LINKS = [
  { href: "/world-cup/matches", label: "جدول المباريات", icon: "📋", desc: "كل مباريات المجموعات والأدوار الإقصائية" },
  { href: "/world-cup/groups", label: "المجموعات", icon: "🗂️", desc: "ترتيب المجموعات الاثنا عشر" },
  { href: "/world-cup/stats", label: "الإحصائيات", icon: "📊", desc: "أهداف، تمريرات، أفضل اللاعبين" },
  { href: "/world-cup/news", label: "آخر الأخبار", icon: "📰", desc: "تحليلات وأخبار حصرية" },
];

export default async function WorldCupHub() {
  const articles = await getArticles();

  return (
    <div className="w-full overflow-x-hidden bg-[#020617]">

      {/* ═══ HERO BANNER ═══ */}
      <WCHeroBanner />

      {/* ═══ QUICK STATS BAR ═══ */}
      <div className="w-full border-y border-white/[0.04]"
           style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center group">
              <div className="text-2xl mb-0.5">{s.icon}</div>
              <span className="text-2xl md:text-3xl font-black tabular-nums transition-transform group-hover:scale-110"
                    style={{ color: s.accent, textShadow: `0 0 20px ${s.accent}60` }}>
                {s.value}
              </span>
              <span className="text-[11px] text-slate-500 font-bold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ NATIONS MARQUEE ═══ */}
      <NationsMarquee />

      {/* ═══ MAIN CONTENT GRID ═══ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-14">

        {/* --- Row 1: Slider + Opening Match --- */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(to bottom, #34d399, #22d3ee)" }}/>
            <h2 className="text-lg font-black text-white">أبرز ما يدور حول البطولة</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <WCSlider articles={articles} />
            </div>
            <div className="lg:col-span-5">
              <WCOpeningMatch />
            </div>
          </div>
        </div>

        {/* --- Row 2: Quick Navigation Cards --- */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(to bottom, #22d3ee, #818cf8)" }}/>
            <h2 className="text-lg font-black text-white">استكشف البطولة</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WC_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                    className="group flex flex-col gap-3 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                <div className="text-2xl">{l.icon}</div>
                <div>
                  <p className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors">{l.label}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed hidden sm:block">{l.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold group-hover:text-cyan-300 transition-colors mt-auto">
                  <span>اكتشف</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* --- Row 3: Match List --- */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(to bottom, #fbbf24, #f472b6)" }}/>
            <h2 className="text-lg font-black text-white">جدول المباريات</h2>
          </div>
          <WorldCupMatchesList
            tournamentId={16}
            seasonId={58210}
          />
        </div>

      </div>

    </div>
  );
}
