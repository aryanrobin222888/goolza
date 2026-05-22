"use client";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

function RatingBadge({ rating }) {
  const r = parseFloat(rating);
  let bg = "bg-slate-700";
  if (r >= 8.0) bg = "bg-emerald-600";
  else if (r >= 7.0) bg = "bg-green-600";
  else if (r >= 6.5) bg = "bg-yellow-600";
  else if (r >= 6.0) bg = "bg-orange-500";
  else bg = "bg-red-500";

  return (
    <span className={`${bg} text-white text-xs font-bold px-2 py-0.5 rounded`}>
      {r.toFixed(1)}
    </span>
  );
}

function PlayerRow({ entry, align }) {
  const p = entry.player;
  const imgUrl = `/api/sofascore/player/${p.id}/image`;

  return (
    <div className={`flex items-center gap-2.5 py-2 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <img
        src={imgUrl}
        alt={p.shortName}
        className="w-9 h-9 rounded-full bg-slate-700 object-cover border border-slate-600 flex-shrink-0"
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <div className={`min-w-0 flex-1 ${align === "right" ? "text-right" : ""}`}>
        <p className="text-sm font-semibold text-white truncate">{getArabicName(p.name, p.fieldTranslations)}</p>
      </div>
      <RatingBadge rating={entry.value} />
    </div>
  );
}

export default function HighestRatedPlayers({ data, event }) {
  if (!data?.bestHomeTeamPlayers && !data?.bestAwayTeamPlayers) return null;

  const homePlayers = data.bestHomeTeamPlayers || [];
  const awayPlayers = data.bestAwayTeamPlayers || [];

  if (homePlayers.length === 0 && awayPlayers.length === 0) return null;

  const homeTeam = event?.homeTeam;
  const awayTeam = event?.awayTeam;

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-4">
        أعلى اللاعبين تقييماً
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {homeTeam && (
            <div className="flex justify-center mb-3">
              <Link href={`/team/${homeTeam.slug || "team"}/${homeTeam.id}`}>
                <img 
                  src={`/api/sofascore/team/${homeTeam.id}/image`}
                  alt={homeTeam.name}
                  className="w-7 h-7 object-contain hover:scale-110 transition-transform"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>
            </div>
          )}
          {homePlayers.map((entry) => (
            <PlayerRow key={entry.player.id} entry={entry} align="left" />
          ))}
        </div>
        <div>
          {awayTeam && (
            <div className="flex justify-center mb-3">
              <Link href={`/team/${awayTeam.slug || "team"}/${awayTeam.id}`}>
                <img 
                  src={`/api/sofascore/team/${awayTeam.id}/image`}
                  alt={awayTeam.name}
                  className="w-7 h-7 object-contain hover:scale-110 transition-transform"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>
            </div>
          )}
          {awayPlayers.map((entry) => (
            <PlayerRow key={entry.player.id} entry={entry} align="right" />
          ))}
        </div>
      </div>
    </div>
  );
}

