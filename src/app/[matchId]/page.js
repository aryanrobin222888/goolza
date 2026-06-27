import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { notFound, permanentRedirect } from "next/navigation";
import { generateMatchSlug } from "@/lib/matchSlug";

// Force dynamic since match data could update
export const dynamic = "force-dynamic";

async function getMatch(matchIdStr) {
  try {
    await connectDB();
    // match.id could be string or number, check both.
    const matchIdNum = Number(matchIdStr);

    // Find the document that contains a match with this ID
    const query = isNaN(matchIdNum)
      ? { "matches.id": matchIdStr }
      : { $or: [{ "matches.id": matchIdStr }, { "matches.id": matchIdNum }] };

    const record = await LiveMatch.findOne(query).lean();
    let match = null;
    if (record) {
      match = record.matches.find(
        (m) => String(m.id) === String(matchIdStr),
      );
    }

    if (!match) {
      // Try to fetch from SofaScore proxy fallback
      try {
        const { fetchFromSofaScore } = require("@/lib/sofascore");
        const { getArabicTeamName } = require("@/lib/teamTranslations");
        const sofaRes = await fetchFromSofaScore(`https://api.sofascore.com/api/v1/event/${matchIdStr}`);
        if (sofaRes && sofaRes.data && sofaRes.data.event) {
          const event = sofaRes.data.event;
          const homeName = event.homeTeam?.fieldTranslations?.nameTranslation?.ar || getArabicTeamName(event.homeTeam?.name || event.homeTeam?.shortName);
          const awayName = event.awayTeam?.fieldTranslations?.nameTranslation?.ar || getArabicTeamName(event.awayTeam?.name || event.awayTeam?.shortName);
          
          match = {
            id: String(event.id),
            slug: event.slug,
            home: {
              name: homeName
            },
            away: {
              name: awayName
            }
          };
        }
      } catch (err) {
        console.error("Failed to fetch match from SofaScore fallback in legacy route:", err.message);
      }
    }

    return match;
  } catch (error) {
    console.error("Error fetching match:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const match = await getMatch(resolvedParams.matchId);
  if (!match) {
    return { title: "المباراة غير موجودة | يلا شوت - Yallashoot" };
  }

  const home = match.home?.name || "الفريق الأول";
  const away = match.away?.name || "الفريق الثاني";
  const comp =
    match.tournament?.name ||
    match.tournament?.uniqueTournament?.name ||
    match.league ||
    "البطولة";

  // 1. Page Title
  const title = `${home} ضد ${away} بث مباشر | ${comp} | يلا شوت - Yallashoot`;

  // 2. Meta Description — targets high-volume keywords
  const description = `مشاهدة مباراة ${home} ضد ${away} بث مباشر اليوم في ${comp}. تابع التغطية الحصرية عبر موقع يلا شوت (Yallashoot) مع سيرفرات يلا شوت وكورة لايف بدون تقطيع. جودة عالية HD تناسب الموبايل والإنترنت الضعيف.`;

  // 3. OG Description — concise & engaging for social shares
  const ogDescription = `شاهد الآن ${home} و ${away} لايف. موقع يلا شوت - أسرع بث مباشر للمباريات.`;

  // OG images: prefer team logos, fallback to site OG image
  const images = [];
  if (match.home?.logo)
    images.push({ url: match.home.logo, alt: `شعار ${home}` });
  if (match.away?.logo)
    images.push({ url: match.away.logo, alt: `شعار ${away}` });
  if (images.length === 0)
    images.push({
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "يلا شوت - بث مباشر",
    });

  return {
    title,
    description,
    keywords: [
      `${home} ضد ${away}`,
      `مباراة ${home} و${away} بث مباشر`,
      "يلا شوت",
      "كورة لايف",
      "بث مباشر بدون تقطيع",
      "مباريات اليوم بث مباشر",
      `${comp} بث مباشر`,
      "يلا شوت",
      "Yallashoot",
      "مشاهدة مباشرة HD",
    ],
    openGraph: {
      title,
      description: ogDescription,
      images,
      type: "website",
      siteName: "يلا شوت - Yallashoot",
      locale: "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: images.map((img) => img.url || img),
    },
    alternates: {
      canonical: `https://goolza.com/match/${generateMatchSlug(match)}`,
    },
  };
}

export default async function MatchPage({ params }) {
  const resolvedParams = await params;
  const match = await getMatch(resolvedParams.matchId);
  if (!match) {
    notFound();
  }

  // 301 Permanent Redirect to the new SEO slug
  const slug = generateMatchSlug(match);
  permanentRedirect(`/match/${slug}`);
}
