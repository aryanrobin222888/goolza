import React from "react";

const LEAGUE_TRANSLATIONS = {
  "Premier League": "الدوري الإنجليزي الممتاز",
  "La Liga": "الدوري الإسباني",
  "Bundesliga": "الدوري الألماني",
  "Serie A": "الدوري الإيطالي",
  "Ligue 1": "الدوري الفرنسي",
  "UEFA Champions League": "دوري أبطال أوروبا",
  "Champions League": "دوري أبطال أوروبا",
  "UEFA Europa League": "الدوري الأوروبي",
  "Europa League": "الدوري الأوروبي",
  "World Cup": "كأس العالم",
  "Saudi Pro League": "الدوري السعودي للمحترفين",
  "Egypt Premier League": "الدوري المصري الممتاز",
};

function translateLeague(leagueName) {
  if (!leagueName) return "بطولة أخرى";
  return LEAGUE_TRANSLATIONS[leagueName] || leagueName;
}

export default function HeadToHeadWidget({ h2hData, homeTeam, awayTeam }) {
  if (!h2hData || !h2hData.response || h2hData.response.length === 0) {
    return null;
  }

  const fixtures = h2hData.response.slice(0, 5); // Get last 5 encounters
  const totalMatches = h2hData.response.length;

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let totalGoals = 0;

  h2hData.response.forEach((item) => {
    const homeGoals = item.goals.home ?? 0;
    const awayGoals = item.goals.away ?? 0;
    totalGoals += homeGoals + awayGoals;

    if (homeGoals > awayGoals) {
      const winnerId = String(item.teams.home.id);
      if (winnerId === String(homeTeam.id)) {
        homeWins++;
      } else if (winnerId === String(awayTeam.id)) {
        awayWins++;
      }
    } else if (awayGoals > homeGoals) {
      const winnerId = String(item.teams.away.id);
      if (winnerId === String(homeTeam.id)) {
        homeWins++;
      } else if (winnerId === String(awayTeam.id)) {
        awayWins++;
      }
    } else {
      draws++;
    }
  });

  const homeWinsPercent = totalMatches ? Math.round((homeWins / totalMatches) * 100) : 0;
  const awayWinsPercent = totalMatches ? Math.round((awayWins / totalMatches) * 100) : 0;
  const drawsPercent = totalMatches ? Math.round((draws / totalMatches) * 100) : 0;
  const avgGoals = totalMatches ? (totalGoals / totalMatches).toFixed(1) : "0.0";

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-emerald-500/20 shadow-sm p-6 space-y-6 w-full text-right" dir="rtl">
      {/* Widget Title */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          تاريخ المواجهات المباشرة (H2H)
        </h3>
        <span className="text-xs text-slate-400 font-medium bg-slate-800/60 px-3 py-1 rounded-full border border-emerald-500/10">
          {totalMatches} مباراة سابقة
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Win/Loss Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>فوز {homeTeam.name} ({homeWins})</span>
            <span className="text-slate-400">تعادل ({draws})</span>
            <span>فوز {awayTeam.name} ({awayWins})</span>
          </div>
          
          {/* Multi-segment progress bar */}
          <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden flex border border-slate-800">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${homeWinsPercent}%` }} title={`فوز ${homeTeam.name}: ${homeWinsPercent}%`} />
            <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${drawsPercent}%` }} title={`تعادل: ${drawsPercent}%`} />
            <div className="bg-emerald-900 h-full transition-all duration-500" style={{ width: `${awayWinsPercent}%` }} title={`فوز ${awayTeam.name}: ${awayWinsPercent}%`} />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>{homeWinsPercent}%</span>
            <span>{drawsPercent}%</span>
            <span>{awayWinsPercent}%</span>
          </div>
        </div>

        {/* Goal Stats */}
        <div className="bg-slate-950/40 rounded-xl p-4 border border-emerald-500/10 flex items-center justify-around text-center">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">معدل الأهداف</span>
            <p className="text-2xl font-black text-emerald-400">{avgGoals}</p>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div className="space-y-1">
            <span className="text-xs text-slate-400">إجمالي الأهداف</span>
            <p className="text-2xl font-black text-white">{totalGoals}</p>
          </div>
        </div>
      </div>

      {/* Last 5 Encounters */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-300">آخر 5 مواجهات مباشرة</h4>
        <div className="divide-y divide-slate-800/40 border border-slate-850 rounded-xl overflow-hidden bg-slate-950/20">
          {fixtures.map((item) => {
            const dateStr = item.fixture.date ? item.fixture.date.split("T")[0] : "";
            const isHomeCurrent = String(item.teams.home.id) === String(homeTeam.id);
            const isAwayCurrent = String(item.teams.away.id) === String(awayTeam.id);

            const homeDisplayName = isHomeCurrent ? homeTeam.name : (isAwayCurrent ? awayTeam.name : item.teams.home.name);
            const awayDisplayName = isAwayCurrent ? awayTeam.name : (isHomeCurrent ? homeTeam.name : item.teams.away.name);

            const homeScore = item.goals.home ?? 0;
            const awayScore = item.goals.away ?? 0;

            let scoreColor = "text-slate-300 bg-slate-800/80 border border-slate-750";

            return (
              <div key={item.fixture.id} className="flex flex-col sm:flex-row items-center justify-between p-3.5 gap-3 transition-colors hover:bg-emerald-950/10">
                {/* Meta info (Date + League) */}
                <div className="flex items-center gap-2.5 text-xs text-slate-400 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="font-mono">{dateStr}</span>
                  <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:inline" />
                  <span className="font-medium text-slate-400 bg-slate-800/40 px-2.5 py-0.5 rounded-full border border-slate-800/50">
                    {translateLeague(item.league.name)}
                  </span>
                </div>

                {/* Scoreline */}
                <div className="flex items-center justify-center gap-4 w-full sm:w-auto max-w-md flex-1">
                  {/* Home Team */}
                  <span className={`text-sm text-left flex-1 truncate ${homeScore > awayScore ? "font-bold text-emerald-400" : "text-slate-400"}`}>
                    {homeDisplayName}
                  </span>

                  {/* Score */}
                  <div className={`px-3 py-1 rounded-lg text-sm font-black font-mono shrink-0 ${scoreColor}`}>
                    {homeScore} - {awayScore}
                  </div>

                  {/* Away Team */}
                  <span className={`text-sm text-right flex-1 truncate ${awayScore > homeScore ? "font-bold text-emerald-400" : "text-slate-400"}`}>
                    {awayDisplayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
