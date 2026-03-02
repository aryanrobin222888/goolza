"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function MatchStatus({
  startTime,
  matchTime,
  matchDate,
  duration = 180,
  status,
}) {
  const [timeLeft, setTimeLeft] = useState("");
  const [matchState, setMatchState] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    let effectiveStartTime = startTime;
    if (!effectiveStartTime && matchDate && matchTime) {
      const dateStr = format(matchDate, "yyyy-MM-dd");
      effectiveStartTime = `${dateStr}T${matchTime}:00`;
    }

    if (!effectiveStartTime) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const start = new Date(effectiveStartTime);
      const end = new Date(start.getTime() + duration * 60 * 1000);

      if (now >= start && now <= end) {
        setMatchState("LIVE");
        return;
      }

      if (now > end) {
        setMatchState("ENDED");
        return;
      }

      setMatchState("COUNTDOWN");

      const diff = start.getTime() - now.getTime();

      if (diff > 24 * 60 * 60 * 1000) {
        setTimeLeft(
          start.toLocaleDateString("ar", { month: "short", day: "numeric" })
        );
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startTime, matchTime, matchDate, duration]);

  if (!isMounted) {
    return <span className="opacity-0">...</span>;
  }

  const effectiveState = matchState || status;

  // LIVE — Minimal Red Dot
  if (effectiveState === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-red-100">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        مباشر
      </span>
    );
  }

  // ENDED
  if (effectiveState === "ENDED" || effectiveState === "finished") {
    return (
      <span className="text-zinc-400 text-[11px] font-medium">انتهت</span>
    );
  }

  // Postponed
  if (effectiveState === "postponed") {
    return (
      <span className="inline-block bg-orange-50 text-orange-500 border border-orange-100 text-[10px] px-2 py-0.5 rounded-full font-medium">
        مؤجلة
      </span>
    );
  }

  // Canceled
  if (effectiveState === "canceled") {
    return (
      <span className="inline-block bg-zinc-100 text-zinc-500 text-[10px] px-2 py-0.5 rounded-full font-medium line-through decoration-zinc-400">
        ملغاة
      </span>
    );
  }

  // Countdown
  if (matchState === "COUNTDOWN") {
    return (
      <span className="text-emerald-600 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
        {timeLeft || "قريبا"}
      </span>
    );
  }

  // Fallback
  return (
    <span className="text-zinc-400 text-[11px]">قادمة</span>
  );
}
