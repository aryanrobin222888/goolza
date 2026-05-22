"use client";

import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isToday } from "date-fns";
import { arEG } from "date-fns/locale";

export default function WCDatePicker({ selectedDate, onSelectDate, availableDates }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default to June 2026 (when World Cup starts) if nothing selected, or current month if selected
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1)); // 5 is June (0-indexed)

  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Determine days to render to complete the grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  
  // startOfWeek in Arabic locale usually starts on Sunday or Saturday, let's use default startOfWeek
  const startDate = startOfWeek(monthStart, { weekStartsOn: 6 }); // 6 = Saturday in arEG
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 6 });

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["س", "ح", "ن", "ث", "ر", "خ", "ج"]; // Sat, Sun, Mon, Tue, Wed, Thu, Fri

  const handleSelect = (day) => {
    onSelectDate(day);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectDate(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      <div className={`relative z-100 flex-1 transition-all duration-300 opacity-100 ${isOpen ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]' : ''}`}>
        
        {/* Trigger Button */}
        <div 
          role="button" 
          tabIndex="0" 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-w-[160px] flex items-center justify-between gap-2 bg-[#0b101c] backdrop-blur-md border rounded-xl px-4 py-2.5 text-sm transition-all duration-300 group hover:bg-white/5 cursor-pointer ${
            isOpen 
               ? "border-[#22d3ee] shadow-[0_0_10px_rgba(34,211,238,0.2)] ring-1 ring-[#22d3ee] text-white" 
               : selectedDate 
                  ? "border-[#22d3ee]/50 text-white"
                  : "border-white/10 text-slate-300 hover:border-white/30"
          }`}
        >
          <div className="flex items-center gap-2 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`group-hover:scale-110 transition-transform duration-300 ${isOpen || selectedDate ? 'text-[#22d3ee]' : 'text-slate-400'}`}>
              <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
            </svg>
            <span className="font-bold tracking-wide flex-1 text-right truncate">
              {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: arEG }) : "اختر التاريخ"}
            </span>
          </div>
          {selectedDate && (
            <button 
               onClick={(e) => { e.stopPropagation(); handleClear(); }}
               className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

        {/* Popover */}
        {isOpen && (
          <div className="absolute top-full mt-2 right-0 z-50 border border-white/10 rounded-xl shadow-2xl min-w-[280px] overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ background: "rgba(15, 30, 53, 0.95)", backdropFilter: "blur(16px)" }}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-3 bg-black/30 border-b border-white/10">
              <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#22d3ee]">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg hover:text-[#fbbf24] transition-colors">{format(currentMonth, "MMMM", { locale: arEG })}</span>
                <span className="text-white font-bold text-lg hover:text-[#fbbf24] transition-colors">{format(currentMonth, "yyyy", { locale: arEG })}</span>
              </div>
              <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#22d3ee]">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-3">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, idx) => (
                  <div key={idx} className="text-center text-xs text-[#fbbf24] font-bold opacity-80">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                  const dayIsSameMonth = isSameMonth(day, monthStart);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  
                  // Check if day has matches
                  const dayString = format(day, "yyyy-MM-dd");
                  const hasMatches = availableDates.includes(dayString);
                  
                  return (
                    <button
                      key={i}
                      disabled={!dayIsSameMonth}
                      onClick={() => handleSelect(day)}
                      className={`
                        p-2 text-sm rounded-lg transition-all font-bold aspect-square flex items-center justify-center relative
                        ${!dayIsSameMonth ? "text-gray-600 cursor-default opacity-50" : "hover:bg-white/10 cursor-pointer text-white"}
                        ${isSelected ? "bg-[#22d3ee] text-black hover:bg-[#22d3ee]/90 shadow-[0_0_10px_rgba(34,211,238,0.4)]" : ""}
                        ${!isSelected && hasMatches ? "border border-[#22d3ee]/40 text-[#22d3ee]" : ""}
                      `}
                    >
                      {format(day, dateFormat)}
                      {/* Optional Indicator dot if has matches and not selected */}
                      {hasMatches && !isSelected && (
                         <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#22d3ee]"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-3 bg-black/20">
              <button 
                onClick={() => { handleClear(); }}
                className="py-2.5 w-full flex items-center justify-center px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all duration-300 gap-2 shadow-sm border border-white/10"
              >
                <span>عرض كل المباريات</span>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
