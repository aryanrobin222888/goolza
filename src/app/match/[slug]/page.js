import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import Article from "@/models/Article";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/features/schedule/components/Footer";
import {
  Tv,
  Mic2,
  Trophy,
  CalendarClock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import TeamLogo from "@/components/ui/TeamLogo";
import { extractIdFromSlug } from "@/lib/matchSlug";
import { getSlugById } from "@/lib/tournamentConfig";

import { fetchSofaScoreEvents } from "@/lib/sofascore";
import { syncMatchWithSofaScore } from "@/lib/matchSync";
import { format } from "date-fns";
import MatchTabs from "@/features/match/components/MatchTabs";
import WatchButton from "@/features/match/components/WatchButton";

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
      const event = events.find(
        (e) => e.id?.toString() === match.id?.toString(),
      );
      if (event) {
        syncMatchWithSofaScore(match, event);
      }
    } catch (err) {
      console.warn(
        "Failed to fetch fresh sofascore data for match details:",
        err.message,
      );
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
    return { title: "المباراة غير موجودة | يلا شوت - Yallashoot" };
  }

  const home = match.home?.name || "الفريق الأول";
  const away = match.away?.name || "الفريق الثاني";
  const comp =
    match.tournament?.name ||
    match.tournament?.uniqueTournament?.name ||
    match.league ||
    "البطولة";
  const channel = match.channel || null;
  const matchTime = match.time || null;

  // ── Title: hybrid format focused on Match Info & Timing to avoid DMCA bots ──
  const title = `بث مباشر مباراة ${home} ضد ${away} | يلا شوت | Yalla Shoot`;

  // ── Description: injects time + channel for keyword-rich snippet ──
  const timeStr = matchTime ? `الساعة ${matchTime}` : "اليوم";
  const channelStr = channel ? `على قناة ${channel}` : "عبر يلا شوت";
  const description = `شاهد مباراة ${home} ضد ${away} بث مباشر ${timeStr} ${channelStr} ضمن ${comp}. بث HD بدون تقطيع على يلا شوت Yalla Shoot — أسرع بث مباشر مجاني للمباريات.`;
  const ogDescription = `${home} ضد ${away} لايف ${timeStr} ${channelStr}. يلا شوت — بث مباشر HD بدون تقطيع.`;

  const images = [];
  if (match.home?.logo)
    images.push({
      url: match.home.logo,
      alt: `شعار ${home} - بث مباشر مباراة اليوم عبر يلا شوت`,
    });
  if (match.away?.logo)
    images.push({
      url: match.away.logo,
      alt: `شعار ${away} - بث مباشر مباراة اليوم عبر يلا شوت`,
    });
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
      `${home} vs ${away}`,
      `${home} ضد ${away}`,
      `مباراة ${home} و${away} بث مباشر`,
      `بث مباشر ${comp}`,
      ...(channel ? [`${channel} بث مباشر`, channel] : []),
      "يلا شوت",
      "كورة لايف",
      "بث مباشر بدون تقطيع",
      "مباريات اليوم بث مباشر",
      "Yallashoot",
      "yalla shoot",
      "مشاهدة مباشرة HD",
    ],
    openGraph: {
      title,
      description: ogDescription,
      images,
      // video.other tells social crawlers this is a video stream page
      type: "video.other",
      siteName: "يلا شوت - Yalla Shoot",
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

  // Fetch AI generated article if it exists
  let article = null;
  try {
    article = await Article.findOne({ matchId: String(match.id) }).lean();
  } catch (err) {
    console.error("Error fetching article:", err);
  }

  const home = match.home?.name || "الفريق الأول";
  const away = match.away?.name || "الفريق الثاني";
  const comp =
    match.tournament?.name ||
    match.tournament?.uniqueTournament?.name ||
    match.league ||
    "البطولة";

  const tId = match.tournament?.uniqueTournament?.id || match.tournament?.id;
  const leagueSlug = tId ? getSlugById(tId) : null;

  let isLive = match.status === "LIVE";
  let isFinished =
    ["ENDED", "finished", "FT", "AET", "PEN", "Match Finished"].includes(
      match.status,
    ) || match.status?.toLowerCase() === "ended";

  if (!isLive && !isFinished && (match.startTime || match.time)) {
    const now = new Date();
    let start = new Date(match.startTime);

    if (isNaN(start.getTime()) && match.time) {
      const dateStr = now.toISOString().split("T")[0];
      start = new Date(`${dateStr}T${match.time}:00`);
    }

    if (!isNaN(start.getTime())) {
      const duration = 120; // default duration in minutes (2 hours fallback)
      const end = new Date(start.getTime() + duration * 60 * 1000);

      if (now >= start && now <= end) {
        isLive = true;
      } else if (now > end) {
        isFinished = true;
      }
    }
  }

  // ── Computed dates for schema ──
  const startDateISO = match.startTime
    ? new Date(match.startTime).toISOString()
    : (() => {
        if (match.time) {
          const today = new Date().toISOString().split("T")[0];
          return new Date(`${today}T${match.time}:00`).toISOString();
        }
        return new Date().toISOString();
      })();

  // endDate = startDate + 2 hours (standard football match duration)
  const endDateISO = new Date(
    new Date(startDateISO).getTime() + 120 * 60 * 1000,
  ).toISOString();

  const venueName = match.venue || comp;

  // ── Dynamic Meta Description ──
  const timeStr = match.time ? `الساعة ${match.time}` : "اليوم";
  const channelStr = match.channel
    ? `على قناة ${match.channel}`
    : "عبر يلا شوت";
  const dynamicDescription = `شاهد مباراة ${home} ضد ${away} بث مباشر ${timeStr} ${channelStr} ضمن ${comp}. بث HD بدون تقطيع على يلا شوت Yallashoot — أسرع بث مباشر مجاني للمباريات.`;

  // ── JSON-LD SportsEvent Schema ── (isLiveBroadcast triggers LIVE badge in SERP)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${home} vs ${away} بث مباشر | يلا شوت`,
    sport: "Football",
    url: `https://goolza.com/match/${slug}`,
    description: dynamicDescription,
    image: [
      match.home?.logo || "https://goolza.com/og-image.jpg",
      match.away?.logo || "https://goolza.com/og-image.jpg",
    ].filter(Boolean),
    startDate: startDateISO,
    endDate: endDateISO,
    eventStatus: ["CANCELLED", "cancelled"].includes(match.status)
      ? "https://schema.org/EventCancelled"
      : isFinished
        ? "https://schema.org/EventMoved"
        : "https://schema.org/EventScheduled",
    organizer: {
      "@type": "Organization",
      name: "Yallashoot",
      url: "https://goolza.com",
    },
    location: {
      "@type": "Place",
      name: venueName,
      address: "المدينة, الدولة",
    },
    offers: {
      "@type": "Offer",
      url: `https://goolza.com/match/${slug}`,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: startDateISO,
    },
    performer: [
      {
        "@type": "SportsTeam",
        name: home,
        ...(match.home?.logo && { logo: match.home.logo }),
      },
      {
        "@type": "SportsTeam",
        name: away,
        ...(match.away?.logo && { logo: match.away.logo }),
      },
    ],
    homeTeam: {
      "@type": "SportsTeam",
      name: home,
      ...(match.home?.logo && { logo: match.home.logo }),
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: away,
      ...(match.away?.logo && { logo: match.away.logo }),
    },
    // BroadcastEvent with isLiveBroadcast flag — key for SERP LIVE badge
    ...(match.channel && {
      broadcastOfEvent: {
        "@type": "BroadcastEvent",
        broadcastDisplayName: match.channel,
        isLiveBroadcast: isLive,
        startDate: startDateISO,
        endDate: endDateISO,
        publishedOn: {
          "@type": "BroadcastService",
          name: match.channel,
        },
      },
    }),
    // Score if available
    ...(isLive || isFinished
      ? {
          subEvent: [
            {
              "@type": "SportsEvent",
              name: `Score: ${match.home?.score ?? 0} - ${match.away?.score ?? 0}`,
            },
          ],
        }
      : {}),
  };

  // ── JSON-LD VideoObject Schema ── (makes stream discoverable in Google Video)
  const videoObjectLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${home} vs ${away} بث مباشر — ${comp} | يلا شوت`,
    description: `شاهد مباراة ${home} ضد ${away} بث مباشر${match.time ? ` الساعة ${match.time}` : ""} ضمن ${comp}${match.channel ? ` على قناة ${match.channel}` : ""}. بجودة HD بدون تقطيع على يلا شوت.`,
    thumbnailUrl: [
      match.home?.logo || "https://goolza.com/og-image.jpg",
      match.away?.logo || "https://goolza.com/og-image.jpg",
    ].filter(Boolean),
    uploadDate: startDateISO,
    duration: "PT2H",
    embedUrl: match.streamPageUrl || `https://goolza.com/match/${slug}`,
    contentUrl: match.streamPageUrl || `https://goolza.com/match/${slug}`,
    publication: {
      "@type": "BroadcastEvent",
      isLiveBroadcast: isLive,
      startDate: startDateISO,
      endDate: endDateISO,
    },
    publisher: {
      "@type": "Organization",
      name: "يلا شوت",
      logo: {
        "@type": "ImageObject",
        url: "https://goolza.com/logo.png",
      },
    },
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
        name: `بث مباشر مباراة ${home} و${away}`,
        item: `https://goolza.com/match/${slug}`,
      },
    ],
  };

  // ── JSON-LD FAQPage Schema ──
  const matchFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `ما هي القناة الناقلة لمباراة ${home} و${away}؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `يمكنك مشاهدة مباراة ${home} ضد ${away} عبر قناة ${match.channel || "غير محدد"} أو عبر البث المباشر على يلا شوت.`,
        },
      },
      {
        "@type": "Question",
        name: `ما هو موعد مباراة ${home} و${away}؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `تنطلق مباراة ${home} ضد ${away} في تمام الساعة ${match.time || "—"} ضمن بطولة ${comp}.`,
        },
      },
      {
        "@type": "Question",
        name: `أين أشاهد مباراة ${home} و${away} بث مباشر؟`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `يمكنك متابعة مباراة ${home} ضد ${away} بث مباشر مجاناً عبر موقع يلا شوت goolza.com بجودة عالية HD بدون تقطيع.`,
        },
      },
    ],
  };

  // ── JSON-LD NewsArticle Schema ──
  // Injected only when an AI article exists — required for Google Discover eligibility.
  const newsArticleLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.metaDescription || dynamicDescription,
        // Google Discover requires at minimum one image >= 1200px wide
        image: [
          article.imageUrl ||
            `https://goolza.com/api/og?title=${encodeURIComponent(article.title)}&home=${encodeURIComponent(match.home?.logo || "")}&away=${encodeURIComponent(match.away?.logo || "")}`,
        ],
        datePublished: article.createdAt
          ? new Date(article.createdAt).toISOString()
          : startDateISO,
        dateModified: article.updatedAt
          ? new Date(article.updatedAt).toISOString()
          : startDateISO,
        author: [
          {
            "@type": "Organization",
            name: "يلا شوت",
            url: "https://goolza.com",
          },
        ],
        publisher: {
          "@type": "Organization",
          name: "يلا شوت",
          logo: {
            "@type": "ImageObject",
            url: "https://goolza.com/logo.png",
            width: 200,
            height: 60,
          },
        },
        url: `https://goolza.com/match/${slug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://goolza.com/match/${slug}`,
        },
        articleSection: "كرة القدم",
        inLanguage: "ar",
        about: [
          { "@type": "SportsTeam", name: home },
          { "@type": "SportsTeam", name: away },
          {
            "@type": "SportsEvent",
            name: `${home} vs ${away}`,
            description: dynamicDescription,
            startDate: startDateISO,
            endDate: endDateISO,
            eventStatus: ["CANCELLED", "cancelled"].includes(match.status)
              ? "https://schema.org/EventCancelled"
              : isFinished
                ? "https://schema.org/EventMoved"
                : "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: venueName,
              address: "المدينة, الدولة",
            },
            image: [
              match.home?.logo || "https://goolza.com/og-image.jpg",
              match.away?.logo || "https://goolza.com/og-image.jpg",
            ].filter(Boolean),
            organizer: {
              "@type": "Organization",
              name: "Yallashoot",
              url: "https://goolza.com",
            },
            performer: [
              {
                "@type": "SportsTeam",
                name: home,
                ...(match.home?.logo && { logo: match.home.logo }),
              },
              {
                "@type": "SportsTeam",
                name: away,
                ...(match.away?.logo && { logo: match.away.logo }),
              },
            ],
            offers: {
              "@type": "Offer",
              url: `https://goolza.com/match/${slug}`,
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              validFrom: startDateISO,
            },
          },
        ],
      }
    : null;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col transition-colors duration-300"
      dir="rtl"
    >
      {/* ── JSON-LD Schemas ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(matchFaqJsonLd) }}
      />
      {/* NewsArticle schema for Google Discover — only when AI article exists */}
      {newsArticleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }}
        />
      )}

      {/* ── Header ── */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          <nav>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#0aa674] transition-colors font-medium"
            >
              الجدول الكامل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </nav>
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
            <Link
              href={
                match.home?.id
                  ? `/team/${match.home?.slug || "team"}/${match.home?.id}`
                  : "#"
              }
              className="flex flex-col items-center gap-3 flex-1 group"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-full border border-slate-700 p-2 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <TeamLogo
                  src={match.home?.logo}
                  alt={`شعار ${home} - بث مباشر مباراة اليوم عبر يلا شوت`}
                  size={80}
                  className="w-full h-full p-2"
                />
              </div>
              <span className="font-bold text-sm md:text-base text-center text-white transition-colors duration-300 group-hover:text-sky-400">
                {home}
              </span>
            </Link>

            {/* Score / VS */}
            <div className="flex flex-col items-center gap-1 shrink-0">
              {isLive || isFinished ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-white">
                    {match.home?.score ?? 0}
                  </span>
                  <span className="text-2xl text-slate-400">-</span>
                  <span className="text-4xl font-black text-white">
                    {match.away?.score ?? 0}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-black text-white">VS</span>
              )}
              <span className="text-xs text-slate-300 font-medium text-center px-2">
                {comp.length > 20 ? `${comp.substring(0, 15)}` : comp}
              </span>
            </div>

            {/* Away */}
            <Link
              href={
                match.away?.id
                  ? `/team/${match.away?.slug || "team"}/${match.away?.id}`
                  : "#"
              }
              className="flex flex-col items-center gap-3 flex-1 group"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-full border border-slate-700 p-2 shadow-sm overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <TeamLogo
                  src={match.away?.logo}
                  alt={`شعار ${away} - بث مباشر مباراة اليوم عبر يلا شوت`}
                  size={80}
                  className="w-full h-full p-2"
                />
              </div>
              <span className="font-bold text-sm md:text-base text-center text-white transition-colors duration-300 group-hover:text-sky-400">
                {away}
              </span>
            </Link>
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
              <span
                className="absolute w-40 h-40 rounded-full border border-[#0aa674]/10 animate-ping"
                style={{ animationDuration: "2.5s" }}
              />
              <span
                className="absolute w-56 h-56 rounded-full border border-[#0aa674]/5 animate-ping"
                style={{ animationDuration: "3.2s", animationDelay: "0.4s" }}
              />

              {/* CTA Button with Countdown */}
              <WatchButton
                streamPageUrl={match.streamPageUrl}
                isFinished={isFinished}
                isLive={isLive}
                matchTime={match.time}
                matchStartTime={match.startTime}
              />
            </div>
          </div>
        </div>

        {/* ── Match Tabs (Live Details / Lineups / Stats) ── */}
        <MatchTabs eventId={match.id} isLive={isLive} isFinished={isFinished} />

        {/* ── SEO Content Article (server-rendered, crawlable) ── */}
        <article
          className="space-y-6 leading-loose"
          style={{ direction: "rtl", textAlign: "right" }}
        >
          <div className="bg-[#1e293b]/50 rounded-2xl border border-slate-800 p-6 md:p-8">
            {article ? (
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl md:text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-3 mt-8 first:mt-0"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-bold text-emerald-400 mb-3 mt-6"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-base text-gray-300 mb-6 leading-relaxed"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside text-gray-300 mb-6 space-y-2 pr-4"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-gray-300 marker:text-emerald-500"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-white" {...props} />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            ) : (
              // Fallback Boilerplate Text if AI Article is not generated
              <>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 border-b border-slate-700/50 pb-3">
                  يلا شوت بث مباشر الان — مشاهدة مباراة {home} و{away}
                </h2>
                <p className="text-base text-gray-400 mb-6">
                  تترقب الجماهير مشاهدة مباريات اليوم بث مباشر وخاصة مباراة{" "}
                  {home} ضد {away} عبر موقع يلا شوت yalla shoot، والتي تنطلق
                  {match.time ? ` في تمام الساعة ${match.time}` : ""} ضمن
                  منافسات{" "}
                  {leagueSlug ? (
                    <Link
                      href={`/league/${leagueSlug}`}
                      className="text-[#0aa674] font-bold hover:underline"
                    >
                      {comp}
                    </Link>
                  ) : (
                    <span className="text-[#0aa674] font-bold">{comp}</span>
                  )}
                  . وتأتي هذه المواجهة الهامة في{" "}
                  {match.venue || "الملعب الرسمي"}، حيث يسعى الفريقان لتحقيق
                  نتيجة إيجابية لتعزيز موقفهما في البطولة. تابع كوره لايف يلا
                  شوت لتصلك جميع التحديثات.
                </p>

                <h3 className="text-lg font-bold text-white mb-3 mt-6">
                  كيفية المتابعة على يلا شوت
                </h3>
                <p className="text-base text-gray-400 mb-6">
                  يوفر موقع يلا شوت لايف (yalla live) تجربة بث مباشر خالية من
                  التقطيع عبر سيرفرات متعددة تناسب مختلف سرعات الإنترنت (جودات
                  4K، FHD، HD، و SD). سواء كنت تتابع عبر هاتفك المحمول أو شاشة
                  الحاسوب، تضمن لك منصتنا استقرار البث لمباراة {home} و{away}{" "}
                  عبر yalla tv لكي لا تفوتك أي لقطة حاسمة.
                </p>
              </>
            )}

            {/* Contextual Link */}
            {leagueSlug && (
              <div className="mt-8 pt-4 border-t border-slate-800/50 flex flex-wrap gap-2 items-center text-sm font-medium">
                <span className="text-slate-500">مواضيع ذات صلة:</span>
                <Link
                  href={`/league/${leagueSlug}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-[#0aa674]" />
                  المزيد من مباريات {comp}
                </Link>
              </div>
            )}
          </div>
        </article>

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
