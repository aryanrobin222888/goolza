import Link from "next/link";
import connectDB from "@/lib/db";
import SiteArticle from "@/models/SiteArticle";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "أخبار ومقالات كرة القدم | Goolza",
  description:
    "تابع أحدث أخبار وتحليلات كرة القدم والدوريات الكبرى على موقع جولزا. تغطية شاملة وحصرية لأهم مباريات وأخبار الملاعب العالمية والمحلية.",
  alternates: { canonical: "https://goolza.com/news" },
  openGraph: {
    title: "أخبار كرة القدم | Goolza",
    description:
      "أحدث أخبار وتحليلات كرة القدم على جولزا. تغطية حصرية وشاملة لأهم البطولات والمباريات.",
    url: "https://goolza.com/news",
    type: "website",
  },
};

const TAG_COLORS = [
  "#10b981", "#38bdf8", "#fbbf24", "#ec4899",
  "#8b5cf6", "#f43f5e", "#06b6d4", "#84cc16",
];

function tagColor(i) {
  return TAG_COLORS[i % TAG_COLORS.length];
}

async function getArticles() {
  try {
    await connectDB();
    const articles = await SiteArticle.find({ site: "goolza", status: "PUBLISHED" })
      .sort({ publishedAt: -1 })
      .limit(24)
      .select("title slug excerpt imageUrl imageAlt tags author publishedAt")
      .lean();
    return articles;
  } catch {
    return [];
  }
}

export default async function GoolzaNewsPage() {
  const articles = await getArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أخبار كرة القدم | Goolza",
    description: "أحدث أخبار وتحليلات كرة القدم على موقع جولزا",
    url: "https://goolza.com/news",
    publisher: {
      "@type": "Organization",
      name: "Goolza",
      url: "https://goolza.com",
    },
  };

  return (
    <div className="w-full min-h-screen bg-[#020617] overflow-hidden">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Page Hero ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(16,185,129,0.07) 0%, transparent 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.3) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-14 pb-10">
          <p className="text-xs font-bold text-slate-600 mb-4 flex items-center gap-2" dir="rtl">
            <Link href="/" className="hover:text-slate-400 transition-colors">الرئيسية</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="text-slate-400">أخبار كرة القدم</span>
          </p>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight" dir="rtl">
            آخر{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #10b981, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              أخبار كرة القدم
            </span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl" dir="rtl">
            تحليلات وأخبار حصرية من عالم كرة القدم — الدوريات الكبرى، المنتخبات، والبطولات العالمية.
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #020617)" }}
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
              style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <span className="text-2xl">📰</span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-white mb-2">في انتظار المقالات</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">ستظهر مقالات وتحليلات كرة القدم قريباً.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => {
              const date = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              const tag = article.tags?.[0] || "كرة القدم";
              const color = tagColor(i);

              return (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
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
                        style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
                      >
                        <span className="text-5xl opacity-30">⚽</span>
                      </div>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, #020617 0%, rgba(2,6,23,0.4) 50%, transparent 100%)" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 relative z-20 -mt-16">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 inline-block"
                      style={{ color, border: `1px solid ${color}40`, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                    >
                      {tag}
                    </span>
                    <h2 className="text-white text-base font-bold leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[11px] text-slate-600">{date}</span>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        اقرأ المزيد
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
