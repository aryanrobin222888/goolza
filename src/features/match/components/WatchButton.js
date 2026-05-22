"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Tv } from "lucide-react";

const ENABLE_BEFORE_MINUTES = 30; // Button becomes enabled 30min before kickoff

/**
 * Calculates seconds remaining until the button should be enabled.
 * Button is enabled 30 minutes before match start time.
 * Returns 0 if already within the 30-min window or match has started.
 */
function getSecondsUntilEnable(matchTime, matchStartTime) {
  const now = new Date();

  // Try parsing startTime first (ISO timestamp)
  let start = matchStartTime ? new Date(matchStartTime) : null;

  // If startTime is invalid, try building from the time string (HH:MM)
  if (!start || isNaN(start.getTime())) {
    if (matchTime) {
      const todayStr = now.toISOString().split("T")[0];
      start = new Date(`${todayStr}T${matchTime}:00`);
    }
  }

  // If we still can't determine the start time, enable immediately
  if (!start || isNaN(start.getTime())) return 0;

  // enableTime = matchStart - 30 minutes
  const enableTime = new Date(start.getTime() - ENABLE_BEFORE_MINUTES * 60 * 1000);
  const diff = Math.floor((enableTime - now) / 1000);

  return diff > 0 ? diff : 0;
}

export default function WatchButton({ streamPageUrl, isFinished, isLive, matchTime, matchStartTime }) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getSecondsUntilEnable(matchTime, matchStartTime)
  );
  const [isReady, setIsReady] = useState(() =>
    getSecondsUntilEnable(matchTime, matchStartTime) === 0
  );

  useEffect(() => {
    if (isFinished || isReady) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, isReady]);

  const formatTime = useCallback((totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  // ── Finished state ──
  if (isFinished) {
    const now = new Date();
    let start = matchStartTime ? new Date(matchStartTime) : null;
    if (!start || isNaN(start.getTime())) {
      if (matchTime) {
        const todayStr = now.toISOString().split("T")[0];
        start = new Date(`${todayStr}T${matchTime}:00`);
      }
    }

    let isWithin4Hours = false;
    if (start && !isNaN(start.getTime())) {
      const fourHoursLater = new Date(start.getTime() + 4 * 60 * 60 * 1000);
      isWithin4Hours = now <= fourHoursLater;
    }

    // Keep the button active for up to 4 hours since kickoff if stream URL is present
    if (isWithin4Hours && streamPageUrl) {
      return (
        <div className="flex flex-col items-center gap-4">
          <Link
            href={streamPageUrl}
            target="_blank"
            className="group/btn relative inline-flex items-center gap-3 bg-[#ff7a00] hover:bg-[#08c285] text-white font-bold text-lg md:text-xl px-10 py-4 rounded-2xl shadow-lg shadow-[#ff7a00]/30 hover:shadow-[#ff7a00]/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
          >
            {/* Shimmer sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
            {/* Play icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover/btn:scale-110">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
            شاهد البث من هنا
          </Link>
          <p className="text-slate-400 text-sm text-center font-medium">
            المباراة انتهت — البث ما زال متوفراً للمشاهدة
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-3 bg-slate-800 border border-slate-700 text-slate-400 font-bold text-lg md:text-xl px-10 py-4 rounded-2xl cursor-default">
          <Tv className="w-6 h-6 flex-shrink-0" />
          انتهت المباراة
        </div>
        <p className="text-slate-500 text-sm text-center">
          انتهى البث، شكراً على المتابعة.
        </p>
      </div>
    );
  }

  // ── No stream URL ──
  if (!streamPageUrl) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center gap-3 bg-[#ff7a00]/20 border border-[#ff7a00]/30 text-[#ff7a00] font-bold text-lg md:text-xl px-10 py-4 rounded-2xl cursor-default">
          <Tv className="w-6 h-6 flex-shrink-0" />
          البث سيبدأ قريباً
        </div>
        <p className="text-[#ff7a00]/70 text-sm text-center">
          سيتم توفير رابط البث عند انطلاق المباراة.
        </p>
      </div>
    );
  }

  // ── Countdown active (button disabled) ──
  if (!isReady) {
    // Calculate initial total for the progress ring
    const initialTotal = getSecondsUntilEnable(matchTime, matchStartTime) || secondsLeft || 1;
    const progress = secondsLeft / initialTotal;

    return (
      <>
        <div className="flex flex-col items-center gap-5">
          {/* Disabled Button */}
          <div
            className="group/btn relative inline-flex items-center gap-3 bg-slate-700/60 text-slate-400 font-bold text-lg md:text-xl px-10 py-4 rounded-2xl shadow-lg cursor-not-allowed select-none overflow-hidden border border-slate-600/40"
          >
            {/* Subtle shimmer animation on disabled */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] skew-x-12 pointer-events-none" />
            {/* Lock icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
            شاهد البث من هنا
          </div>

          {/* Countdown Timer */}
          <div className="flex flex-col items-center gap-3">
            {/* Circular progress ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50" cy="50" r="44"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50" cy="50" r="44"
                  stroke="url(#countdownGrad)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * progress}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
                <defs>
                  <linearGradient id="countdownGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff7a00" />
                    <stop offset="100%" stopColor="#06d6a0" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Time text */}
              <span className="absolute text-lg font-mono font-bold text-white tracking-wider">
                {formatTime(secondsLeft)}
              </span>
            </div>

            <p className="text-slate-400 text-sm text-center leading-relaxed">
              سيتم تفعيل زر المشاهدة بعد <span className="text-[#ff7a00] font-bold">{formatTime(secondsLeft)}</span>
            </p>
          </div>
        </div>
      </>
    );
  }

  // ── Ready (button enabled) ──
  return (
    <div className="flex flex-col items-center gap-4">
      <Link
        href={streamPageUrl}
        target="_blank"
        className="group/btn relative inline-flex items-center gap-3 bg-[#ff7a00] hover:bg-[#08c285] text-white font-bold text-lg md:text-xl px-10 py-4 rounded-2xl shadow-lg shadow-[#ff7a00]/30 hover:shadow-[#ff7a00]/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
      >
        {/* Shimmer sweep on hover */}
        <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
        {/* Play icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0 transition-transform duration-300 group-hover/btn:scale-110">
          <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
        </svg>
        شاهد البث من هنا
      </Link>
      <p className="text-slate-400 text-sm text-center">
        انقر للمشاهدة — بث مباشر بجودة عالية
      </p>
    </div>
  );
}
