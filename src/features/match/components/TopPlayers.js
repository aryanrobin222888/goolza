"use client";

import { useState } from "react";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

const PAGE_SIZE = 5;

function PlayerRow({ rank, player, rating }) {
  const imgUrl = `/api/sofascore/player/${player.id}/image`;
  const posLabel = { G: "Goalkeeper", D: "Defender", M: "Midfielder", F: "Forward" }[
    player.position
  ] || player.position;

  let ratingBg = "bg-slate-700";
  const r = parseFloat(rating);
  if (r >= 7.5) ratingBg = "bg-emerald-600";
  else if (r >= 7.0) ratingBg = "bg-green-600";
  else if (r >= 6.5) ratingBg = "bg-yellow-600";
  else if (r >= 6.0) ratingBg = "bg-orange-500";

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs text-slate-500 w-4 text-center font-medium">
        {rank}
      </span>
      <img
        src={imgUrl}
        alt={player.shortName}
        className="w-8 h-8 rounded-full bg-slate-700 object-cover border border-slate-600 flex-shrink-0"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">
          {getArabicName(player.name, player.fieldTranslations)}
        </p>
        <p className="text-xs text-slate-400">{posLabel}</p>
      </div>
      <span
        className={`${ratingBg} text-white text-xs font-bold px-2 py-0.5 rounded`}
      >
        {parseFloat(rating).toFixed(2)}
      </span>
    </div>
  );
}

function TopPlayersColumn({ players, team }) {
  const [page, setPage] = useState(0);

  const sorted = [...players]
    .filter((p) => p.avgRating)
    .sort((a, b) => b.avgRating - a.avgRating);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const slice = sorted.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex-1 min-w-0">
      {team && (
        <div className="flex justify-center mb-3">
          <Link href={`/team/${team.slug || "team"}/${team.id}`}>
            <img 
              src={`/api/sofascore/team/${team.id}/image`}
              alt={team.name}
              className="w-8 h-8 object-contain hover:scale-110 transition-transform"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </Link>
        </div>
      )}
      {slice.map((p, i) => (
        <PlayerRow
          key={p.player.id}
          rank={start + i + 1}
          player={p.player}
          rating={p.avgRating}
        />
      ))}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2 px-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-xs text-slate-500">
            {start + 1}-{Math.min(start + PAGE_SIZE, sorted.length)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopPlayers({ data, event }) {
  if (!data?.home?.players && !data?.away?.players) return null;

  const homePlayers = data.home?.players || [];
  const awayPlayers = data.away?.players || [];

  if (homePlayers.length === 0 && awayPlayers.length === 0) return null;

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">
        أفضل اللاعبين
      </h3>
      <div className="flex gap-4">
        <TopPlayersColumn players={homePlayers} team={event?.homeTeam} />
        <TopPlayersColumn players={awayPlayers} team={event?.awayTeam} />
      </div>
    </div>
  );
}

