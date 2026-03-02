import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { generateMatchSlug } from "@/lib/matchSlug";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = 'https://goolza.com';

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let dynamicRoutes = [];
  try {
    await connectDB();
    // Only fetch matches that are present in the LiveMatch documents
    const liveMatches = await LiveMatch.find({}).lean();
    
    // Extract unique match slugs from all documents
    const matchSlugs = new Set();
    liveMatches.forEach(record => {
      record.matches.forEach(match => {
        if (match.id) {
          matchSlugs.add(generateMatchSlug(match));
        }
      });
    });

    dynamicRoutes = Array.from(matchSlugs).map(slug => ({
      url: `${baseUrl}/match/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
