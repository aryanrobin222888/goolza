"use client";

export default function RefereeCard({ event }) {
  const referee = event?.referee;
  if (!referee) return null;

  const totalGames = referee.games || 1;
  const avgYellow = ((referee.yellowCards || 0) / totalGames).toFixed(2);
  const avgRed = ((referee.redCards || 0) / totalGames).toFixed(2);

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">Referee</h3>
      <div className="flex items-center justify-center gap-3">
        {referee.country?.alpha2 && (
          <img
            src={`https://flagcdn.com/24x18/${referee.country.alpha2.toLowerCase()}.png`}
            alt={referee.country.name}
            className="w-5 h-4 object-cover rounded-sm"
          />
        )}
        <span className="text-sm font-semibold text-white">{referee.name}</span>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-400">
        <span>Avg cards</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-3 bg-yellow-400 rounded-[1px] inline-block" />
          {avgYellow}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-3 bg-red-500 rounded-[1px] inline-block" />
          {avgRed}
        </span>
      </div>
    </div>
  );
}
