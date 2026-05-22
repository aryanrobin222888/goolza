import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import WCArticle from "@/models/WCArticle";
import Article from "@/models/Article";
import { generateMatchSlug } from "@/lib/matchSlug";
import { TOURNAMENT_MAP } from "@/lib/tournamentConfig";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = "https://goolza.com";
  const now = new Date();

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/matches-today`,
      lastModified: now,
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.1,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-02-01"),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];

  const leagueRoutes = Object.keys(TOURNAMENT_MAP).map((slug) => ({
    url: `${baseUrl}/league/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // World Cup static routes
  const wcRoutes = [
    { url: `${baseUrl}/world-cup`, changeFrequency: "daily", priority: 0.95 },
    {
      url: `${baseUrl}/world-cup/matches`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/world-cup/groups`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/world-cup/news`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/world-cup/stats`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ].map((r) => ({ ...r, lastModified: now }));

  let dynamicRoutes = [];
  let wcArticleRoutes = [];
  try {
    await connectDB();

    // ── WC Articles ──────────────────────────────────────────────────────────
    const wcArticles = await WCArticle.find({ status: "PUBLISHED" })
      .select("slug publishedAt updatedAt")
      .lean();

    wcArticleRoutes = wcArticles.map((a) => ({
      url: `${baseUrl}/world-cup/news/${a.slug}`,
      lastModified: a.updatedAt || a.publishedAt || now,
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    // ── AI Match Articles ──────────────────────────────────────────────────
    // Fetch all published articles to ensure matches with articles are always in sitemap
    const articles = await Article.find({ status: "PUBLISHED" })
      .select("matchId updatedAt createdAt")
      .lean();

    const articleMatchMap = new Map();
    articles.forEach((a) => {
      if (a.matchId) {
        articleMatchMap.set(String(a.matchId), a.updatedAt || a.createdAt);
      }
    });

    // ── Match Pages ──────────────────────────────────────────────────────────
    const liveMatches = await LiveMatch.find({}).lean();

    // Collect unique slugs with their associated date and status
    const matchEntries = new Map();
    liveMatches.forEach((record) => {
      record.matches.forEach((match) => {
        if (match.id) {
          const slug = generateMatchSlug(match);
          const matchIdStr = String(match.id);

          const statusLower = String(match.status || "").toLowerCase();
          const isFinished = [
            "ended",
            "finished",
            "ft",
            "aet",
            "pen",
            "match finished",
          ].includes(statusLower);
          const dateVal = record.date || match.startTime || null;

          if (!matchEntries.has(slug)) {
            matchEntries.set(slug, {
              id: matchIdStr,
              date: dateVal,
              isFinished,
            });
          }
        }
      });
    });

    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    dynamicRoutes = Array.from(matchEntries.entries())
      .map(([slug, info]) => {
        const matchDate = info.date ? new Date(info.date) : now;
        const hasArticle = articleMatchMap.has(info.id);
        const shouldInclude =
          matchDate >= threeDaysAgo || !info.isFinished || hasArticle;

        return { slug, matchDate, hasArticle, shouldInclude, info };
      })
      .filter(({ shouldInclude }) => shouldInclude)
      .map(({ slug, matchDate, hasArticle, info }) => {
        const isPastMatch = matchDate < now;

        let lastMod = matchDate;
        if (hasArticle) {
          const articleUpdateDate = articleMatchMap.get(info.id);
          if (articleUpdateDate && new Date(articleUpdateDate) > matchDate) {
            lastMod = new Date(articleUpdateDate);
          }
        }

        return {
          url: `${baseUrl}/match/${slug}`,
          lastModified: lastMod,
          changeFrequency: isPastMatch
            ? hasArticle
              ? "weekly"
              : "never"
            : "always",
          priority: hasArticle ? 0.9 : isPastMatch ? 0.3 : 0.8,
        };
      });
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
  }

  return [
    ...staticRoutes,
    ...leagueRoutes,
    ...wcRoutes,
    ...wcArticleRoutes,
    ...dynamicRoutes,
  ];
}
