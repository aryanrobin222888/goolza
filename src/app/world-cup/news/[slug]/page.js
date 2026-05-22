import Link from "next/link";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import WCArticle from "@/models/WCArticle";

export const dynamic = "force-dynamic";

// ── SEO: generateMetadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const article = await WCArticle.findOne({
      slug,
      status: "PUBLISHED",
    }).lean();

    if (!article) {
      return { title: "مقال غير موجود | يلا شوت" };
    }

    const imageUrl =
      article.imageUrl ||
      `https://goolza.com/api/og?title=${encodeURIComponent(article.title)}`;

    return {
      title: `${article.title} | يلا شوت`,
      description: article.excerpt,
      alternates: {
        canonical: `https://goolza.com/world-cup/news/${article.slug}`,
      },
      openGraph: {
        title: article.title,
        description: article.excerpt,
        url: `https://goolza.com/world-cup/news/${article.slug}`,
        type: "article",
        publishedTime: article.publishedAt,
        authors: [article.author || "يلا شوت"],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.imageAlt || article.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.excerpt,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "يلا شوت" };
  }
}

// ── Data Fetching ─────────────────────────────────────────────────────────────
async function getArticle(slug) {
  await connectDB();
  return WCArticle.findOne({ slug, status: "PUBLISHED" }).lean();
}

async function getRelatedArticles(slug, tags = []) {
  return WCArticle.find({
    slug: { $ne: slug },
    status: "PUBLISHED",
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select("title slug excerpt imageUrl tags publishedAt")
    .lean();
}

// ── Auto-link keywords map ────────────────────────────────────────────────────
// First occurrence of each keyword in a paragraph becomes an internal link.
const KEYWORD_LINKS = [
  {
    keyword: "آخر أخبار كأس العالم",
    href: "/world-cup/news",
    linkAlways: true,
  },
  { keyword: "أخبار كأس العالم", href: "/world-cup/news", linkAlways: true },
  {
    keyword: "متابعة ترتيب المجموعات",
    href: "/world-cup/groups",
    linkAlways: true,
  },
  { keyword: "ترتيب المجموعات", href: "/world-cup/groups", linkAlways: true },
  { keyword: "جدول المباريات", href: "/world-cup/matches", linkAlways: true },
  { keyword: "الصفحة الرئيسية", href: "/world-cup", linkAlways: true },
  { keyword: "الإحصائيات", href: "/world-cup/stats", linkAlways: true },
  { keyword: "كأس العالم 2026", href: "/world-cup" },
  { keyword: "مونديال 2026", href: "/world-cup" },
  { keyword: "كأس العالم", href: "/world-cup" },
  { keyword: "المجموعات", href: "/world-cup/groups" },
];

/**
 * Parse a text string into segments: plain text, **bold**, [label](url).
 * Also auto-links the occurrences of each KEYWORD_LINKS entry.
 */
function parseInline(text, usedKeywords = new Set()) {
  const segments = [];
  // Matches **bold** or [label](url)
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "bold", content: match[1] });
    } else {
      segments.push({ type: "link", content: match[2], href: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  // Expand plain-text segments with auto-keyword links
  const result = [];
  for (const seg of segments) {
    if (seg.type !== "text") {
      result.push(seg);
      continue;
    }

    let currentSegments = [seg];

    for (const { keyword, href, linkAlways } of KEYWORD_LINKS) {
      if (!linkAlways && usedKeywords.has(keyword)) continue;

      const nextSegments = [];

      for (const currentSeg of currentSegments) {
        if (currentSeg.type !== "text") {
          nextSegments.push(currentSeg);
          continue;
        }

        let remaining = currentSeg.content;
        let matchIdx = remaining.indexOf(keyword);

        while (matchIdx !== -1) {
          if (!linkAlways && usedKeywords.has(keyword)) {
            break;
          }

          if (matchIdx > 0) {
            nextSegments.push({
              type: "text",
              content: remaining.slice(0, matchIdx),
            });
          }

          nextSegments.push({ type: "autolink", content: keyword, href });
          usedKeywords.add(keyword);

          remaining = remaining.slice(matchIdx + keyword.length);
          matchIdx = remaining.indexOf(keyword);

          if (!linkAlways) break;
        }

        if (remaining.length > 0) {
          nextSegments.push({ type: "text", content: remaining });
        }
      }
      currentSegments = nextSegments;
    }
    result.push(...currentSegments);
  }

  return result;
}

/** Renders an array of inline segments as React nodes */
function InlineContent({ segments }) {
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "bold")
          return (
            <strong key={i} className="font-bold text-white">
              {seg.content}
            </strong>
          );
        if (seg.type === "link")
          return (
            <Link
              key={i}
              href={seg.href}
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
            >
              {seg.content}
            </Link>
          );
        if (seg.type === "autolink")
          return (
            <Link
              key={i}
              href={seg.href}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              {seg.content}
            </Link>
          );
        return <span key={i}>{seg.content}</span>;
      })}
    </>
  );
}

