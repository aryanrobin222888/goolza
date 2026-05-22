"use client";
import { m } from "framer-motion";
import { Tv } from "lucide-react";
import Link from "next/link";
import MatchStatus from "./MatchStatus";
import { useRouter } from "next/navigation";
import { generateMatchSlug } from "@/lib/matchSlug";
import { useLocalTime } from "@/hooks/useLocalTime";

export default function MatchRow({
  match,
  index,
  isSelected,
  onClick,
  tournamentLogo,
  selectedDate,
}) {
  const router = useRouter();
  const localTime = useLocalTime(match.startTime, match.time);

  // Calculate isLive and isFinished based on time if status is not explicit
  let isLive = match.status === "LIVE";
  let isFinished = match.status === "ENDED" || match.status === "finished";

  if (!isLive && !isFinished && match.startTime) {
      const now = new Date();
      let start = new Date(match.startTime);
      
      // Fallback if startTime is invalid
      if (isNaN(start.getTime()) && selectedDate && match.time) {
          const dateStr = selectedDate.toISOString().split('T')[0];
          start = new Date(`${dateStr}T${match.time}:00`);
      }

      if (!isNaN(start.getTime())) {
         const duration = 120; // default duration in minutes (2 hours fallback)
         const end = new Date(start.getTime() + duration * 60 * 1000);
         
         if (now >= start && now <= end) {
             isLive = true;
         } else if (now > end) {
             isFinished = true;
         }
      }
  }

  const handleTeamClick = (e, team) => {
    e.preventDefault();
    e.stopPropagation();
    if (team?.id) {
      router.push(`/team/${team.slug || "team"}/${team.id}`);
    }
  };

  const handleMatchClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/match/${generateMatchSlug(match)}`);
    }
  };

  const content = (
    <div className="flex items-center justify-between gap-3 relative z-10 w-full">
        {/* Home */}
        <div 
          className="flex flex-col md:flex-row items-center md:items-center justify-start gap-3 flex-1 min-w-0 group/team cursor-pointer"
          onClick={(e) => handleTeamClick(e, match.home)}
        >
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 bg-slate-800 rounded-full border border-slate-700 shadow-sm overflow-hidden group-hover/team:scale-110 transition-transform">
            {match.home?.logo ? (
              <img
                src={match.home.logo}
                alt={match.home.name || "Home Team"}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = '<span class="text-xs">⚽</span>';
                }}
              />
            ) : (
              <span className="text-xs">⚽</span>
            )}
          </div>
          <span className="text-white font-semibold text-sm truncate text-center md:text-left transition-colors group-hover/team:text-[#ff7a00]">
            {match.home.name}
          </span>
        </div>

        {/* Center - Score/Time */}
        <div className="flex flex-col items-center justify-center shrink-0 w-24 md:w-32">
          <div className="mb-1">
            {isLive || isFinished ? ( 
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-white">{match.home.score ?? 0}</span>
                <span className="text-slate-400 text-lg mx-1">:</span>
                <span className="text-2xl font-bold text-white">{match.away.score ?? 0}</span>
              </div>
            ) : (
              <div className="text-lg font-bold text-white bg-slate-800 px-3 py-1 rounded-md group-hover:bg-slate-700 transition-colors">
                {localTime}
              </div>
            )}
          </div>
          <MatchStatus
            startTime={match.startTime}
            matchTime={match.time}
            matchDate={selectedDate}
            status={match.status}
          />
        </div>

        {/* Away */}
        <div 
          className="flex flex-col-reverse md:flex-row items-center md:items-center justify-end gap-3 flex-1 min-w-0 group/team cursor-pointer"
          onClick={(e) => handleTeamClick(e, match.away)}
        >
          <span className="text-white font-semibold text-sm truncate text-center md:text-right transition-colors group-hover/team:text-[#ff7a00]">
            {match.away.name}
          </span>
           <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 bg-slate-800 rounded-full border border-slate-700 shadow-sm overflow-hidden group-hover/team:scale-110 transition-transform">
            {match.away?.logo ? (
              <img
                src={match.away.logo}
                alt={match.away.name || "Away Team"}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = '<span class="text-xs">⚽</span>';
                }}
              />
            ) : (
              <span className="text-xs">⚽</span>
            )}
          </div>
        </div>
      </div>
  );

  const classes = `relative p-4 rounded-xl border transition-all duration-300 group mb-3
    bg-[#1e293b]
    ${isSelected ? "border-[#ff7a00] ring-1 ring-[#ff7a00] shadow-md" : "border-slate-800 shadow-sm hover:border-slate-700"}
    cursor-pointer
  `;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const interactiveProps = {
    variants: itemVariants,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    className: classes,
    layout: true,
    onClick: handleMatchClick
  };

  return (
    <m.div {...interactiveProps} className={`${interactiveProps.className} overflow-hidden`}>
         {/* Meta row: inline on mobile, absolute on desktop */}
         <div className="flex items-center justify-between mb-2 md:hidden text-[10px] text-slate-400">
           <div className="flex items-center gap-1.5">
              {match.tournamentId && tournamentLogo ? (
                <div className="relative w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center p-0.5 shadow-sm shrink-0">
                  <img 
                     src={tournamentLogo} 
                     alt="Tournament Logo" 
                     width={16}
                     height={16}
                     loading="lazy"
                     decoding="async"
                     className="w-full h-full object-contain p-0.5" 
                     referrerPolicy="no-referrer"
                   />
                </div>
              ) : null}
             <span className="uppercase tracking-wider font-semibold truncate max-w-[100px]">{match.league}</span>
           </div>
           {match.channel && (
             <div className="flex items-center gap-1">
               <Tv className="w-3 h-3 shrink-0" />
               <span className="truncate max-w-[110px]">{match.channel}</span>
             </div>
           )}
         </div>

         {/* Desktop absolute overlays */}
         <div className="hidden md:flex absolute bottom-2 left-4 items-center gap-2 text-[10px] text-white z-10">
             {match.tournamentId && tournamentLogo ? (
                 <div className="relative w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center p-0.5 shadow-sm">
                   <img 
                      src={tournamentLogo} 
                      alt="Tournament Logo" 
                      width={20}
                      height={20}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-0.5" 
                      referrerPolicy="no-referrer"
                    />
                 </div>
             ) : null}
             <span className="uppercase tracking-wider font-semibold">{match.league}</span>
         </div>
         {match.channel && (
             <div className="hidden md:flex absolute bottom-2 right-4 items-center gap-1 text-[10px] text-slate-300 z-10">
                 <Tv className="w-3 h-3" /> {match.channel}
             </div>
         )}

         <div className="md:pb-4">{content}</div>

         {/* Hover Overlay - Watch Now */}
         <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-50">
              <span className={`
                ${isLive ? "bg-[#e50b0b] hover:bg-[#c90a0a]" : "bg-slate-800 hover:bg-slate-900"} 
                text-white font-bold py-2 px-8 rounded-lg shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300 ring-1 ring-white/20 whitespace-nowrap
              `}>
                {isLive ? "شاهد المباراة الان" : isFinished ? "انتهت" : "لم تبدأ بعد"}
              </span>
         </div>
    </m.div>
  );
}
