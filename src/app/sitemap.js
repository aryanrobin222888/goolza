import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { generateMatchSlug } from "@/lib/matchSlug";

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
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let dynamicRoutes = [];
  try {
    await connectDB();
    const liveMatches = await LiveMatch.find({}).lean();

    // Collect unique slugs with their associated date
    const matchEntries = new Map();
    liveMatches.forEach((record) => {
      record.matches.forEach((match) => {
        if (match.id) {
          const slug = generateMatchSlug(match);
          if (!matchEntries.has(slug)) {
            matchEntries.set(slug, {
              date: record.date || match.startTime || null,
            });
          }
        }
      });
    });

    dynamicRoutes = Array.from(matchEntries.entries()).map(([slug, info]) => {
      const matchDate = info.date ? new Date(info.date) : now;
      const isPastMatch = matchDate < now;
      return {
        url: `${baseUrl}/match/${slug}`,
        lastModified: matchDate,
        changeFrequency: isPastMatch ? "never" : "daily",
        priority: isPastMatch ? 0.3 : 0.9,
      };
    });
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
