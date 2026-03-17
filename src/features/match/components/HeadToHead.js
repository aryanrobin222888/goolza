"use client";

export default function HeadToHead({ data, event }) {
  const duel = data?.teamDuel;
  if (!duel) return null;

  const total = (duel.homeWins || 0) + (duel.draws || 0) + (duel.awayWins || 0);
  if (total === 0) return null;

  const homePct = ((duel.homeWins / total) * 100).toFixed(0);
  const drawPct = ((duel.draws / total) * 100).toFixed(0);
  const awayPct = ((duel.awayWins / total) * 100).toFixed(0);

  const homeName = event?.homeTeam?.shortName || event?.homeTeam?.name || "Home";
  const awayName = event?.awayTeam?.shortName || event?.awayTeam?.name || "Away";

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-1">
        Head-to-head
      </h3>
      <p className="text-xs text-slate-500 text-center mb-3">
        Last {total} matches
      </p>

      {/* Teams + counts */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{duel.homeWins}</p>
          <p className="text-xs text-slate-400">{homeName}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-400">{duel.draws}</p>
          <p className="text-xs text-slate-500">Draws</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{duel.awayWins}</p>
          <p className="text-xs text-slate-400">{awayName}</p>
        </div>
      </div>

      {/* Visual bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-800">
        {duel.homeWins > 0 && (
          <div
            className="bg-[#0aa674] transition-all"
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
