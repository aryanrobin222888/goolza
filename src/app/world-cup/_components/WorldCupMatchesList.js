"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { format, isSameDay } from "date-fns";
import { arEG } from "date-fns/locale";
import WCDatePicker from "./WCDatePicker";
import { getArabicTeamName } from "@/lib/teamTranslations";

export default function WorldCupMatchesList({ tournamentId = 16, seasonId = 58210 }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, live, finished, upcoming
  const [roundFilter, setRoundFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    // We will fetch both 'last' and 'next' pages from our Sofascore proxy
    // to get a good span of the tournament matches.
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const fetchPromises = Array.from({ length: 4 }).map((_, i) => 
          fetch(`/api/sofascore/unique-tournament/${tournamentId}/season/${seasonId}/events/next/${i}`).catch(() => null)
        );
        fetchPromises.push(fetch(`/api/sofascore/unique-tournament/${tournamentId}/season/${seasonId}/events/last/0`).catch(() => null));
        fetchPromises.push(fetch(`/api/sofascore/unique-tournament/${tournamentId}/season/${seasonId}/cuptrees`).catch(() => null));
        
        const responses = await Promise.all(fetchPromises);
        
        let allEvents = [];
        
        for (const res of responses) {
           if (res && res.ok) {
              try {
                 const data = await res.json();
                 
                 // If it is regular events response
                 if (data.events) {
                     allEvents = [...allEvents, ...data.events];
                 }
                 
                 // If it is cuptrees response
                 if (data.cupTrees) {
                     data.cupTrees.forEach(tree => {
                         if (!tree.rounds) return;
                         tree.rounds.forEach(r => {
                            if (!r.blocks) return;
                            r.blocks.forEach(block => {
                                const eventId = block.events?.[0] || block.blockId;
                                const existingIndex = allEvents.findIndex(e => e.id === eventId);
                                
                                const isFinal = r.description === "Final";
                                const is3rd = r.description === "3rd place";
                                const constructedRoundInfo = {
                                    round: isFinal ? 2 : (is3rd ? 3 : r.type || 32),
                                    name: r.description,
                                    slug: r.description.toLowerCase().replace(/ /g, '-')
                                };

                                if (existingIndex !== -1) {
                                    // Fix its roundInfo if it exists (e.g. from next/0)
                                    allEvents[existingIndex] = { ...allEvents[existingIndex], roundInfo: constructedRoundInfo };
                                } else {
                                    // Construct artificial event from tree block
                                    const eventObj = {
                                        id: eventId,
                                        startTimestamp: block.seriesStartDateTimestamp,
                                        status: { type: block.finished ? "finished" : "notstarted" },
                                        homeTeam: block.participants?.[0]?.team || { name: "TBD" },
                                        awayTeam: block.participants?.[1]?.team || { name: "TBD" },
                                        roundInfo: constructedRoundInfo
                                    };
                                    allEvents.push(eventObj);
                                }
                            });
                         });
                     });
                 }
              } catch(e) {}
           }
        }

        // Deduplicate
        const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());
        
        // Sort by time
        uniqueEvents.sort((a, b) => (a.startTimestamp || 0) - (b.startTimestamp || 0));
        setEvents(uniqueEvents);

      } catch (err) {
        console.error("Failed to fetch WC matches", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournamentId, seasonId]);

  // Derive unique rounds from data dynamically
  const rounds = useMemo(() => {
    const rSet = new Set();
    events.forEach(e => {
       if (e.roundInfo?.round) rSet.add(e.roundInfo.round);
    });
    return Array.from(rSet).sort((a, b) => a - b);
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
       const status = e.status?.type; // 'inprogress', 'finished', 'notstarted'
       if (filter === "live" && status !== "inprogress") return false;
       if (filter === "finished" && status !== "finished") return false;
       if (filter === "upcoming" && status !== "notstarted") return false;

       if (roundFilter !== "all" && e.roundInfo) {
           const info = e.roundInfo;
           const slug = (info.slug || info.name || "").toLowerCase();
           const rString = String(info.round);
           const isKnockoutMatch = slug.includes("round") && !slug.includes("round 1") && !slug.includes("round 2") && !slug.includes("round 3") 
                                 || slug.includes("quarter") || slug.includes("semi") || slug.includes("final") || slug.includes("3rd") || slug.includes("16") || slug.includes("32");

           if (roundFilter === "1") return !isKnockoutMatch && (rString === "1" || slug.includes("1"));
           if (roundFilter === "2") return !isKnockoutMatch && (rString === "2" || slug.includes("2"));
           if (roundFilter === "3") return !isKnockoutMatch && (rString === "3" || slug.includes("3"));
           
           if (roundFilter === "32") return slug.includes("32");
           if (roundFilter === "16") return slug.includes("16");
           if (roundFilter === "8") return slug.includes("quarter");
           if (roundFilter === "4") return slug.includes("semi");
           if (roundFilter === "3rd") return slug.includes("3rd");
           if (roundFilter === "final") return slug === "final";
       }

       if (dateFilter && e.startTimestamp) {
           const matchDate = new Date(e.startTimestamp * 1000);
           if (!isSameDay(matchDate, dateFilter)) return false;
       }

       return true;
    });
  }, [events, filter, roundFilter, dateFilter]);

  // Group ALL events to find available dates for the dropdown to show indicators
  const availableDates = useMemo(() => {
    const datesSet = new Set();
    events.forEach(e => {
        if (!e.startTimestamp) return;
        datesSet.add(format(new Date(e.startTimestamp * 1000), "yyyy-MM-dd"));
    });
    return Array.from(datesSet);
  }, [events]);

  // Group filtered events by date text (e.g. "الخميس، 11 يونيو 2026")
  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(e => {
        if (!e.startTimestamp) return;
        const dateObj = new Date(e.startTimestamp * 1000);
        const dateKey = format(dateObj, "EEEE، d MMMM yyyy", { locale: arEG });
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(e);
    });
    return groups;
  }, [filteredEvents]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20 mt-10">
        <div className="w-10 h-10 border-4 border-[#22d3ee]/20 border-t-[#22d3ee] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-5xl mx-auto mt-10 mb-20" dir="rtl">
      {/* ── Filter Bar ── */}
      <div className="bg-[#0b101c] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg mb-10 w-full z-20 relative">
        
        {/* Left Side: Status Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
          {[
            { id: "all", label: "الكل", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M16 4h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 9 2 2 4-4"/></svg> },
            { id: "live", label: "مباشر", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg> },
            { id: "finished", label: "منتهية", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> },
            { id: "upcoming", label: "قادمة", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${
                filter === f.id 
                  ? "bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]" 
                  : "bg-white/5 text-slate-400 hover:text-white border border-transparent hover:bg-white/10"
              }`}
            >
              <span className={`${filter === f.id && f.id === 'live' ? 'animate-pulse' : ''}`}>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Right Side: Round Filter Dropdown & Date Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 shrink-0">
              
              {/* Date Filter Component */}
              <WCDatePicker 
                 selectedDate={dateFilter} 
                 onSelectDate={(date) => setDateFilter(date)} 
                 availableDates={availableDates}
              />

              {/* Round Filter */}
              <div className="relative group min-w-[140px]">
                <select
                    className="appearance-none bg-[#0a0f1c] border border-white/10 text-white font-bold px-5 py-2.5 pr-10 rounded-xl outline-none focus:border-[#22d3ee]/50 transition-colors cursor-pointer w-full text-sm ring-1 ring-transparent hover:ring-white/10"
                    value={roundFilter}
                    onChange={(e) => setRoundFilter(e.target.value)}
                >
                    <option value="all">كل الجولات</option>
                    <option value="1">الجولة 1</option>
                    <option value="2">الجولة 2</option>
                    <option value="3">الجولة 3</option>
                    <option value="32">دور الـ 32</option>
                    <option value="16">دور الـ 16</option>
                    <option value="8">ربع النهائي</option>
                    <option value="4">نصف النهائي</option>
                    <option value="final">النهائي</option>
                    <option value="3rd">الترتيب</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#22d3ee]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>

          </div>
        </div>
      </div>

      {/* ── Matches Grid ── */}
      {Object.keys(groupedEvents).length === 0 ? (
         <div className="py-20 bg-[#0a0f1c] border border-white/5 rounded-2xl text-center shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mx-auto mb-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <p className="text-slate-400 font-medium text-lg">لا توجد مباريات مطابقة للبحث أو لم يتبق سوى سحب القرعة.</p>
         </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedEvents).map(([dateLabel, dayEvents], idx) => (
            <div key={idx} className="relative">
               {/* Date Divider */}
               <div className="flex items-center justify-center relative mb-8">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                     <div className="w-full border-t border-white/5"></div>
                  </div>
                  <div className="relative px-6 py-1.5 bg-[#060b19] border border-white/10 rounded-full flex items-center justify-center">
                     <span className="text-sm font-bold text-slate-300 shadow-sm">{dateLabel}</span>
                  </div>
               </div>

               {/* Matches for this date */}
               <div className="space-y-4">
                  {dayEvents.map(event => {
                     const isLive = event.status?.type === "inprogress";
                     const isFinished = event.status?.type === "finished";
                     const timeStr = event.startTimestamp 
                         ? new Date(event.startTimestamp * 1000).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false }) 
                         : "TBD";
                     const hScore = event.homeScore?.display ?? event.homeScore?.current;
                     const aScore = event.awayScore?.display ?? event.awayScore?.current;

                     // Determine correct round name in Arabic
                     let roundLabel = "";
                     if (event.roundInfo) {
                        const s = (event.roundInfo.slug || event.roundInfo.name || "").toLowerCase();
                        if (s === "final") roundLabel = "النهائي";
                        else if (s.includes("3rd")) roundLabel = "مباراة الترتيب";
                        else if (s.includes("semi")) roundLabel = "نصف النهائي";
                        else if (s.includes("quarter")) roundLabel = "ربع النهائي";
                        else if (s.includes("16")) roundLabel = "دور الـ 16";
                        else if (s.includes("32")) roundLabel = "دور الـ 32";
                        else if (event.roundInfo.round) roundLabel = `الجولة ${event.roundInfo.round}`;
                     }

                     return (
                       <Link href={`/match/${event.slug || event.id}`} key={event.id} className="block group">
                         <div className={`bg-[#0b101c] border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 relative ${isLive ? 'border-amber-500/30 hover:border-amber-500/60' : 'border-white/5 hover:border-white/20 hover:scale-[1.01]'}`}>
                           
                           {/* Match Info Header */}
                           <div className="flex justify-between items-center text-xs text-slate-500 px-5 py-2.5 bg-[#121929] border-b border-white/5">
                              <span className="flex items-center gap-1.5">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                 <span className="font-mono tabular-nums">{timeStr}</span>
                              </span>
                              {roundLabel && <span>{roundLabel}</span>}
                           </div>

                           {/* Match Body */}
                           <div className="p-4 md:p-5 flex items-center justify-between">
                              {/* Home */}
                              <div className="flex flex-col items-center gap-2.5 flex-1 w-0">
                                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/5 shadow-lg group-hover:scale-110 transition-transform bg-[#0a0f1c] flex items-center justify-center p-1 shrink-0">
                                   <img src={`/api/sofascore/team/${event.homeTeam?.id}/image`} alt={event.homeTeam?.name} className="w-full h-full object-contain" />
                                 </div>
                                 <span className="font-bold text-sm md:text-base text-white truncate text-center w-full px-1">{getArabicTeamName(event.homeTeam?.shortName || event.homeTeam?.name)}</span>
                              </div>

                              {/* Center Score/Time */}
                              <div className="w-24 md:w-32 mx-2 shrink-0 flex flex-col justify-center items-center h-full">
                                {isFinished || isLive ? (
                                   <>
                                     <div className={`px-3 md:px-5 py-2 rounded-xl flex items-center justify-center gap-2 md:gap-3 font-black text-xl md:text-2xl tabular-nums shadow-inner w-full ${isLive ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white'}`}>
                                        <span>{hScore ?? 0}</span>
                                        <span className="text-slate-600 text-sm opacity-50">:</span>
                                        <span>{aScore ?? 0}</span>
                                     </div>
                                     {isLive && <span className="text-[10px] text-amber-500 mt-2 font-bold px-2 py-0.5 rounded bg-amber-500/10">مباشر <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block ml-1 animate-pulse" /></span>}
                                     {isFinished && <span className="text-[11px] text-slate-500 mt-2 font-bold">انتهت</span>}
                                   </>
                                ) : (
                                   <div className="px-3 md:px-5 py-2 md:py-2.5 bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20 font-black text-lg md:text-xl tabular-nums rounded-xl w-full text-center tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                                      {timeStr}
                                   </div>
                                )}
                              </div>

                              {/* Away */}
                              <div className="flex flex-col items-center gap-2.5 flex-1 w-0">
                                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/5 shadow-lg group-hover:scale-110 transition-transform bg-[#0a0f1c] flex items-center justify-center p-1 shrink-0">
                                   <img src={`/api/sofascore/team/${event.awayTeam?.id}/image`} alt={event.awayTeam?.name} className="w-full h-full object-contain" />
                                 </div>
                                 <span className="font-bold text-sm md:text-base text-white truncate text-center w-full px-1">{getArabicTeamName(event.awayTeam?.shortName || event.awayTeam?.name)}</span>
                              </div>
                           </div>
                         </div>
                       </Link>
                     )
                  })}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
