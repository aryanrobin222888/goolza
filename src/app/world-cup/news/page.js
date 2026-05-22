import Link from "next/link";
import connectDB from "@/lib/db";
import WCArticle from "@/models/WCArticle";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "أخبار ومقالات كأس العالم 2026 | يلا شوت",
  description:
    "تابع أحدث أخبار وتحليلات كأس العالم 2026 في المكسيك وكندا وأمريكا. تغطية إعلامية شاملة وحصرية على يلا شوت لمقالات المونديال، تصريحات اللاعبين، وتقارير المنتخبات.",
  alternates: {
    canonical: "https://goolza.com/world-cup/news",
  },
  openGraph: {
    title: "أخبار كأس العالم 2026 | يلا شوت",
    description:
      "أحدث أخبار وتحليلات كأس العالم 2026. تغطية حصرية وشاملة من يلا شوت لمقالات وتصريحات المنتخبات المشاركة في المونديال لحظة بلحظة وبدون تقطيع.",
    url: "https://goolza.com/world-cup/news",
    type: "website",
  },
};

const TAG_COLORS = [
  "#10b981",
  "#38bdf8",
  "#fbbf24",
  "#ec4899",
  "#8b5cf6",
  "#f43f5e",
  "#06b6d4",
  "#84cc16",
];

function tagColor(i) {
  return TAG_COLORS[i % TAG_COLORS.length];
}

async function getArticles() {
  try {
    await connectDB();
    const articles = await WCArticle.find({ status: "PUBLISHED" })
      .sort({ publishedAt: -1 })
      .limit(24)
      .select("title slug excerpt imageUrl imageAlt tags author publishedAt")
      .lean();
    return articles;
  } catch {
    return [];
  }
}

export default async function NewsPage() {
  const articles = await getArticles();

  return (
    <div className="w-full min-h-screen bg-[#020617] overflow-hidden">
      {/* ── Page Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(56,189,248,0.06) 0%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(56,189,248,0.3) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">
          <p
            className="text-xs font-bold text-slate-600 mb-4 flex items-center gap-2"
            dir="rtl"
          >
            <Link
              href="/world-cup"
              className="hover:text-slate-400 transition-colors"
            >
              كأس العالم 2026
            </Link>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-slate-400">المركز الإعلامي</span>
          </p>

          <h1
            className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight"
            dir="rtl"
          >
            تغطية{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              إعلامية شاملة
            </span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl" dir="rtl">
            أحدث الأخبار، التقارير الحصرية، والتحليلات الخاصة ببطولة كأس العالم
            الأكبر في تاريخ الساحرة المستديرة.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #020617)",
          }}
        />
      </div>

      {/* ── Articles Grid ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24 mt-6" dir="rtl">
        {articles.length === 0 ? (
          <div
            className="py-24 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-5"
            style={{ background: "rgba(255,255,255,0.015)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(56,189,248,0.05)",
                border: "1px solid rgba(56,189,248,0.2)",
              }}
            >
              <span className="text-2xl">📰</span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-white mb-2">
                في انتظار المقالات
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                ستظهر مقالات وتحليلات كأس العالم 2026 قريباً.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => {
              const date = new Date(article.publishedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              );
              const tag = article.tags?.[0] || "كأس العالم 2026";
              const color = tagColor(i);

              return (
                <Link
                  key={article.slug}
                  href={`/world-cup/news/${article.slug}`}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer block"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Image */}
                  <div className="h-[220px] overflow-hidden relative">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #0f172a, #1e293b)",
                        }}
                      >
                        <span className="text-5xl opacity-30">🏆</span>
                      </div>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #020617 0%, rgba(2,6,23,0.4) 50%, transparent 100%)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 relative z-20 -mt-16">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 inline-block"
                      style={{
                        color,
                        border: `1px solid ${color}40`,
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {tag}
                    </span>
                    <h2 className="text-white text-base font-bold leading-snug group-hover:text-sky-300 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[11px] text-slate-600">{date}</span>
                      <span className="text-xs text-sky-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        اقرأ المزيد
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
