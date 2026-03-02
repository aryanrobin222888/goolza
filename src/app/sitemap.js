import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";

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
    
    // Extract unique matches from all documents
    const matchUrls = new Set();
    liveMatches.forEach(record => {
      record.matches.forEach(match => {
        if (match.id) {
          matchUrls.add(match.id);
        }
      });
    });

    dynamicRoutes = Array.from(matchUrls).map(id => ({
      url: `${baseUrl}/${id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