// ── Markdown Renderer ─────────────────────────────────────────────────────────
function MarkdownContent({ content }) {
  if (!content) return null;
  const lines = content.split("\n");
  // Track which keywords have already been linked (per article render)
  const usedKeywords = new Set();

  return (
    <div className="prose-wc" dir="rtl">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-2xl font-black text-white mb-3 mt-10 pb-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <InlineContent
                segments={parseInline(line.slice(3), usedKeywords)}
              />
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="text-xl font-bold text-sky-300 mb-2 mt-7">
              <InlineContent
                segments={parseInline(line.slice(4), usedKeywords)}
              />
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h1 key={i} className="text-3xl font-black text-white mb-4 mt-8">
              <InlineContent
                segments={parseInline(line.slice(2), usedKeywords)}
              />
            </h1>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex items-start gap-3 mb-2">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <p className="text-slate-300 leading-relaxed text-[15px]">
                <InlineContent
                  segments={parseInline(line.slice(2), usedKeywords)}
                />
              </p>
            </div>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p
            key={i}
            className="text-slate-300 leading-relaxed text-[15px] mb-3"
          >
            <InlineContent segments={parseInline(line, usedKeywords)} />
          </p>
        );
      })}
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────
export default async function WCArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, article.tags);

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const articleUrl = `https://goolza.com/world-cup/news/${article.slug}`;

  // JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image:
      article.imageUrl ||
      `https://goolza.com/api/og?title=${encodeURIComponent(article.title)}`,
    author: {
      "@type": "Organization",
      name: article.author || "يلا شوت",
      url: "https://goolza.com",
    },
    publisher: {
      "@type": "Organization",
      name: "يلا شوت",
      url: "https://goolza.com",
      logo: { "@type": "ImageObject", url: "https://goolza.com/logo.png" },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: "ar",
    keywords: (article.tags || []).join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: "https://goolza.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "كأس العالم 2026",
        item: "https://goolza.com/world-cup",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "الأخبار",
        item: "https://goolza.com/world-cup/news",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen bg-[#020617]" dir="rtl">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-slate-600 font-bold mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-400 transition-colors">
            الرئيسية
          </Link>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <Link
            href="/world-cup"
            className="hover:text-slate-400 transition-colors"
          >
            كأس العالم 2026
          </Link>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <Link
            href="/world-cup/news"
            className="hover:text-slate-400 transition-colors"
          >
            الأخبار
          </Link>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-slate-500 truncate max-w-[200px]">
            {article.title}
          </span>
        </nav>

        {/* ── Tags ── */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[11px] font-bold text-sky-400"
                style={{
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.2)",
                }}
              >
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
        <p
          className="text-slate-400 text-base leading-relaxed mb-6 border-r-4 pr-4"
          style={{ borderColor: "#38bdf8" }}
        >
          {article.excerpt}
        </p>

        {/* ── Meta ── */}
        <div
          className="flex items-center gap-4 text-xs text-slate-600 mb-8 pb-8"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            {article.author || "يلا شوت"}
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {publishedDate}
          </span>
        </div>

        {/* ── Hero Image ── */}
        {article.imageUrl && (
          <div
            className="mb-10 rounded-2xl overflow-hidden aspect-video w-full"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          >
            <img
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* ── Article Content ── */}
        <article className="mb-16">
          <MarkdownContent content={article.content} />
        </article>

        {/* ── Internal Links: WC Hub ── */}
        <div
          className="mb-12 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "rgba(16,185,129,0.05)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <div>
            <p className="text-emerald-400 font-black text-sm mb-1">
              🏆 تابع كأس العالم 2026
            </p>
            <p className="text-slate-400 text-xs">
              جدول المباريات، المجموعات، والإحصائيات الكاملة
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/world-cup/matches"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              المباريات
            </Link>
            <Link
              href="/world-cup/groups"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              المجموعات
            </Link>
            <Link
              href="/world-cup"
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 transition-all"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              الرئيسية ←
            </Link>
          </div>
        </div>

        {/* ── Related Articles ── */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-sky-400 inline-block" />
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/world-cup/news/${rel.slug}`}
                  className="group rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {rel.imageUrl && (
                    <div className="h-28 overflow-hidden">
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-white text-xs font-bold leading-snug group-hover:text-sky-300 transition-colors line-clamp-2">
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
