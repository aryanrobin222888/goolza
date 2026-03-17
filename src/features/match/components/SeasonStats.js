"use client";

function StatRow({ label, homeValue, awayValue }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
      <span className="text-sm text-white font-medium w-1/3 text-right tabular-nums">
        {homeValue}
      </span>
      <span className="text-xs text-slate-400 text-center flex-1">{label}</span>
      <span className="text-sm text-white font-medium w-1/3 text-left tabular-nums">
        {awayValue}
      </span>
    </div>
  );
}

export default function SeasonStats({ event, homeStats, awayStats }) {
  if (!homeStats && !awayStats) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500 text-sm">
        Season statistics not available
      </div>
    );
  }

  const home = event?.homeTeam;
  const away = event?.awayTeam;

  const hs = homeStats || {};
  const as = awayStats || {};

  const homeMatches = hs.matches || 0;
  const awayMatches = as.matches || 0;
  const homeGpg = homeMatches
    ? ((hs.goalsScored || 0) / homeMatches).toFixed(1)
    : "0";
  const awayGpg = awayMatches
    ? ((as.goalsScored || 0) / awayMatches).toFixed(1)
    : "0";
  const homePoss =
    hs.averageBallPossession != null
      ? `${hs.averageBallPossession.toFixed(1)}%`
      : "-";
  const awayPoss =
    as.averageBallPossession != null
      ? `${as.averageBallPossession.toFixed(1)}%`
      : "-";

  const homeRating = hs.avgRating ? hs.avgRating.toFixed(2) : "-";
  const awayRating = as.avgRating ? as.avgRating.toFixed(2) : "-";
  const homeRank = hs.matches ? `Ranked in selected competition/year` : "";
  const awayRank = as.matches ? `Ranked in selected competition/year` : "";

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-4">
        Season statistics
      </h3>

      {/* Avg Rating Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-400">Average Sofascore Rating</p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {home && (
              <img
                src={`/api/sofascore/team/${home.id}/image`}
                alt={home.shortName}
                className="w-5 h-5 object-contain"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
              {homeRating}
            </span>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 justify-end">
            <p className="text-xs text-slate-400">Average Sofascore Rating</p>
          </div>
          <div className="flex items-center gap-2 mt-1 justify-end">
            <span className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded">
              {awayRating}
            </span>
            {away && (
              <img
                src={`/api/sofascore/team/${away.id}/image`}
                alt={away.shortName}
                className="w-5 h-5 object-contain"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats Table */}
      <div className="bg-slate-800/30 rounded-xl px-3 py-1">
        <StatRow label="Matches" homeValue={hs.matches || 0} awayValue={as.matches || 0} />
        <StatRow label="Goals scored" homeValue={hs.goalsScored || 0} awayValue={as.goalsScored || 0} />
        <StatRow label="Goals per game" homeValue={homeGpg} awayValue={awayGpg} />
        <StatRow label="Goals conceded" homeValue={hs.goalsConceded || 0} awayValue={as.goalsConceded || 0} />
        <StatRow label="Clean sheets" homeValue={hs.cleanSheets || 0} awayValue={as.cleanSheets || 0} />
        <StatRow label="Assists" homeValue={hs.assists || 0} awayValue={as.assists || 0} />
        <StatRow label="Ball possession" homeValue={homePoss} awayValue={awayPoss} />
      </div>
    </div>
  );
}
