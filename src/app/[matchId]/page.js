import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { notFound } from "next/navigation";
import Image from "next/image";
import Footer from "@/features/schedule/components/Footer";

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
    if (!record) return null;
    
    // Extract the specific match
    const match = record.matches.find(m => String(m.id) === String(matchIdStr));
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
    return { title: "المباراة غير موجودة | كوولزا - goolza" };
  }

  const home = match.home?.name || "الفريق الأول";
  const away = match.away?.name || "الفريق الثاني";
  const comp = match.tournament?.name || match.tournament?.uniqueTournament?.name || match.league || "البطولة";

  // 1. Page Title
  const title = `${home} ضد ${away} بث مباشر | ${comp} | كوولزا - goolza`;

  // 2. Meta Description — targets high-volume keywords
  const description = `مشاهدة مباراة ${home} ضد ${away} بث مباشر اليوم في ${comp}. تابع التغطية الحصرية عبر موقع كوولزا (goolza) مع سيرفرات يلا شوت وكورة لايف بدون تقطيع. جودة عالية HD تناسب الموبايل والإنترنت الضعيف.`;

  // 3. OG Description — concise & engaging for social shares
  const ogDescription = `شاهد الآن ${home} و ${away} لايف. موقع كوولزا - أسرع بث مباشر للمباريات.`;

  // OG images: prefer team logos, fallback to site OG image
  const images = [];
  if (match.home?.logo) images.push({ url: match.home.logo, alt: `شعار ${home}` });
  if (match.away?.logo) images.push({ url: match.away.logo, alt: `شعار ${away}` });
  if (images.length === 0) images.push({ url: "/og-image.jpg", width: 1200, height: 630, alt: "كوولزا - بث مباشر" });

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
      "كوولزا",
      "goolza",
      "مشاهدة مباشرة HD",
    ],
    openGraph: {
      title,
      description: ogDescription,
      images,
      type: "website",
      siteName: "كوولزا - goolza",
      locale: "ar_SA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: images.map((img) => img.url || img),
    },
    alternates: {
      canonical: `https://goolza.com/${resolvedParams.matchId}`,
    },
  };
}

export default async function MatchPage({ params }) {
  const resolvedParams = await params;
  const match = await getMatch(resolvedParams.matchId);
  if (!match) {
    notFound();
  }

  // Create SportsEvent JSON-LD schema
  const compName = match.tournament?.name || match.tournament?.uniqueTournament?.name || match.league || "Unknown Location";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `مباراة ${match.home.name} ضد ${match.away.name}`,
    "startDate": match.startTime || new Date().toISOString(), // Use startTime if available
    "homeTeam": {
      "@type": "SportsTeam",
      "name": match.home.name
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": match.away.name
    },
    "location": {
      "@type": "Place",
      "name": compName
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Basic Navigation / Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-[#5c2d91] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white text-xs font-black">M</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#5c2d91]">
              goo<span className="text-slate-400">lza</span>
            </span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full space-y-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5c2d91] mb-8">
          {`بث مباشر مباراة ${match.home.name} و${match.away.name}`}
        </h1>
        
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto flex items-center justify-between gap-4">
          
          {/* Home Team */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 relative">
              {match.home.logo ? (
                 <Image 
                   src={match.home.logo} 
                   alt={`لوجو ${match.home.name}`}
                   fill
                   className="object-contain"
                   sizes="(max-width: 768px) 80px, 96px"
                 />
              ) : (
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">⚽</div>
              )}
            </div>
            <span className="font-bold text-lg">{match.home.name}</span>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center justify-center flex-1">
             <div className="text-3xl font-black text-slate-300 mb-2">VS</div>
             <div className="text-sm font-medium text-[#5c2d91] bg-purple-50 px-3 py-1 rounded-full">
               {compName}
             </div>
             {(match.time || match.startTime) && (
               <div className="mt-2 text-slate-500 font-medium">
                 {match.time}
               </div>
             )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 relative">
              {match.away.logo ? (
                 <Image 
                   src={match.away.logo} 
                   alt={`لوجو ${match.away.name}`}
                   fill
                   className="object-contain"
                   sizes="(max-width: 768px) 80px, 96px"
                 />
              ) : (
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">⚽</div>
              )}
            </div>
            <span className="font-bold text-lg">{match.away.name}</span>
          </div>
          
        </div>

        {/* Video Player Placeholder / Area */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-lg flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            <div className="text-center z-10 text-white">
               <span className="block text-2xl font-bold mb-2">سيتم توفير البث هنا</span>
               <span className="text-slate-300">في وقت المبارة سيعمل البث تلقائياً</span>
            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
