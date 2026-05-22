"use client";

import { Disc3 } from "lucide-react"; // Using Disc3 as a stand-in for a soccer ball

export default function AttackMomentum({ data, event, incidents }) {
  const points = data?.graphPoints;
  if (!points || points.length === 0) return null;

  const W = 400;
  const H = 140; // Increased height to accommodate borders/logos/icons
  const MID = H / 2;
  const maxVal = Math.max(...points.map((p) => Math.abs(p.value)), 1);
  const periodTime = data.periodTime || 45;
  const lastMinute = points[points.length - 1].minute || 90;

  // Bar width based on total minutes
  const barW = Math.max(W / (lastMinute + 5), 2); // subtle padding

  // Scale helpers
  const scaleX = (minute) => (minute / (lastMinute + 1)) * W;
  // Reduce height scale to leave some padding near top/bottom
  const scaleH = (value) => (Math.abs(value) / maxVal) * (MID - 5);

  const currentMinuteX = scaleX(points[points.length - 1].minute) + barW;

  const goals = incidents?.filter((i) => i.incidentType === "goal") || [];
  
  const homeLogo = event?.homeTeam?.id ? `/api/sofascore/team/${event.homeTeam.id}/image` : null;
  const awayLogo = event?.awayTeam?.id ? `/api/sofascore/team/${event.awayTeam.id}/image` : null;

  return (
    <div className="px-4 py-4 border-t border-slate-800/60">
      <h3 className="text-base font-bold text-white text-center mb-6">
        زخم الهجوم
      </h3>
      
      {/* Outer wrapper to place logos on the left and icons top/bottom */}
      <div className="relative pl-10 pt-6 pb-6 pr-2">
        {/* Home Team Logo */}
        {homeLogo && (
          <img 
            src={homeLogo} 
            alt="Home" 
            className="absolute left-1 top-[5px] w-7 h-7 object-contain"
            style={{ top: "calc(50% - 35px)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
        
        {/* Away Team Logo */}
        {awayLogo && (
          <img 
            src={awayLogo} 
            alt="Away" 
            className="absolute left-1 w-7 h-7 object-contain"
            style={{ top: "calc(50% + 5px)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}

        {/* Home Goals Icons */}
        {goals.filter(g => g.isHome).map((g, idx) => (
          <div 
            key={`hg-${idx}`}
            className="absolute flex items-center justify-center bg-[#ff7a00] rounded-full p-[2px] shadow shadow-black"
            style={{ left: `calc(40px + ${scaleX(g.time)}px - 8px)`, top: "-4px" }}
          >
            <Disc3 className="w-3.5 h-3.5 text-white" />
          </div>
        ))}

        {/* Away Goals Icons */}
        {goals.filter(g => !g.isHome).map((g, idx) => (
          <div 
            key={`ag-${idx}`}
            className="absolute flex items-center justify-center bg-[#6366f1] rounded-full p-[2px] shadow shadow-black"
            style={{ left: `calc(40px + ${scaleX(g.time)}px - 8px)`, bottom: "-4px" }}
          >
            <Disc3 className="w-3.5 h-3.5 text-white" />
          </div>
        ))}

        <div className="bg-[#1a1e23] rounded-sm overflow-hidden border border-slate-800 relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            preserveAspectRatio="none"
          >
            {/* Top Half Background (Home) */}
            <rect 
              x="0" y="0" width={currentMinuteX} height={MID} 
              fill="#223626" 
            />
            {/* Top Half Border */}
            <path 
              d={`M ${currentMinuteX} 0 L 0 0 L 0 ${MID}`} 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="2"
            />

            {/* Bottom Half Background (Away) */}
            <rect 
              x="0" y={MID} width={currentMinuteX} height={MID} 
              fill="#272a42" 
            />
            {/* Bottom Half Border */}
            <path 
              d={`M 0 ${MID} L 0 ${H} L ${currentMinuteX} ${H}`} 
              fill="none" 
              stroke="#6366f1" 
              strokeWidth="2"
            />

            {/* Current Minute Red Line */}
            <line
              x1={currentMinuteX} y1="0" x2={currentMinuteX} y2={H}
              stroke="#ef4444"
              strokeWidth="3"
            />

            {/* Bars */}
            {points.map((p, i) => {
              const x = scaleX(p.minute);
              const h = scaleH(p.value);
              if (p.value >= 0) {
                // Home (positive) → green bars going UP from center
                return (
                  <rect
                    key={i}
                    x={x}
                    y={MID - h}
                    width={barW}
                    height={h}
                    fill="#10b981"
                    rx="1"
                  />
                );
              } else {
                // Away (negative) → blue/purple bars going DOWN from center
                return (
                  <rect
                    key={i}
                    x={x}
                    y={MID}
                    width={barW}
                    height={h}
                    fill="#6366f1"
                    rx="1"
                  />
                );
              }
            })}

            {/* Center line */}
            <line
              x1="0" y1={MID} x2={W} y2={MID}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
