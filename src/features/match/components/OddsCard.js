"use client";
import { getArabicName } from "@/features/schedule/utils/mappers";

function fractionToDecimal(frac) {
  if (!frac) return "-";
  const parts = frac.split("/");
  if (parts.length !== 2) return frac;
  return (parseFloat(parts[0]) / parseFloat(parts[1]) + 1).toFixed(2);
}

function ChangeArrow({ change }) {
  if (change === -1) return <span className="text-emerald-400 text-[10px]">▼</span>;
  if (change === 1) return <span className="text-red-400 text-[10px]">▲</span>;
  return null;
}

export default function OddsCard({ data, event }) {
  const markets = data?.markets;
  if (!markets || markets.length === 0) return null;

  // Find 1X2 full-time market
  const fullTime = markets.find(
    (m) => m.marketId === 1 && m.marketName === "Full time"
  );
  if (!fullTime || !fullTime.choices || fullTime.choices.length < 3) return null;

  const homeName = getArabicName(event?.homeTeam?.shortName || event?.homeTeam?.name || "1", event?.homeTeam?.fieldTranslations);
  const awayName = getArabicName(event?.awayTeam?.shortName || event?.awayTeam?.name || "2", event?.awayTeam?.fieldTranslations);

  const homeChoice = fullTime.choices.find((c) => c.name === "1");
  const drawChoice = fullTime.choices.find((c) => c.name === "X");
  const awayChoice = fullTime.choices.find((c) => c.name === "2");

  const items = [
    { label: homeName, choice: homeChoice },
    { label: "Draw", choice: drawChoice },
    { label: awayName, choice: awayChoice },
  ];

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">Odds</h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ label, choice }) => (
          <div
            key={label}
            className="bg-slate-800/50 rounded-lg px-3 py-3 text-center"
          >
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-white">
                {fractionToDecimal(choice?.fractionalValue)}
              </span>
              {choice && <ChangeArrow change={choice.change} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
