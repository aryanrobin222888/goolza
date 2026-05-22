"use client";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

export default function HeadToHead({ data, event }) {
  const duel = data?.teamDuel;
  if (!duel) return null;

  const total = (duel.homeWins || 0) + (duel.draws || 0) + (duel.awayWins || 0);
  if (total === 0) return null;

  const homePct = ((duel.homeWins / total) * 100).toFixed(0);
  const drawPct = ((duel.draws / total) * 100).toFixed(0);
  const awayPct = ((duel.awayWins / total) * 100).toFixed(0);

  const homeTeam = event?.homeTeam;
  const awayTeam = event?.awayTeam;

  const homeName = getArabicName(homeTeam?.shortName || homeTeam?.name || "Home", homeTeam?.fieldTranslations);
  const awayName = getArabicName(awayTeam?.shortName || awayTeam?.name || "Away", awayTeam?.fieldTranslations);

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-1">
        المواجهات المباشرة
      </h3>
      <p className="text-xs text-slate-500 text-center mb-3">
        آخر {total} مباريات
      </p>

      {/* Teams + counts */}
      <div className="flex items-center justify-between mb-2">
        <Link 
          href={homeTeam?.id ? `/team/${homeTeam?.slug || "team"}/${homeTeam.id}` : "#"}
          className="text-center group"
        >
          <p className="text-2xl font-bold text-white group-hover:text-[#ff7a00] transition-colors">{duel.homeWins}</p>
          <p className="text-xs text-slate-400 group-hover:text-white transition-colors">{homeName}</p>
        </Link>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-400">{duel.draws}</p>
          <p className="text-xs text-slate-500">تعادلات</p>
        </div>
        <Link 
          href={awayTeam?.id ? `/team/${awayTeam?.slug || "team"}/${awayTeam.id}` : "#"}
          className="text-center group"
        >
          <p className="text-2xl font-bold text-white group-hover:text-[#ff7a00] transition-colors">{duel.awayWins}</p>
          <p className="text-xs text-slate-400 group-hover:text-white transition-colors">{awayName}</p>
        </Link>
      </div>

      {/* Visual bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
        {duel.homeWins > 0 && (
          <div
            className="bg-[#ff7a00] transition-all"
            style={{ width: `${homePct}%` }}
          />
        )}
        {duel.draws > 0 && (
          <div
            className="bg-slate-500 transition-all"
            style={{ width: `${drawPct}%` }}
          />
        )}
        {duel.awayWins > 0 && (
          <div
            className="bg-blue-500 transition-all"
            style={{ width: `${awayPct}%` }}
          />
        )}
      </div>
    </div>
  );
}
