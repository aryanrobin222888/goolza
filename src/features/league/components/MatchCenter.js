"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { generateMatchSlug } from "@/lib/matchSlug";
import { getArabicName } from "@/features/schedule/utils/mappers";

// ─── Sub-components ────────────────────────────────────────────────────────────

function TeamMini({ id, name }) {
  const [err, setErr] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <div className="w-7 h-7 flex items-center justify-center">
        {!err && id ? (
          <img
            src={`/api/sofascore/team/${id}/image`}
            alt={name}
            width={28}
            height={28}
            className="w-7 h-7 object-contain"
            onError={() => setErr(true)}
            loading="lazy"
          />
        ) : (
          <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
            ⚽
          </span>
        )}
      </div>
      <span className="text-[11px] text-slate-300 font-semibold truncate max-w-[72px] text-center leading-tight">
        {name}
      </span>
    </div>
  );
}

function MatchCard({ event }) {
  const statusType = event.status?.type; // 'finished' | 'inprogress' | 'notstarted'
  const isFinished = statusType === "finished";
  const isLive = statusType === "inprogress";
  const isUpcoming = statusType === "notstarted";

  const startDate = event.startTimestamp
    ? new Date(event.startTimestamp * 1000)
    : null;

  const dateStr = startDate
    ? startDate.toLocaleDateString("en-US-u-nu-latn", {
        day: "numeric",
        month: "short",
      })
    : null;

  const timeStr = startDate
    ? startDate.toLocaleTimeString("en", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  const homeScore = event.homeScore?.display ?? event.homeScore?.current;
  const awayScore = event.awayScore?.display ?? event.awayScore?.current;

  const matchSlugPayload = {
    id: event.id,
    slug: event.slug,
    home: { name: getArabicName(event.homeTeam?.name || event.homeTeam?.shortName, event.homeTeam?.fieldTranslations) },
    away: { name: getArabicName(event.awayTeam?.name || event.awayTeam?.shortName, event.awayTeam?.fieldTranslations) }
  };
  const matchSlug = generateMatchSlug(matchSlugPayload);

  return (
    <Link
      href={`/match/${matchSlug}`}
      prefetch={false}
      className={`flex items-center gap-2 px-4 py-3 border-b border-slate-800/60 last:border-b-0 transition-colors duration-150 hover:bg-slate-800/30 ${
        isLive ? "bg-amber-950/20" : ""
      }`}
    >
      {/* Date / Status column */}
      <div className="shrink-0 w-[52px] flex flex-col items-end gap-0.5">
        {dateStr && (
          <span className="text-[10px] text-slate-500 leading-tight">
            {dateStr}
          </span>
        )}
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 animate-pulse">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            LIVE
          </span>
        ) : isFinished ? (
          <span className="text-[10px] text-slate-600">انتهت</span>
        ) : isUpcoming && timeStr ? (
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {timeStr}
          </span>
        ) : null}
      </div>

      {/* Home */}
      <TeamMini
        id={event.homeTeam?.id}
        name={getArabicName(event.homeTeam?.shortName || event.homeTeam?.name, event.homeTeam?.fieldTranslations)}
      />

      {/* Score or VS */}
      <div className="shrink-0 flex flex-col items-center gap-0.5 w-12">
        {isFinished || isLive ? (
          <div className="flex items-center gap-1">
            <span
              className={`text-base font-black tabular-nums ${
                isLive ? "text-amber-300" : "text-white"
              }`}
            >
              {homeScore ?? 0}
            </span>
            <span className="text-slate-600 text-xs">:</span>
            <span
              className={`text-base font-black tabular-nums ${
                isLive ? "text-amber-300" : "text-white"
              }`}
            >
              {awayScore ?? 0}
            </span>
          </div>
        ) : (
          <span className="text-xs font-bold text-slate-600">vs</span>
        )}
      </div>

      {/* Away */}
      <TeamMini
        id={event.awayTeam?.id}
        name={getArabicName(event.awayTeam?.shortName || event.awayTeam?.name, event.awayTeam?.fieldTranslations)}
      />
    </Link>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MatchCenter({ tournamentId, seasonId }) {
  const [tab, setTab] = useState("recent");
  const [recentEvents, setRecentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [errorRecent, setErrorRecent] = useState(false);
  const [errorUpcoming, setErrorUpcoming] = useState(false);

  // Fetch recent results
  useEffect(() => {
    setLoadingRecent(true);
    setErrorRecent(false);
    fetch(`/api/sofascore/unique-tournament/${tournamentId}/season/${seasonId}/events/last/0`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const events = data.events ?? [];
        // Most recent first
        events.sort((a, b) => (b.startTimestamp ?? 0) - (a.startTimestamp ?? 0));
        setRecentEvents(events.slice(0, 10));
      })
      .catch(() => setErrorRecent(true))
      .finally(() => setLoadingRecent(false));
  }, [tournamentId]);

  // Fetch upcoming fixtures
  useEffect(() => {
    setLoadingUpcoming(true);
    setErrorUpcoming(false);
    fetch(`/api/sofascore/unique-tournament/${tournamentId}/season/${seasonId}/events/next/0`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        const events = data.events ?? [];
        // Soonest first
        events.sort((a, b) => (a.startTimestamp ?? 0) - (b.startTimestamp ?? 0));
        setUpcomingEvents(events.slice(0, 10));
      })
      .catch(() => setErrorUpcoming(true))
      .finally(() => setLoadingUpcoming(false));
  }, [tournamentId]);

  const isLoading = tab === "recent" ? loadingRecent : loadingUpcoming;
  const hasError = tab === "recent" ? errorRecent : errorUpcoming;
  const displayed = tab === "recent" ? recentEvents : upcomingEvents;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-800 bg-slate-900/80">
        <button
          onClick={() => setTab("recent")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all duration-200 ${
            tab === "recent"
              ? "text-[#0aa674] border-b-2 border-[#0aa674]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          نتائج أخيرة
        </button>
        <button
          onClick={() => setTab("upcoming")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all duration-200 ${
            tab === "upcoming"
              ? "text-[#0aa674] border-b-2 border-[#0aa674]"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          المباريات القادمة
        </button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="divide-y divide-slate-800/60">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 animate-pulse"
            >
              <div className="w-12 h-8 bg-slate-800 rounded shrink-0" />
              <div className="flex-1 flex items-center justify-between gap-2">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-7 h-7 bg-slate-800 rounded-full" />
                  <div className="w-14 h-2.5 bg-slate-800 rounded" />
                </div>
                <div className="w-10 h-5 bg-slate-800 rounded" />
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-7 h-7 bg-slate-800 rounded-full" />
                  <div className="w-14 h-2.5 bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          تعذّر تحميل المباريات. حاول لاحقاً.
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          لا توجد مباريات متاحة حالياً
        </div>
      ) : (
        <div>
          {displayed.map((event) => (
            <MatchCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
