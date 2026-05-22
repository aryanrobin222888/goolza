import Link from "next/link";
import { fetchFromSofaScore } from "@/lib/sofascore";
import { getArabicTeamName } from "@/lib/teamTranslations";

export default async function WorldCupGroups() {
  let groups = [];
  try {
    const { data } = await fetchFromSofaScore(
      "https://api.sofascore.com/api/v1/unique-tournament/16/season/58210/standings/total"
    );
    groups = data?.standings || [];
  } catch (err) {
    console.warn("[WorldCupGroups] Failed to fetch WC groups");
  }

  if (groups.length === 0) {
    return (
       <div className="w-full max-w-7xl px-4 md:px-8 mx-auto mt-6 mb-20" dir="rtl">
         <div className="py-24 border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-5 shadow-2xl relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(20px)" }}>
           {/* Center glow */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"/>
           
           <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-lg"
                style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-pulse"/>
              <span className="text-2xl drop-shadow-md">⏳</span>
           </div>
           
           <div className="text-center">
             <h3 className="text-xl font-black text-white mb-2">في انتظار سحب القرعة</h3>
             <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
               ستظهر تفاصيل ومراكز المجموعات فور سحب القرعة وتحديد تصنيفات المنتخبات للمونديال.
             </p>
           </div>
         </div>
       </div>
    );
  }

  return (
    <div className="w-full max-w-7xl px-4 md:px-8 mx-auto mt-8 mb-24" dir="rtl">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group, idx) => (
          <div key={idx} className="rounded-2xl overflow-hidden group/card relative"
               style={{
                 background: "rgba(255,255,255,0.015)",
                 border: "1px solid rgba(255,255,255,0.06)",
                 boxShadow: "0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.02)",
                 transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
               }}>
            
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 via-transparent to-cyan-400/0 group-hover/card:from-emerald-400/5 group-hover/card:to-cyan-400/5 transition-colors duration-500 pointer-events-none"/>
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none transform -rotate-45"/>

            {/* Header */}
            <div className="px-5 py-3.5 border-b flex justify-between items-center relative z-10"
                 style={{ borderBottomColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
               <span className="font-black text-sm tracking-wide"
                     style={{
                       background: "linear-gradient(90deg, #fff, #94a3b8)",
                       WebkitBackgroundClip: "text",
                       WebkitTextFillColor: "transparent"
                     }}>
                 {group.name || `المجموعة ${idx + 1}`}
               </span>
            </div>

            {/* Table */}
            <div className="relative z-10 overflow-x-auto scrollbar-hide">
              <table className="w-full text-xs text-slate-300">
                <thead>
                  <tr className="text-slate-500 font-bold"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <th className="py-3 px-4 text-right w-8">#</th>
                    <th className="py-3 px-2 text-right">المنتخب</th>
                    <th className="py-3 px-2 text-center w-8" title="لعب">ل</th>
                    <th className="py-3 px-2 text-center w-10" title="فارق الأهداف">ف.أ</th>
                    <th className="py-3 px-4 text-center text-white w-12">نقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows?.map((row, rIdx) => {
                    const isTopTwo = row.position <= 2;
                    const isThird = row.position === 3;
                    
                    return (
                      <tr key={row.team?.id} className="transition-colors group/row"
                          style={{
                            borderBottom: rIdx === group.rows.length - 1 ? "none" : "1px solid rgba(255,255,255,0.03)",
                            background: "transparent"
                          }}>
                        
                        {/* Position */}
                        <td className="py-3.5 px-4 relative">
                          {/* Indicator Bar */}
                          {isTopTwo && (
                            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-cyan-400 opacity-60 rounded-l-full" />
                          )}
                          {isThird && (
                            <div className="absolute right-0 top-[15%] bottom-[15%] w-[3px] bg-amber-400 opacity-40 rounded-l-full" />
                          )}
                          
                          <span className="w-5 text-center font-black tabular-nums transition-colors"
                                style={{ color: isTopTwo ? "#22d3ee" : isThird ? "#fbbf24" : "rgba(148,163,184,0.5)" }}>
                            {row.position}
                          </span>
                        </td>
                        
                        {/* Team */}
                        <td className="py-3.5 px-2">
                           <Link 
                             href={row.team?.id ? `/team/${row.team.slug || "team"}/${row.team.id}` : "#"}
                             className="flex items-center gap-3 group/link"
                           >
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#060b19] ring-1 ring-white/10 shadow-md group-hover/link:ring-white/30 transition-all shrink-0">
                                <img 
                                  src={`/api/sofascore/team/${row.team?.id}/image`} 
                                  alt={row.team?.name} 
                                  className="w-full h-full object-contain p-0.5"
                                  loading="lazy"
                                />
                              </div>
                              <span className="font-bold text-slate-200 group-hover/link:text-emerald-400 transition-colors truncate max-w-[110px]">
                                {getArabicTeamName(row.team?.shortName || row.team?.name)}
                              </span>
                           </Link>
                        </td>
                        
                        {/* Matches Played */}
                        <td className="py-3.5 px-2 text-center tabular-nums font-semibold text-slate-500">
                          {row.matches}
                        </td>
                        
                        {/* Goal Diff */}
                        <td className="py-3.5 px-2 text-center tabular-nums font-semibold text-slate-500">
                          {row.scoresFor - row.scoresAgainst > 0 ? `+${row.scoresFor - row.scoresAgainst}` : row.scoresFor - row.scoresAgainst}
                        </td>
                        
                        {/* Points */}
                        <td className="py-3.5 px-4 text-center font-black tabular-nums"
                            style={{ 
                              background: "rgba(255,255,255,0.02)",
                              color: isTopTwo ? "#fff" : "rgba(255,255,255,0.7)"
                            }}>
                          {row.points}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
