import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/features/schedule/components/Footer";
import { Tv, Mic2, Trophy, CalendarClock, ArrowRight } from "lucide-react";
import { extractIdFromSlug } from "@/lib/matchSlug";

export const dynamic = "force-dynamic";

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getMatch(slug) {
  try {
    await connectDB();
    // Extract the numeric match ID from the end of the slug
    // e.g. "real-madrid-vs-getafe-14081819" → "14081819"
    const matchId = extractIdFromSlug(slug);
    const matchIdNum = Number(matchId);

    const query = isNaN(matchIdNum)
      ? { "matches.id": matchId }
      : { $or: [{ "matches.id": matchId }, { "matches.id": matchIdNum }] };

    const record = await LiveMatch.findOne(query).lean();
    if (!record) return null;

    const match = record.matches.find((m) => String(m.id) === String(matchId));
    return match ? JSON.parse(JSON.stringify(match)) : null;
  } catch (err) {
    console.error("Error fetching match:", err);
    return null;
  }
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const match = await getMatch(slug);

  if (!match) {
    return { title: "المباراة غير موجودة | كوولزا - goolza" };
  }

  const home = match.home?.name || "الفريق الأول";
  const away = match.away?.name || "الفريق الثاني";
  const comp =
    match.tournament?.name ||
    match.tournament?.uniqueTournament?.name ||
    match.league ||
    "البطولة";

  const title = `بث مباشر مباراة ${home} و${away} | ${comp} | كوولزا`;
  const description = `مشاهدة مباراة ${home} ضد ${away} بث مباشر اليوم في ${comp}. تابع التغطية الحصرية عبر موقع كوولزا (goolza) مع سيرفرات يلا شوت وكورة لايف بدون تقطيع. جودة عالية HD تناسب الموبايل والإنترنت الضعيف.`;
  const ogDescription = `شاهد الآن ${home} و ${away} لايف. موقع كوولزا - أسرع بث مباشر للمباريات.`;

  const images = [];
  if (match.home?.logo) images.push({ url: match.home.logo, alt: `شعار ${home}` });
  if (match.away?.logo) images.push({ url: match.away.logo, alt: `شعار ${away}` });
  if (images.length === 0)
    images.push({ url: "/og-image.jpg", width: 1200, height: 630, alt: "كوولزا - بث مباشر" });

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
      images: images.map((img) => img.url),
    },
    alternates: {
      canonical: `https://goolza.com/match/${slug}`,
    },
    // Expose the clean slug for structured data
    other: {
      "match-slug": slug,
    },
  };
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default async function MatchPage({ params }) {
  const { slug } = await params;
  const match = await getMatch(slug);
  if (!match) notFound();

  const home = match.home?.name || "الفريق الأول";
  const away = match.away?.name || "الفريق الثاني";
  const comp =
    match.tournament?.name ||
    match.tournament?.uniqueTournament?.name ||
    match.league ||
    "البطولة";

  const isLive = match.status === "LIVE";
  const isFinished = match.status === "ENDED" || match.status === "finished";

  // ── JSON-LD SportsEvent Schema ──
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `بث مباشر مباراة ${home} و${away}`,
    sport: "Football",
    url: `https://goolza.com/match/${slug}`,
    startDate: match.startTime || new Date().toISOString(),
    homeTeam: { "@type": "SportsTeam", name: home },
    awayTeam: { "@type": "SportsTeam", name: away },
    location: { "@type": "Place", name: comp },
    ...(match.channel && {
      broadcastOfEvent: {
        "@type": "BroadcastEvent",
        broadcastDisplayName: match.channel,
      },
    }),
  };

  // ── JSON-LD BreadcrumbList Schema ──
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: "https://goolza.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: comp,
        item: `https://goolza.com/?league=${encodeURIComponent(comp)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `بث مباشر مباراة ${home} و${away}`,
        item: `https://goolza.com/match/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col" dir="rtl">
      {/* ── JSON-LD Schemas ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-[#5c2d91] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white text-xs font-black">M</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#5c2d91]">
              gool<span className="text-slate-400">za</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#5c2d91] transition-colors font-medium"
          >
            الجدول الكامل
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-6">

        {/* ── Tournament breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>{comp}</span>
          {match.roundInfo?.round && (
            <>
              <span>·</span>
              <span>الجولة {match.roundInfo.round}</span>
            </>
          )}
        </div>

        {/* ── H1 + Status ── */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5c2d91]">
            بث مباشر مباراة {home} و{away}
          </h1>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200 animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              مباشر الآن
            </span>
          )}
          {isFinished && (
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
              انتهت المباراة
            </span>
          )}
          {!isLive && !isFinished && match.time && (
            <span className="inline-flex items-center gap-1.5 bg-purple-50 text-[#5c2d91] text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
              <CalendarClock className="w-3.5 h-3.5" />
              {match.time}
            </span>
          )}
        </div>

        {/* ── Score Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                {match.home?.logo ? (
                  <Image
                    src={match.home.logo}
                    alt={`شعار ${home}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-2xl">⚽</div>
                )}
              </div>
              <span className="font-bold text-sm md:text-base text-center text-slate-800">{home}</span>
            </div>

            {/* Score / VS */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-[#5c2d91]">{match.home?.score ?? 0}</span>
                  <span className="text-2xl text-slate-300">-</span>
                  <span className="text-4xl font-black text-[#5c2d91]">{match.away?.score ?? 0}</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-slate-200">VS</span>
              )}
              <span className="text-xs text-slate-400 font-medium">{comp}</span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                {match.away?.logo ? (
                  <Image
                    src={match.away.logo}
                    alt={`شعار ${away}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-2xl">⚽</div>
                )}
              </div>
              <span className="font-bold text-sm md:text-base text-center text-slate-800">{away}</span>
            </div>
          </div>
        </div>

        {/* ── Watch CTA ── */}
        {match.streamPageUrl ? (
          <a
            href={match.streamPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full rounded-2xl overflow-hidden shadow-xl relative"
          >
            {/* Background gradient */}
            <div className="bg-gradient-to-br from-[#1a0533] via-[#2d0f5e] to-[#0f0020] aspect-video flex flex-col items-center justify-center gap-6 px-6 transition-all duration-300 group-hover:from-[#220a42] group-hover:via-[#3a1478] group-hover:to-[#150030]">
              {/* Live pulse ring */}
              {isLive && (
                <div className="relative">
                  <span className="absolute -inset-3 rounded-full bg-red-500/20 animate-ping" />
                  <span className="relative inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-red-900/50">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
              )}

              {/* Main button */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20 shadow-2xl">
                  <Tv className="w-9 h-9 text-white" />
                </div>
                <p className="text-white text-xl md:text-2xl font-black tracking-tight">
                  {isFinished ? "شاهد ملخص المباراة" : "شاهد المباراة الآن"}
                </p>
                <p className="text-purple-300 text-sm font-medium">
                  {isLive ? "البث مباشر متاح الآن · HD بدون تقطيع" : isFinished ? "شاهد ملخص المباراة" : `ينطلق البث عند الساعة ${match.time || ""}`}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium transition-all duration-300 group-hover:text-white group-hover:gap-3">
                <span>انقر للمشاهدة</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </div>
            </div>
          </a>
        ) : (
          <div className="bg-gradient-to-br from-[#1a0533] via-[#2d0f5e] to-[#0f0020] rounded-2xl aspect-video flex flex-col items-center justify-center text-center px-6 shadow-xl gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Tv className="w-8 h-8 text-white/50" />
            </div>
            <div>
              <p className="text-white font-bold text-lg mb-1">
                {isFinished ? "شاهد ملخص المباراة" : "البث سيبدأ قريباً"}
              </p>
              <p className="text-purple-300 text-sm">
                {isFinished
                  ? "انتهت المباراة."
                  : !isLive && match.time
                  ? `سيبدأ البث عند الساعة ${match.time}`
                  : "سيتم توفير رابط البث عند انطلاق المباراة."}
              </p>
            </div>
          </div>
        )}

        {/* ── Match Details Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: <Tv className="w-4 h-4" />,
              label: "القناة الناقلة",
              value: match.channel || "غير محدد",
            },
            {
              icon: <Mic2 className="w-4 h-4" />,
              label: "المعلق",
              value: match.commentator || "غير محدد",
            },
            {
              icon: <Trophy className="w-4 h-4" />,
              label: "البطولة",
              value: comp,
            },
            {
              icon: <CalendarClock className="w-4 h-4" />,
              label: "توقيت المباراة",
              value: match.time || "—",
            },
          ].map((detail) => (
            <div
              key={detail.label}
              className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center gap-2 text-[#5c2d91]">
                {detail.icon}
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {detail.label}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800 truncate">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* ── Back CTA ── */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5c2d91] hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            عودة إلى جدول المباريات
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
