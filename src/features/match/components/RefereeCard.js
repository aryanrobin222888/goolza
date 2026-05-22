"use client";
import { getArabicName } from "@/features/schedule/utils/mappers";

export default function RefereeCard({ event }) {
  const referee = event?.referee;
  if (!referee) return null;

  const totalGames = referee.games || 1;
  const avgYellow = ((referee.yellowCards || 0) / totalGames).toFixed(2);
  const avgRed = ((referee.redCards || 0) / totalGames).toFixed(2);

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">الحكم</h3>
      <div className="flex items-center justify-center gap-3">
        {referee.country?.alpha2 && (
          <img
            src={`https://flagcdn.com/24x18/${referee.country.alpha2.toLowerCase()}.png`}
            alt={getArabicName(referee.country.name, referee.country.fieldTranslations)}
            className="w-5 h-4 object-cover rounded-sm"
          />
        )}
        <span className="text-sm font-semibold text-white">{getArabicName(referee.name, referee.fieldTranslations)}</span>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-400">
        <span>متوسط البطاقات</span>
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
