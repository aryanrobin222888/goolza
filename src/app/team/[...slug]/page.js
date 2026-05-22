import { fetchFromSofaScore } from "@/lib/sofascore";
import { notFound } from "next/navigation";
import Link from "next/link";
import TeamTabs from "./_components/TeamTabs";
import Logo from "@/components/ui/Logo";
import { ArrowLeft } from "lucide-react";
import { getArabicName } from "@/features/schedule/utils/mappers";

export const dynamic = "force-dynamic";

async function getTeamInfo(id) {
  try {
    const { data } = await fetchFromSofaScore(
      `https://api.sofascore.com/api/v1/team/${id}`,
    );
    return data.team || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const id = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  const team = await getTeamInfo(id);
  if (!team) return { title: "الفريق | جولزا يلا شوت" };
  const teamName = getArabicName(team.name, team.fieldTranslations);
  return {
    title: `${teamName} - إحصائيات واللاعبون | جولزا يلا شوت`,
    description: `تابع آخر إحصائيات نادي ${teamName} في الموسم الحالي. تشكيلة اللاعبين، نتائج المباريات السابقة، مواعيد اللقاءات القادمة، وترتيب الفريق في الدوري بالتفصيل على جولزا يلا شوت Goolza.`,
    alternates: { canonical: `https://goolza.com/team/${team.slug}/${id}` },
  };
}

export default async function TeamPage({ params }) {
  const { slug } = await params;
  const id = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  const team = await getTeamInfo(id);
  if (!team) notFound();

  const serialized = JSON.parse(JSON.stringify(team));

  return (
    <div className="min-h-screen bg-[#020617] text-white" dir="rtl">
      {/* ── Header ── */}
      <header
        className="bg-[#020617]/80 backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          <nav>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-[#38bdf8] transition-colors font-medium"
            >
              الجدول الكامل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[400px] rounded-full opacity-[0.04]"
            style={{
              background:
                "radial-gradient(ellipse, #38bdf8 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-10 relative z-10">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-slate-600 mb-7"
            aria-label="breadcrumb"
          >
            <Link href="/" className="hover:text-slate-400 transition-colors">
              يلا شوت
            </Link>
            <span>›</span>
            <span className="text-slate-400">
              {getArabicName(team.name, team.fieldTranslations)}
            </span>
          </nav>

          <div className="flex items-center gap-5 md:gap-8">
            {/* Logo */}
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-2xl flex items-center justify-center p-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <img
                src={`/api/sofascore/team/${id}/image`}
                alt={`شعار ${getArabicName(team.name, team.fieldTranslations)}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {team.country?.alpha2 && (
                  <img
                    src={`https://flagcdn.com/20x15/${team.country.alpha2.toLowerCase()}.png`}
                    alt={
                      getArabicName(
                        team.country?.name,
                        team.country?.fieldTranslations,
                      ) || ""
                    }
                    width={20}
                    height={15}
                    className="rounded-sm"
                  />
                )}
                <span className="text-slate-500 text-xs">
                  {getArabicName(
                    team.country?.name,
                    team.country?.fieldTranslations,
                  )}
                </span>
                {team.primaryUniqueTournament?.name && (
                  <>
                    <span className="text-slate-700">·</span>
                    <span className="text-xs text-slate-500">
                      {getArabicName(
                        team.primaryUniqueTournament.name,
                        team.primaryUniqueTournament.fieldTranslations,
                      )}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-3 truncate">
                {getArabicName(team.name, team.fieldTranslations)}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                {team.manager?.name && (
                  <span className="flex items-center gap-1.5">
                    <span>👔</span>{" "}
                    {getArabicName(
                      team.manager.name,
                      team.manager.fieldTranslations,
                    )}
                  </span>
                )}
                {team.venue?.name && (
                  <span className="flex items-center gap-1.5">
                    <span>🏟️</span>{" "}
                    {getArabicName(
                      team.venue.name,
                      team.venue.fieldTranslations,
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <TeamTabs
        teamId={String(id)}
        team={serialized}
        primaryTournamentId={team.primaryUniqueTournament?.id || null}
      />
    </div>
  );
}
