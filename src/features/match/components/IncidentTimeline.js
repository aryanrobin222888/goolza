"use client";
import { getArabicName } from "@/features/schedule/utils/mappers";

function GoalRow({ inc }) {
  const isHome = inc.isHome;
  const minute = inc.addedTime ? `${inc.time}+${inc.addedTime}'` : `${inc.time}'`;
  const isPenalty = inc.incidentClass === "penalty";
  const isOwnGoal = inc.incidentClass === "ownGoal";
  const scorer = getArabicName(inc.player?.shortName || inc.player?.name || "", inc.player?.fieldTranslations);
  const assist = getArabicName(inc.assist1?.shortName || inc.assist1?.name || "", inc.assist1?.fieldTranslations);
  const score = `${inc.homeScore} - ${inc.awayScore}`;

  const content = (
    <div className={`flex flex-col justify-center min-w-0 ${isHome ? "items-start text-left" : "items-end text-right"}`}>
      <div className="flex items-center gap-1.5 min-w-0 max-w-full">
        <span className="text-sm font-semibold text-white truncate block">{scorer}</span>
        {isPenalty && <span className="text-[10px] text-yellow-400 font-medium">(Pen)</span>}
        {isOwnGoal && <span className="text-[10px] text-red-400 font-medium">(OG)</span>}
      </div>
      {assist && (
        <span className="text-xs text-slate-400 truncate block">
          Assist: {assist}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex items-stretch justify-between w-full py-2">
      {/* Home (Left) */}
      <div className="flex-1 flex justify-end pr-3">
        {isHome && content}
      </div>

      {/* Center (Score + Minute) */}
      <div className="w-16 flex flex-col items-center justify-center shrink-0">
        <span className="text-xs font-bold text-white bg-[#0aa674] rounded px-1.5 py-0.5 mb-1">
          {score}
        </span>
        <span className="text-[10px] text-slate-500">'{minute.replace("'", "")}</span>
      </div>

      {/* Away (Right) */}
      <div className="flex-1 flex justify-start pl-3">
        {!isHome && content}
      </div>
    </div>
  );
}

function CardRow({ inc }) {
  const isHome = inc.isHome;
  const minute = `${inc.time}'`;
  const color = inc.incidentClass === "yellow" ? "bg-yellow-400" : inc.incidentClass === "yellowRed" ? "bg-gradient-to-b from-yellow-400 to-red-500" : "bg-red-500";
  const name = getArabicName(inc.player?.shortName || inc.player?.name || inc.playerName || "", inc.player?.fieldTranslations);

  const content = (
    <div className={`flex items-center gap-2 max-w-full ${isHome ? "flex-row" : "flex-row-reverse"}`}>
      <span className={`w-3 h-4 rounded-[1px] ${color} flex-shrink-0`} />
      <span className="text-sm text-slate-300 truncate">{name}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-between w-full py-1.5">
      {/* Home (Left) */}
      <div className="flex-1 flex justify-end pr-4">
        {isHome && content}
      </div>
      
      {/* Center (Minute) */}
      <div className="w-16 flex justify-center shrink-0">
        <span className="text-[10px] text-slate-500">'{minute.replace("'", "")}</span>
      </div>

      {/* Away (Right) */}
      <div className="flex-1 flex justify-start pl-4">
        {!isHome && content}
      </div>
    </div>
  );
}

function SubRow({ inc }) {
  const isHome = inc.isHome;
  const minute = `${inc.time}'`;

  const content = (
    <div className={`flex flex-col min-w-0 ${isHome ? "items-start text-left" : "items-end text-right"}`}>
      <div className={`flex items-center gap-1 max-w-full ${isHome ? "flex-row" : "flex-row-reverse"}`}>
        <span className="text-emerald-400 text-[10px]">▲</span>
        <span className="text-[11px] font-medium text-slate-300 truncate">{getArabicName(inc.playerIn?.shortName || inc.playerIn?.name || "", inc.playerIn?.fieldTranslations)}</span>
      </div>
      <div className={`flex items-center gap-1 max-w-full ${isHome ? "flex-row" : "flex-row-reverse"}`}>
        <span className="text-red-400 text-[10px]">▼</span>
        <span className="text-[11px] text-slate-500 truncate">{getArabicName(inc.playerOut?.shortName || inc.playerOut?.name || "", inc.playerOut?.fieldTranslations)}</span>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-between w-full py-1.5">
      {/* Home (Left) */}
      <div className="flex-1 flex justify-end pr-4">
        {isHome && content}
      </div>
      
      {/* Center (Minute) */}
      <div className="w-16 flex justify-center shrink-0">
        <span className="text-[10px] text-slate-500">'{minute.replace("'", "")}</span>
      </div>

      {/* Away (Right) */}
      <div className="flex-1 flex justify-start pl-4">
        {!isHome && content}
      </div>
    </div>
  );
}

function PeriodSeparator({ inc }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-slate-700" />
      <span className="text-xs font-semibold text-slate-400">
        {inc.text} {inc.homeScore} - {inc.awayScore}
      </span>
      <div className="flex-1 h-px bg-slate-700" />
    </div>
  );
}

export default function IncidentTimeline({ data }) {
  const incidents = data?.incidents;
  if (!incidents || incidents.length === 0) return null;

  // Filter to meaningful incident types
  const filtered = incidents.filter((i) =>
    ["goal", "card", "substitution", "period"].includes(i.incidentType)
  );

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <div className="space-y-0">
        {filtered.map((inc, idx) => {
          switch (inc.incidentType) {
            case "goal":
              return <GoalRow key={inc.id || idx} inc={inc} />;
            case "card":
              return <CardRow key={inc.id || idx} inc={inc} />;
            case "substitution":
              return <SubRow key={inc.id || idx} inc={inc} />;
            case "period":
              return <PeriodSeparator key={`period-${idx}`} inc={inc} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
