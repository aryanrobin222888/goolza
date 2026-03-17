"use client";

const TYPE_LABELS = {
  missing: { text: "Out", color: "text-red-400", dot: "bg-red-500" },
  doubtful: { text: "Doubtful", color: "text-yellow-400", dot: "bg-yellow-500" },
  suspended: { text: "Suspended", color: "text-red-400", dot: "bg-red-500" },
};

function getTypeLabel(type, reason) {
  // reason 3 = suspension
  if (reason === 3) return TYPE_LABELS.suspended;
  return TYPE_LABELS[type] || TYPE_LABELS.missing;
}

function MissingPlayerRow({ mp }) {
  const imgUrl = `/api/sofascore/player/${mp.player.id}/image`;
  const label = getTypeLabel(mp.type, mp.reason);

  return (
    <div className="flex items-center gap-3 py-2">
      <img
        src={imgUrl}
        alt={mp.player.shortName}
        className="w-9 h-9 rounded-full bg-slate-700 object-cover border border-slate-600 flex-shrink-0"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">
          {mp.player.name}
        </p>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${label.dot}`} />
          <span className={`text-xs font-medium ${label.color}`}>
            {label.text}
          </span>
          {mp.description && (
            <span className="text-xs text-slate-500 truncate">
              · {mp.description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InjuriesSuspensions({ data }) {
  const homeMissing = data?.home?.missingPlayers || [];
  const awayMissing = data?.away?.missingPlayers || [];

  if (homeMissing.length === 0 && awayMissing.length === 0) return null;

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">
        Injuries and suspensions
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0">
          {homeMissing.map((mp) => (
            <MissingPlayerRow key={mp.player.id} mp={mp} />
          ))}
        </div>
        <div className="space-y-0">
          {awayMissing.map((mp) => (
            <MissingPlayerRow key={mp.player.id} mp={mp} />
          ))}
        </div>
      </div>
    </div>
  );
}
