/**
 * LeagueSEOContent — Server-rendered SEO article section for /league/[slug]
 *
 * Renders:
 *  1. "نبذة عن الدوري" — intro paragraph
 *  2. "نظام المسابقة" — competition system
 *  3. "إحصائيات وأرقام" — highlight stats
 *  4. FAQ accordion (server-side, no interaction needed — crawlable by Google)
 *
 * The parent page.js injects the FAQPage JSON-LD schema separately.
 */
export default function LeagueSEOContent({ tournament }) {
  const seo = tournament?.seo;
  if (!seo) return null;

  const sections = [
    {
      id: "about",
      title: `نبذة عن ${tournament.nameAr}`,
      body: seo.about,
      icon: "🏆",
    },
    {
      id: "system",
      title: "نظام المسابقة والتأهل الأوروبي",
      body: seo.system,
      icon: "📋",
    },
    {
      id: "stats",
      title: "إحصائيات وأرقام",
      body: seo.stats,
      icon: "📊",
    },
  ];

  return (
    <section
      className="mt-12 pt-8 border-t border-slate-800/50 space-y-8"
      dir="rtl"
      aria-label={`محتوى SEO — ${tournament.nameAr}`}
    >
      {/* Info blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors duration-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl leading-none">{sec.icon}</span>
              <h2 className="text-sm font-bold text-[#ff7a00]">{sec.title}</h2>
            </div>
            <p className="text-sm text-slate-400 leading-[1.9]">{sec.body}</p>
          </div>
        ))}
      </div>

      {/* FAQ — fully server-rendered, no JS needed, Google can crawl it */}
      {seo.faq?.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <span className="text-lg">❓</span>
            <h2 className="text-sm font-bold text-white">
              الأسئلة الشائعة — {tournament.nameAr}
            </h2>
          </div>
          <dl className="divide-y divide-slate-800/60">
            {seo.faq.map((item, idx) => (
              <div key={idx} className="px-6 py-4 hover:bg-slate-800/30 transition-colors duration-150">
                <dt className="text-sm font-bold text-slate-200 mb-1.5 leading-snug">
                  {item.q}
                </dt>
                <dd className="text-sm text-slate-400 leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}
