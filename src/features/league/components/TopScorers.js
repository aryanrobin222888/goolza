"use client";

import { useState } from "react";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";
import { Trophy } from "lucide-react";

function PlayerPhoto({ playerId, name }) {
  const [err, setErr] = useState(false);
  if (err || !playerId)
    return (
      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400">
        {name?.[0] ?? "?"}
      </div>
    );
  return (
    <img
      src={`/api/sofascore/player/${playerId}/image`}
      alt={name}
      width={40}
      height={40}
      className="w-10 h-10 rounded-full object-cover bg-slate-800 border border-slate-700"
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

function TeamBadge({ teamId, name }) {
  const [err, setErr] = useState(false);
  if (err || !teamId)
    return <span className="text-[10px] text-slate-500">{name?.[0]}</span>;
  return (
    <img
      src={`/api/sofascore/team/${teamId}/image`}
      alt={name}
      width={18}
      height={18}
      className="w-[18px] h-[18px] object-contain"
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

export default function TopScorers({ scorers }) {
  // ── Empty / early-season fallback ─────────────────────────────────────────
  if (!scorers?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white">هدافو الموسم</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">
          <span className="text-3xl">⏳</span>
          <p className="text-sm text-slate-400 font-medium">
            ستكون الإحصائيات متاحة بعد انطلاق أولى مباريات الموسم
          </p>
        </div>
      </div>
    );
  }

  const top10 = scorers.slice(0, 10);
  const maxGoals = top10[0]?.goals ?? 1;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800 bg-slate-900/80">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h2 className="text-sm font-bold text-white">هدافو الموسم</h2>
      </div>

      <div className="divide-y divide-slate-800/60">
        {top10.map((entry, idx) => {
          const player = entry.player;
          const team = entry.team;
          // Statistics endpoint: goals is a direct field on each result entry
          const goals = entry.goals ?? 0;
          const barWidth = maxGoals > 0 ? Math.round((goals / maxGoals) * 100) : 0;

          return (
            <div
              key={player?.id ?? idx}
              className="px-4 py-3 hover:bg-slate-800/40 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span
                  className={`shrink-0 w-5 text-center tabular-nums text-xs font-black ${
                    idx === 0
                      ? "text-amber-400"
                      : idx === 1
                      ? "text-slate-300"
                      : idx === 2
                      ? "text-amber-700"
                      : "text-slate-600"
                  }`}
                >
                  {idx + 1}
                </span>

                {/* Photo */}
                <PlayerPhoto playerId={player?.id} name={player?.name} />

                {/* Name + Team */}
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-[13px] text-white truncate max-w-[140px] group-hover:text-[#0aa674] transition-colors leading-tight">
                    {getArabicName(player?.shortName || player?.name, player?.fieldTranslations)}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Link 
                      href={team?.id ? `/team/${team.slug || "team"}/${team.id}` : "#"}
                      className="flex items-center gap-1 hover:text-[#0aa674] transition-colors"
                    >
                      <TeamBadge teamId={team?.id} name={team?.name} />
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] hover:text-[#0aa674]">
                        {getArabicName(team?.shortName || team?.name, team?.fieldTranslations)}
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Goals */}
                <div className="shrink-0 text-right">
                  <span className="text-lg font-black text-[#0aa674] tabular-nums">
                    {goals}
                  </span>
                  <span className="text-[10px] text-slate-600 block leading-none">
                    هدف
                  </span>
                </div>
              </div>

              {/* Goal bar */}
              <div className="mt-2 h-0.5 bg-slate-800 rounded-full overflow-hidden mx-8">
                <div
                  className="h-full bg-gradient-to-r from-[#0aa674] to-[#34d399] rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
