"use client";

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
  return (
    <div className="flex flex-col items-center gap-0.5 w-14">
      <div className="relative">
        <img
          src={img}
          alt={player.player.shortName}
          className="w-8 h-8 rounded-full bg-slate-700 object-cover border border-slate-600"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span className="absolute -bottom-1 -right-1 bg-slate-800 text-[9px] text-white font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-600">
          {player.shirtNumber}
        </span>
      </div>
      {player.avgRating && (
        <RatingBadge rating={player.avgRating} />
      )}
      <span className="text-[9px] text-slate-300 text-center leading-tight truncate w-full">
        {player.player.shortName}
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
        Lineups not available yet
      </div>
    );
  }

  const homeGroups = groupByPosition(data.home.players);
  const awayGroups = groupByPosition(data.away.players);
  const homeFormation = data.home.formation;
  const awayFormation = data.away.formation;
  const confirmed = data.confirmed;

  const homeName = event?.homeTeam?.shortName || event?.homeTeam?.name || "Home";
  const awayName = event?.awayTeam?.shortName || event?.awayTeam?.name || "Away";
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
        {confirmed ? "Lineups" : "Possible lineups"}
      </h3>

      {/* Team info row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{homeName}</span>
          {homeRating > 0 && (
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
              {homeRating.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-white">{homeFormation}</span>
          <span>—</span>
          <span className="font-semibold text-white">{awayFormation}</span>
        </div>
        <div className="flex items-center gap-2">
          {awayRating > 0 && (
            <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
              {awayRating.toFixed(2)}
            </span>
          )}
          <span className="text-sm font-semibold text-white">{awayName}</span>
        </div>
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
          <div className="flex flex-col items-center gap-3 py-4 px-2">
            {homeRows.map((pos) => (
              <div key={`home-${pos}`} className="flex justify-center gap-2 flex-wrap">
                {homeGroups[pos]?.map((p) => (
                  <PlayerDot key={p.player.id} player={p} side="home" />
                ))}
              </div>
            ))}
          </div>

          {/* Away Team — bottom half */}
          <div className="flex flex-col items-center gap-3 py-4 px-2">
            {awayRows
              .slice()
              .reverse()
              .map((pos) => (
                <div key={`away-${pos}`} className="flex justify-center gap-2 flex-wrap">
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
