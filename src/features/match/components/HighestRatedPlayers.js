"use client";

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
        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
      </div>
      <RatingBadge rating={entry.value} />
    </div>
  );
}

export default function HighestRatedPlayers({ data }) {
  if (!data?.bestHomeTeamPlayers && !data?.bestAwayTeamPlayers) return null;

  const home = data.bestHomeTeamPlayers || [];
  const away = data.bestAwayTeamPlayers || [];

  if (home.length === 0 && away.length === 0) return null;

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">
        Highest-rated players
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {home.map((entry) => (
            <PlayerRow key={entry.player.id} entry={entry} align="left" />
          ))}
        </div>
        <div>
          {away.map((entry) => (
            <PlayerRow key={entry.player.id} entry={entry} align="right" />
          ))}
        </div>
      </div>
    </div>
  );
}
