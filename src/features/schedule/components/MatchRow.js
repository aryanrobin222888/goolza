"use client";
import { motion } from "framer-motion";
import { Tv } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MatchStatus from "./MatchStatus";
import { generateMatchSlug } from "@/lib/matchSlug";

export default function MatchRow({
  match,
  index,
  isSelected,
  onClick,
  tournamentLogo,
  selectedDate,
}) {
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
         const duration = 120; // default duration in minutes
         const end = new Date(start.getTime() + duration * 60 * 1000);
         
         if (now >= start && now <= end) {
             isLive = true;
         } else if (now > end) {
             isFinished = true;
         }
      }
  }

  const content = (
    <div className="flex items-center justify-between gap-3 relative z-10 w-full">
        {/* Home */}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-start gap-3 flex-1 min-w-0">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 bg-slate-800 rounded-full border border-slate-700 shadow-sm overflow-hidden">
            {match.home?.logo ? (
              <Image
                src={match.home.logo}
                alt={match.home.name || "Home Team"}
                fill
                priority={index < 3}
                className="object-contain p-1"
                sizes="(max-width: 768px) 40px, 48px"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.innerHTML = '<span class="text-xs">⚽</span>';
                }}
              />
            ) : (
              <span className="text-xs">⚽</span>
            )}
          </div>
          <span className="text-white font-semibold text-sm truncate text-center md:text-left transition-colors">
            {match.home.name}
          </span>
        </div>

        {/* Center - Score/Time */}
        <div className="flex flex-col items-center justify-center shrink-0 w-24 md:w-32">
          <div className="mb-1">
            {isLive || isFinished ? ( // Use local isFinished to show score if available or just force score view layout
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-white">{match.home.score ?? 0}</span>
                <span className="text-slate-400 text-lg mx-1">:</span>
                <span className="text-2xl font-bold text-white">{match.away.score ?? 0}</span>
              </div>
            ) : (
              <div className="text-lg font-bold text-white bg-slate-800 px-3 py-1 rounded-md group-hover:bg-slate-700 transition-colors">
                {match.time}
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
        <div className="flex flex-col-reverse md:flex-row items-center md:items-center justify-end gap-3 flex-1 min-w-0">
          <span className="text-white font-semibold text-sm truncate text-center md:text-right transition-colors">
            {match.away.name}
          </span>
           <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1 bg-slate-800 rounded-full border border-slate-700 shadow-sm overflow-hidden">
            {match.away?.logo ? (
              <Image
                src={match.away.logo}
                alt={match.away.name || "Away Team"}
                fill
                priority={index < 3}
                className="object-contain p-1"
                sizes="(max-width: 768px) 40px, 48px"
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

  const classes = `relative p-4 rounded-xl border transition-all duration-300 group
    bg-[#1e293b]
    ${isSelected ? "border-[#0aa674] ring-1 ring-[#0aa674] shadow-md" : "border-slate-800 shadow-sm hover:border-slate-700"}
    cursor-pointer
  `;

  // Staggering is handled by parent variants, but we can add hover/tap here
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const interactiveProps = {
    variants: itemVariants,
    whileHover: { scale: 1.02 }, // Removed fixed light background on hover to allow CSS transitions
    whileTap: { scale: 0.98 },
    className: classes,
    layout: true // Allow smooth layout transitions if list reorders
  };

  if (onClick) {
    return (
      <motion.div {...interactiveProps} onClick={onClick}>
        {content}
      </motion.div>
    );
  }

  return (
    <Link
      href={`/match/${generateMatchSlug(match)}`}
      className="block mb-3"
      prefetch={false}
    >
      <motion.div {...interactiveProps} className={`${interactiveProps.className} overflow-hidden`}>
           {/* Minimal Meta Info Overlay - Top Left */}
           <div className="absolute top-2 left-3 md:top-auto md:bottom-2 md:left-4 flex items-center gap-2 text-[10px] text-white z-10">
                {match.tournamentId && tournamentLogo ? (
                    <div className="relative w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm">
                      <Image 
                        src={tournamentLogo} 
                        alt="Tournament Logo" 
                        fill 
                        className="object-contain p-0.5" 
                        sizes="20px"
                      />
                    </div>
                ) : null}
                <span className="uppercase tracking-wider font-semibold">{match.league}</span>
           </div>
           
           {/* Channel Info - Top Right */}
           {match.channel && (
               <div className="absolute top-2 right-3 md:top-auto md:bottom-2 md:right-4 flex items-center gap-1 text-[10px] text-slate-300 z-10">
                   <Tv className="w-3 h-3 group-hover:text-blue-400 transition-colors" /> {match.channel}
               </div>
           )}

           <div className="pb-4 md:pb-0">{content}</div>

           {/* Hover Overlay - Watch Now */}
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-50">
                <span className={`
                  ${isLive ? "bg-[#e50b0b] hover:bg-[#c90a0a]" : "bg-slate-800 hover:bg-slate-900"} 
                  text-white font-bold py-2 px-8 rounded-lg shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300 ring-1 ring-white/20 whitespace-nowrap
                `}>
                  {isLive ? "شاهد المباراة الان" : isFinished ? "انتهت" : "لم تبدأ بعد"}
                </span>
           </div>
      </motion.div>
    </Link>
  );
}
