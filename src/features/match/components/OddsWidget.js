import React from "react";

function getMatchWinnerOdds(oddsData) {
  const bookmaker = oddsData?.response?.[0]?.bookmakers?.[0];
  if (!bookmaker) return null;

  const bet = bookmaker.bets?.find(b => b.id === 1 || b.name === "Match Winner");
  if (!bet) return null;

  const home = bet.values.find(v => v.value === "Home")?.odd;
  const draw = bet.values.find(v => v.value === "Draw")?.odd;
  const away = bet.values.find(v => v.value === "Away")?.odd;

  return {
    bookmakerName: bookmaker.name,
    home,
    draw,
    away
  };
}

export default function OddsWidget({ oddsData, homeTeam, awayTeam }) {
  const odds = getMatchWinnerOdds(oddsData);
  if (!odds) return null;

  return (
    <div className="bg-slate-900/45 backdrop-blur-md rounded-2xl border border-emerald-500/20 shadow-sm p-6 space-y-4 w-full text-right" dir="rtl">
      {/* Widget Title */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          احتمالات نتيجة المباراة (1X2)
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold bg-slate-800/60 px-2.5 py-1 rounded-full border border-emerald-500/10">
          محدثة
        </span>
      </div>

      {/* Odds Boxes */}
      <div className="grid grid-cols-3 gap-3">
        {/* Home Odd */}
        <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-850 hover:border-emerald-500/30 transition-all flex flex-col items-center justify-center text-center gap-1">
          <span className="text-xs text-slate-400 font-medium truncate w-full">{homeTeam.name}</span>
          <span className="text-lg font-black text-emerald-400 font-mono">{odds.home || "-"}</span>
        </div>

        {/* Draw Odd */}
        <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-850 hover:border-slate-700 transition-all flex flex-col items-center justify-center text-center gap-1">
          <span className="text-xs text-slate-400 font-medium">تعادل</span>
          <span className="text-lg font-black text-slate-300 font-mono">{odds.draw || "-"}</span>
        </div>

        {/* Away Odd */}
        <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-850 hover:border-emerald-950 transition-all flex flex-col items-center justify-center text-center gap-1">
          <span className="text-xs text-slate-400 font-medium truncate w-full">{awayTeam.name}</span>
          <span className="text-lg font-black text-emerald-500 font-mono">{odds.away || "-"}</span>
        </div>
      </div>

      {/* Bookmaker Info */}
      <div className="flex justify-between items-center text-[10px] text-slate-500">
        <span>* الاحتمالات خاضعة للتغيير</span>
        <span>المنصة: {odds.bookmakerName}</span>
      </div>
    </div>
  );
}
