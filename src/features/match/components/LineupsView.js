"use client";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

const POSITION_MAP = { G: "GK", D: "DEF", M: "MID", F: "FWD" };

function RatingBadge({ rating }) {
  if (!rating) return null;
  const r = parseFloat(rating).toFixed(2);
  let bgColor = "bg-slate-700";
  if (r >= 7.5) bgColor = "bg-emerald-600";
  else if (r >= 7.0) bgColor = "bg-green-600";
  else if (r >= 6.5) bgColor = "bg-yellow-600";
  else if (r >= 6.0) bgColor = "bg-orange-500";
  else bgColor = "bg-red-500";

  return (
    <span
      className={`${bgColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}
    >
      {r}
    </span>
  );
}

function PlayerDot({ player, side }) {
  const img = `/api/sofascore/player/${player.player.id}/image`;
  const rating = player.avgRating || player.rating;
  
  // Decide badge color based on rating logic
  let badgeBg = "bg-slate-800";
  let displayValue = player.shirtNumber;
  let pxClass = "px-[5px]";

  if (rating) {
    displayValue = parseFloat(rating).toFixed(1);
    pxClass = "px-[4px]";
    const r = parseFloat(rating);
    if (r >= 7.5) badgeBg = "bg-emerald-600";
    else if (r >= 7.0) badgeBg = "bg-green-600";
    else if (r >= 6.5) badgeBg = "bg-yellow-600";
    else if (r >= 6.0) badgeBg = "bg-orange-500";
    else badgeBg = "bg-red-500";
  }

  return (
    <div className="flex flex-col items-center gap-0.5 w-16">
      <div className="relative mb-0.5">
        <img
          src={img}
          alt={player.player.shortName}
          className="w-10 h-10 rounded-full bg-slate-700 object-cover border-2 border-slate-600 shadow-sm"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 ${badgeBg} text-[10px] text-white font-bold h-4 flex items-center justify-center rounded-sm ${pxClass} border border-slate-900 shadow-md`}>
          {displayValue}
        </span>
      </div>
      <span className="text-[10px] text-slate-200 text-center leading-tight truncate w-full mt-1 drop-shadow-md">
        {getArabicName(player.player.shortName || player.player.name, player.player.fieldTranslations)}
      </span>
    </div>
  );
}

function groupByPosition(players) {
  const groups = { G: [], D: [], M: [], F: [] };
  players
    .filter((p) => !p.substitute)
    .forEach((p) => {
      const pos = p.position || p.player.position;
      if (groups[pos]) groups[pos].push(p);
    });
  return groups;
}

export default function LineupsView({ data, event }) {
  if (!data?.home || !data?.away) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-500 text-sm">
        التشكيلات غير متوفرة بعد
      </div>
    );
  }

  const homeGroups = groupByPosition(data.home.players);
  const awayGroups = groupByPosition(data.away.players);
  const homeFormation = data.home.formation;
  const awayFormation = data.away.formation;
  const confirmed = data.confirmed;

  const homeName = getArabicName(event?.homeTeam?.shortName || event?.homeTeam?.name || "Home", event?.homeTeam?.fieldTranslations);
  const awayName = getArabicName(event?.awayTeam?.shortName || event?.awayTeam?.name || "Away", event?.awayTeam?.fieldTranslations);
  const homeRating = data.home.players
    .filter((p) => !p.substitute && p.avgRating)
    .reduce((sum, p, _, a) => sum + p.avgRating / a.length, 0);
  const awayRating = data.away.players
    .filter((p) => !p.substitute && p.avgRating)
    .reduce((sum, p, _, a) => sum + p.avgRating / a.length, 0);

  // Pitch rows order: home goes GK → DEF → MID → FWD (top to bottom)
  // away goes FWD → MID → DEF → GK (top to bottom) — but we display both halves
  const homeRows = ["G", "D", "M", "F"];
  const awayRows = ["G", "D", "M", "F"];

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <h3 className="text-sm font-bold text-white mb-3">
        {confirmed ? "التشكيلات الأساسية" : "التشكيلات المتوقعة"}
      </h3>

      {/* Team info row */}
      <div className="flex items-center justify-between mb-3">
        <Link 
          href={event?.homeTeam?.id ? `/team/${event.homeTeam.slug || "team"}/${event.homeTeam.id}` : "#"}
          className="flex items-center gap-2 group"
        >
          <span className="text-sm font-semibold text-white group-hover:text-[#0aa674] transition-colors">{homeName}</span>
          {homeRating > 0 && (
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
              {homeRating.toFixed(2)}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-white">{homeFormation}</span>
          <span>—</span>
          <span className="font-semibold text-white">{awayFormation}</span>
        </div>
        <Link 
          href={event?.awayTeam?.id ? `/team/${event.awayTeam.slug || "team"}/${event.awayTeam.id}` : "#"}
          className="flex items-center gap-2 group"
        >
          {awayRating > 0 && (
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
              {awayRating.toFixed(2)}
            </span>
          )}
          <span className="text-sm font-semibold text-white group-hover:text-[#0aa674] transition-colors">{awayName}</span>
        </Link>
      </div>

      {/* Pitch */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a3a1a 0%, #163016 50%, #1a3a1a 100%)",
        }}
      >
        {/* Pitch markings */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/10" />
          {/* Top penalty area */}
          <div className="absolute top-0 left-1/4 right-1/4 h-12 border-b border-l border-r border-white/10 rounded-b-sm" />
          {/* Bottom penalty area */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-12 border-t border-l border-r border-white/10 rounded-t-sm" />
        </div>

        <div className="relative flex flex-col">
          {/* Home Team — top half */}
          <div className="flex flex-col items-center gap-6 py-6 px-2">
            {homeRows.map((pos) => (
              <div key={`home-${pos}`} className="flex justify-around w-full px-2 md:px-8">
                {homeGroups[pos]?.map((p) => (
                  <PlayerDot key={p.player.id} player={p} side="home" />
                ))}
              </div>
            ))}
          </div>

          {/* Away Team — bottom half */}
          <div className="flex flex-col items-center gap-6 py-6 px-2">
            {awayRows
              .slice()
              .reverse()
              .map((pos) => (
                <div key={`away-${pos}`} className="flex justify-around w-full px-2 md:px-8">
                  {awayGroups[pos]?.map((p) => (
                    <PlayerDot key={p.player.id} player={p} side="away" />
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
