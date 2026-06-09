import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import SiteArticle from "@/models/SiteArticle";

export const dynamic = "force-dynamic";

// ── Keyword auto-linking ──────────────────────────────────────────────────────
const KEYWORD_LINKS = [
  { keyword: "مباريات اليوم",       href: "/",            linkAlways: true },
  { keyword: "نتائج المباريات",     href: "/matches-today", linkAlways: true },
  { keyword: "أخبار كرة القدم",     href: "/news",          linkAlways: true },
  { keyword: "آخر الأخبار",         href: "/news",          linkAlways: true },
  { keyword: "الصفحة الرئيسية",     href: "/",             linkAlways: false },
  { keyword: "دوري الأبطال",        href: "/",             linkAlways: false },
];

function parseInline(text, usedKeywords = new Set()) {
  const segments = [];
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    if (match[1] !== undefined) segments.push({ type: "bold", content: match[1] });
    else segments.push({ type: "link", content: match[2], href: match[3] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", content: text.slice(lastIndex) });

  const result = [];
  for (const seg of segments) {
    if (seg.type !== "text") { result.push(seg); continue; }
    let currentSegments = [seg];
    for (const { keyword, href, linkAlways } of KEYWORD_LINKS) {
      if (!linkAlways && usedKeywords.has(keyword)) continue;
      const nextSegments = [];
      for (const cur of currentSegments) {
        if (cur.type !== "text") { nextSegments.push(cur); continue; }
        let remaining = cur.content;
        let matchIdx = remaining.indexOf(keyword);
        while (matchIdx !== -1) {
          if (!linkAlways && usedKeywords.has(keyword)) break;
          if (matchIdx > 0) nextSegments.push({ type: "text", content: remaining.slice(0, matchIdx) });
          nextSegments.push({ type: "autolink", content: keyword, href });
          usedKeywords.add(keyword);
          remaining = remaining.slice(matchIdx + keyword.length);
          matchIdx = remaining.indexOf(keyword);
          if (!linkAlways) break;
        }
        if (remaining.length > 0) nextSegments.push({ type: "text", content: remaining });
      }
      currentSegments = nextSegments;
    }
    result.push(...currentSegments);
  }
  return result;
}

function InlineContent({ segments }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "bold") return <strong key={i} className="font-bold text-white">{seg.content}</strong>;
        if (seg.type === "link") return <Link key={i} href={seg.href} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">{seg.content}</Link>;
        if (seg.type === "autolink") return <Link key={i} href={seg.href} className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">{seg.content}</Link>;
        return <span key={i}>{seg.content}</span>;
      })}
    </>
  );
}

function MarkdownContent({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  const usedKeywords = new Set();
  return (
    <div className="prose-goolza" dir="rtl">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return (
          <h2 key={i} className="text-2xl font-black text-white mb-3 mt-10 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <InlineContent segments={parseInline(line.slice(3), usedKeywords)} />
          </h2>
        );
        if (line.startsWith("### ")) return (
          <h3 key={i} className="text-xl font-bold text-emerald-300 mb-2 mt-7">
            <InlineContent segments={parseInline(line.slice(4), usedKeywords)} />
          </h3>
        );
        if (line.startsWith("# ")) return (
          <h1 key={i} className="text-3xl font-black text-white mb-4 mt-8">
            <InlineContent segments={parseInline(line.slice(2), usedKeywords)} />
          </h1>
        );
        if (line.startsWith("- ") || line.startsWith("* ")) return (
          <div key={i} className="flex items-start gap-3 mb-2">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-slate-300 leading-relaxed text-[15px]">
              <InlineContent segments={parseInline(line.slice(2), usedKeywords)} />
            </p>
          </div>
        );
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-slate-300 leading-relaxed text-[15px] mb-3">
            <InlineContent segments={parseInline(line, usedKeywords)} />
          </p>
        );
      })}
    </div>
  );
}

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const article = await SiteArticle.findOne({ site: "goolza", slug, status: "PUBLISHED" }).lean();
    if (!article) return { title: "مقال غير موجود | Goolza" };

    const imageUrl = article.imageUrl || `https://goolza.com/api/og?title=${encodeURIComponent(article.title)}`;
    return {
      title: `${article.title} | Goolza`,
      description: article.excerpt,
      alternates: { canonical: `https://goolza.com/news/${article.slug}` },
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: `https://goolza.com/news/${article.slug}`,
        type: "article",
        publishedTime: article.publishedAt,
        authors: [article.author || "Goolza"],
        images: [{ url: imageUrl, width: 1200, height: 630, alt: article.imageAlt || article.title }],
        siteName: "Goolza",
        locale: "ar_AR",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Goolza" };
  }
}

// ── Data ──────────────────────────────────────────────────────────────────────
async function getArticle(slug) {
  await connectDB();
  return SiteArticle.findOne({ site: "goolza", slug, status: "PUBLISHED" }).lean();
}

async function getRelated(slug) {
  return SiteArticle.find({ site: "goolza", slug: { $ne: slug }, status: "PUBLISHED" })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select("title slug excerpt imageUrl tags publishedAt")
    .lean();
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function GoolzaArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelated(slug);

  const publishedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric", month: "long", day: "numeric",
  });

  const articleUrl = `https://goolza.com/news/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl || `https://goolza.com/api/og?title=${encodeURIComponent(article.title)}`,
    author: { "@type": "Organization", name: article.author || "Goolza", url: "https://goolza.com" },
    publisher: {
      "@type": "Organization",
      name: "Goolza",
      url: "https://goolza.com",
      logo: { "@type": "ImageObject", url: "https://goolza.com/logo.png" },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: "ar",
    keywords: (article.tags || []).join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://goolza.com" },
      { "@type": "ListItem", position: 2, name: "أخبار كرة القدم", item: "https://goolza.com/news" },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-[#020617]" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-slate-600 font-bold mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-400 transition-colors">الرئيسية</Link>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          <Link href="/news" className="hover:text-slate-400 transition-colors">أخبار كرة القدم</Link>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
          <span className="text-slate-500 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* ── Tags ── */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Title ── */}
        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* ── Excerpt ── */}
        <p className="text-slate-400 text-base leading-relaxed mb-6 border-r-4 pr-4"
           style={{ borderColor: "#10b981" }}>
          {article.excerpt}
        </p>

        {/* ── Meta ── */}
        <div className="flex items-center gap-4 text-xs text-slate-600 mb-8 pb-8"
             style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            {article.author || "Goolza"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {publishedDate}
          </span>
        </div>

        {/* ── Hero Image ── */}
        {article.imageUrl && (
          <div className="mb-10 rounded-2xl overflow-hidden aspect-video w-full"
               style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <img
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* ── Content ── */}
        <article className="mb-16">
          <MarkdownContent content={article.content} />
        </article>

        {/* ── Internal Links CTA ── */}
        <div className="mb-12 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
             style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <div>
            <p className="text-emerald-400 font-black text-sm mb-1">⚽ تابع أحدث المباريات</p>
            <p className="text-slate-400 text-xs">نتائج مباشرة، جداول البطولات، وتحليلات يومية</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/matches-today" className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              مباريات اليوم
            </Link>
            <Link href="/news" className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              المزيد من الأخبار
            </Link>
            <Link href="/" className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 transition-all"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              الرئيسية ←
            </Link>
          </div>
        </div>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-emerald-400 inline-block" />
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/news/${rel.slug}`}
                      className="group rounded-xl overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {rel.imageUrl && (
                    <div className="h-28 overflow-hidden">
                      <img src={rel.imageUrl} alt={rel.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-white text-xs font-bold leading-snug group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {rel.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
