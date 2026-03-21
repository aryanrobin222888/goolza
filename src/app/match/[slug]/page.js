import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/features/schedule/components/Footer";
import { Tv, Mic2, Trophy, CalendarClock, ArrowRight, ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { extractIdFromSlug } from "@/lib/matchSlug";

import { fetchSofaScoreEvents } from "@/lib/sofascore";
import { syncMatchWithSofaScore } from "@/lib/matchSync";
import { format } from "date-fns";
import MatchTabs from "@/features/match/components/MatchTabs";

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

    let match = record.matches.find((m) => String(m.id) === String(matchId));
    if (!match) return null;

    // ====== MERGE SOFASCORE DATA (LIVE SYNC) ======
    try {
      const todayStr = record.date || format(new Date(), "yyyy-MM-dd");
      const sofaData = await fetchSofaScoreEvents(todayStr);
      const events = sofaData.events || [];
      const event = events.find((e) => e.id?.toString() === match.id?.toString());
      if (event) {
        syncMatchWithSofaScore(match, event);
      }
    } catch (err) {
      console.warn("Failed to fetch fresh sofascore data for match details:", err.message);
    }
    // ==============================================

    return JSON.parse(JSON.stringify(match));
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
  if (match.home?.logo) images.push({ url: match.home.logo, alt: `شعار ${home} - بث مباشر مباراة اليوم عبر موقع جولزا Goolza` });
  if (match.away?.logo) images.push({ url: match.away.logo, alt: `شعار ${away} - بث مباشر مباراة اليوم عبر موقع جولزا Goolza` });
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

  let isLive = match.status === "LIVE";
  let isFinished = ["ENDED", "finished", "FT", "AET", "PEN", "Match Finished"].includes(match.status) || match.status?.toLowerCase() === "ended";

  if (!isLive && !isFinished && (match.startTime || match.time)) {
    const now = new Date();
    let start = new Date(match.startTime);

    if (isNaN(start.getTime()) && match.time) {
      const dateStr = now.toISOString().split("T")[0];
      start = new Date(`${dateStr}T${match.time}:00`);
    }

    if (!isNaN(start.getTime())) {
      const duration = 120; // default duration in minutes
      const end = new Date(start.getTime() + duration * 60 * 1000);

      if (now >= start && now <= end) {
        isLive = true;
      } else if (now > end) {
        isFinished = true;
      }
    }
  }

  // ── JSON-LD SportsEvent Schema ──
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `بث مباشر مباراة ${home} و${away}`,
    sport: "Football",
    url: `https://goolza.com/match/${slug}`,
    startDate: match.startTime || new Date().toISOString(),
    organizer: {
      "@type": "Organization",
      name: "goolza",
      url: "https://goolza.com"
    },
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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col transition-colors duration-300" dir="rtl">
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
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#0aa674] transition-colors font-medium"
          >
            الجدول الكامل
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 flex-1 w-full space-y-6">

        {/* ── Tournament breadcrumb ── */}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Trophy className="w-3.5 h-3.5" />
          <span className="font-semibold text-white">{comp}</span>
          {match.roundInfo?.round && (
            <>
              <span>·</span>
              <span className="text-white">الجولة {match.roundInfo.round}</span>
            </>
          )}
        </div>

        {/* ── H1 + Status ── */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0aa674]">
            بث مباشر مباراة {home} و{away}
          </h1>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 bg-red-900/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-900/50 animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              مباشر الآن
            </span>
          )}
          {isFinished && (
            <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
              انتهت المباراة
            </span>
          )}
          {!isLive && !isFinished && match.time && (
            <span className="inline-flex items-center gap-1.5 bg-[#0aa674]/10 text-[#0aa674] text-xs font-bold px-3 py-1 rounded-full border border-[#0aa674]/30">
              <CalendarClock className="w-3.5 h-3.5" />
              {match.time}
            </span>
          )}
        </div>

        {/* ── Score Card ── */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-full border border-slate-700 p-2 shadow-sm">
                {match.home?.logo ? (
                  <img
                    src={match.home.logo}
                    alt={`شعار ${home} - بث مباشر مباراة اليوم عبر موقع جولزا Goolza`}
                    className="w-full h-full object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-2xl">⚽</div>
                )}
              </div>
              <span className="font-bold text-sm md:text-base text-center text-white">{home}</span>
            </div>

            {/* Score / VS */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-white">{match.home?.score ?? 0}</span>
                  <span className="text-2xl text-slate-400">-</span>
                  <span className="text-4xl font-black text-white">{match.away?.score ?? 0}</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-white">VS</span>
              )}
              <span className="text-xs text-slate-300 font-medium text-center px-2">
                {comp.length > 20 ? `${comp.substring(0, 15)}` : comp}
              </span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-full border border-slate-700 p-2 shadow-sm">
                {match.away?.logo ? (
                  <img
                    src={match.away.logo}
                    alt={`شعار ${away} - بث مباشر مباراة اليوم عبر موقع جولزا Goolza`}
                    className="w-full h-full object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-2xl">⚽</div>
                )}
              </div>
              <span className="font-bold text-sm md:text-base text-center text-white">{away}</span>
            </div>
          </div>
        </div>

        {/* ── Watch CTA ── */}
        <div className="w-full rounded-2xl overflow-hidden shadow-xl relative bg-[#0d1f2d] border border-[#0aa674]/20">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0aa67420_0%,_transparent_70%)] pointer-events-none" />

          <div className="aspect-video flex flex-col items-center justify-center gap-8 px-6 relative">

            {/* LIVE badge */}
            {isLive && (
              <div className="relative flex items-center justify-center">
                <span className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                <span className="relative inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-red-900/50">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </span>
              </div>
            )}

            {/* Ripple rings behind the button */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-40 h-40 rounded-full border border-[#0aa674]/10 animate-ping" style={{ animationDuration: "2.5s" }} />
              <span className="absolute w-56 h-56 rounded-full border border-[#0aa674]/5 animate-ping" style={{ animationDuration: "3.2s", animationDelay: "0.4s" }} />

              {/* CTA Button */}
              {match.streamPageUrl && !isFinished ? (
                <a
                  href={match.streamPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-3 bg-[#0aa674] hover:bg-[#08c285] text-white font-bold text-lg md:text-xl px-10 py-4 rounded-2xl shadow-lg shadow-[#0aa674]/30 hover:shadow-[#0aa674]/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                >
                  {/* Shimmer sweep on hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                  {/* Play icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover/btn:scale-110">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                  </svg>
                  شاهد البث من هنا
                </a>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="inline-flex items-center gap-3 bg-[#0aa674]/20 border border-[#0aa674]/30 text-[#0aa674] font-bold text-lg md:text-xl px-10 py-4 rounded-2xl cursor-default">
                    <Tv className="w-6 h-6 flex-shrink-0" />
                    {isFinished ? "انتهت المباراة" : "البث سيبدأ قريباً"}
                  </div>
                  <p className="text-[#0aa674]/70 text-sm text-center">
                    {isFinished
                      ? "انتهى البث، شكراً على المتابعة."
                      : !isLive && match.time
                      ? `سيبدأ البث عند الساعة ${match.time}`
                      : "سيتم توفير رابط البث عند انطلاق المباراة."}
                  </p>
                </div>
              )}
            </div>

            {/* Subtitle hint */}
            {match.streamPageUrl && !isFinished && (
              <p className="text-slate-400 text-sm text-center">
                انقر للمشاهدة — بث مباشر بجودة عالية
              </p>
            )}
          </div>
        </div>

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
              className="bg-[#1e293b] rounded-xl border border-slate-800 p-4 flex flex-col gap-2 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 text-[#0aa674]">
                {detail.icon}
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {detail.label}
                </span>
              </div>
              <p className="text-sm font-bold text-white truncate">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* ── Match Tabs (Live Details / Lineups / Stats) ── */}
        <MatchTabs eventId={match.id} isLive={isLive} isFinished={isFinished} />

        {/* ── Back CTA ── */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0aa674] hover:underline"
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
