import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getTournamentBySlug } from "@/lib/tournamentConfig";
import { fetchFromSofaScore } from "@/lib/sofascore";
import LeagueHeader from "@/features/league/components/LeagueHeader";
import StandingsTable from "@/features/league/components/StandingsTable";
import TopScorers from "@/features/league/components/TopScorers";
import MatchCenter from "@/features/league/components/MatchCenter";
import LeagueSEOContent from "@/features/league/components/LeagueSEOContent";
import Footer from "@/features/schedule/components/Footer";
import Logo from "@/components/ui/Logo";
import { ArrowLeft } from "lucide-react";

// ISR: revalidate every 5 minutes
export const revalidate = 300;

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function safeFetch(url) {
  try {
    const { data } = await fetchFromSofaScore(url);
    return data;
  } catch {
    return null;
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);
  if (!tournament) return { title: "الدوري غير موجود | يلا شوت" };

  const title = `${tournament.nameAr} 2025/26 — الترتيب والنتائج والهدافين | يلا شوت`;
  const description = `تابع جدول ترتيب ${tournament.nameAr} موسم 2025/26 مع نتائج المباريات الأخيرة والهدافين. ${tournament.nameAr} بث مباشر على يلا شوت Yallashoot.`;

  return {
    title,
    description,
    keywords: [
      tournament.nameAr,
      tournament.name,
      `ترتيب ${tournament.nameAr}`,
      `نتائج ${tournament.nameAr}`,
      `هدافو ${tournament.nameAr}`,
      "يلا شوت",
      "Yallashoot",
    ],
    alternates: {
      canonical: `https://goolza.com/league/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://goolza.com/league/${slug}`,
      siteName: "يلا شوت - Yalla Shoot",
      locale: "ar_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ─── Data Fetching ─────────────────────────────────────────────────────────────

async function getLeagueData(tournament) {
  const base = `https://api.sofascore.com/api/v1/unique-tournament/${tournament.id}/season/${tournament.seasonId}`;

  const [standingsData, scorersData, seasonData] = await Promise.all([
    safeFetch(`${base}/standings/total`),
    safeFetch(
      `${base}/statistics?limit=20&order=-goals&accumulation=total&group=summary`,
    ),
    safeFetch(
      `https://api.sofascore.com/api/v1/unique-tournament/${tournament.id}/seasons`,
    ),
  ]);

  // Extract season year
  let season = null;
  if (seasonData?.seasons) {
    const found = seasonData.seasons.find((s) => s.id === tournament.seasonId);
    if (found) {
      // e.g. "2025/2026" → year = 2025
      const year = parseInt(found.year?.split("/")?.[0] ?? found.year);
      season = { year: isNaN(year) ? null : year, name: found.name };
    }
  }

  // SofaScore standings structure: data.standings[0].rows[]
  const standingsRows = standingsData?.standings?.[0] ?? null;

  // Statistics endpoint: data.results[] where each entry has
  // { player, team, goals, assists, ... } fields directly
  const scorers = scorersData?.results ?? [];

  return { standingsRows, scorers, season };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LeaguePage({ params }) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);
  if (!tournament) notFound();

  const { standingsRows, scorers, season } = await getLeagueData(tournament);

  // JSON-LD: FAQPage (from tournament seo.faq)
  const faqItems = tournament.seo?.faq ?? [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  // JSON-LD: BreadcrumbList
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
        name: tournament.nameAr,
        item: `https://goolza.com/league/${slug}`,
      },
    ],
  };

  // JSON-LD: SportsOrganization (the league itself)
  const sportsOrgLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: tournament.name,
    alternateName: tournament.nameAr,
    url: `https://goolza.com/league/${slug}`,
    sport: "Football",
    location: {
      "@type": "Place",
      name: tournament.country,
    },
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col"
      dir="rtl"
    >
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsOrgLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <nav>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#0aa674] transition-colors font-medium"
            >
              جدول المباريات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex-1 w-full">
        {/* League Header */}
        <LeagueHeader tournament={tournament} season={season} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Standings */}
          <div>
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#0aa674] rounded-full inline-block" />
              جدول الترتيب
            </h2>
            <StandingsTable standings={standingsRows} />

            {/* No data fallback */}
            {!standingsRows && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-500 text-sm mt-2">
                <p>بيانات الترتيب غير متاحة حالياً، يرجى المحاولة لاحقاً.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar: Top Scorers + Match Center */}
          <div className="space-y-5">
            {/* Top Scorers */}
            <TopScorers scorers={scorers} />

            {/* Match Center (client component, loads via useEffect) */}
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 h-64 animate-pulse" />
              }
            >
              <MatchCenter
                tournamentId={tournament.id}
                seasonId={tournament.seasonId}
              />
            </Suspense>
          </div>
        </div>

        {/* SEO Content + FAQ */}
        <LeagueSEOContent tournament={tournament} />
      </main>

      <Footer />
    </div>
  );
}
