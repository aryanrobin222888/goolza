"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMatchDate(ts) {
  if (!ts) return null;
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
}

function formatMatchTime(ts) {
  if (!ts) return null;
  return new Date(ts * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

function statusLabel(status) {
  const map = {
    notstarted:  { text: "لم تبدأ",  color: "#94a3b8" },
    inprogress:  { text: "مباشر",    color: "#ef4444" },
    finished:    { text: "انتهت",    color: "#64748b" },
    postponed:   { text: "مؤجلة",   color: "#f59e0b" },
    canceled:    { text: "ملغاة",    color: "#ef4444" },
  };
  const key = (status?.type || status || "").toLowerCase().replace(/ /g, "");
  return map[key] || map[status?.toLowerCase?.()] || { text: status, color: "#94a3b8" };
}

function TeamLogo({ id, name }) {
  const [err, setErr] = useState(false);
  if (err || !id)
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
        style={{ background: "rgba(255,255,255,0.06)" }}>⚽</div>
    );
  return (
    <img
      src={`/api/sofascore/team/${id}/image`}
      alt={name}
      width={32} height={32}
      className="w-8 h-8 object-contain rounded-full"
      style={{ background: "rgba(255,255,255,0.04)" }}
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

function MatchRow({ event, highlightTeamId }) {
  const home    = event.homeTeam;
  const away    = event.awayTeam;
  const scores  = event.homeScore;
  const awayScores = event.awayScore;
  const finished = event.status?.type === "finished";
  const live     = event.status?.type === "inprogress";
  const hl       = highlightTeamId;
  const isHomeTeam  = String(home?.id) === String(hl);
  const isAwayTeam  = String(away?.id) === String(hl);

  // W / D / L for the highlight team
  let result = null;
  if (finished && (isHomeTeam || isAwayTeam)) {
    const myScore    = isHomeTeam ? (scores?.current ?? 0)    : (awayScores?.current ?? 0);
    const theirScore = isHomeTeam ? (awayScores?.current ?? 0) : (scores?.current ?? 0);
    if (myScore > theirScore) result = "W";
    else if (myScore === theirScore) result = "D";
    else result = "L";
  }

  const resultColors = {
    W: { text: "#34d399", bg: "rgba(52,211,153,0.12)", label: "ف" },
    D: { text: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "ت" },
    L: { text: "#f87171", bg: "rgba(248,113,113,0.12)", label: "خ" },
  };

  const st = statusLabel(event.status);
  const date = formatMatchDate(event.startTimestamp);
  const time = formatMatchTime(event.startTimestamp);
  const comp = event.tournament?.name || event.tournament?.uniqueTournament?.name || "";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b transition-colors hover:bg-white/[0.02] relative"
      style={{ borderColor: "rgba(255,255,255,0.04)" }}
    >
      <Link href={`/match/${event.slug}-${event.id}`} className="absolute inset-0 z-0" aria-label="تفاصيل المباراة" />
      
      {/* Result badge */}
      <div className="z-10 shrink-0">
        {result && (
          <span
            className="text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-md"
            style={{ color: resultColors[result].text, background: resultColors[result].bg }}
          >
            {resultColors[result].label}
          </span>
        )}
        {!result && <div className="w-5 h-5" />}
      </div>

      {/* Home team */}
      <Link href={`/team/${home?.slug || "team"}/${home?.id}`} className="flex items-center gap-2 flex-1 min-w-0 justify-end group/home z-10">
        <span className={`text-sm font-bold truncate text-left group-hover/home:text-sky-300 transition-colors ${
          isHomeTeam ? "text-white" : "text-slate-400"
        }`}>
          {getArabicName(home?.shortName || home?.name, home?.fieldTranslations)}
        </span>
        <TeamLogo id={home?.id} name={home?.name} />
      </Link>

      {/* Score / Time */}
      <div className="shrink-0 text-center w-20 z-10 pointer-events-none">
        {finished || live ? (
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-base font-black text-white tabular-nums">{scores?.current ?? 0}</span>
            <span className="text-slate-600 text-xs">-</span>
            <span className="text-base font-black text-white tabular-nums">{awayScores?.current ?? 0}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-white tabular-nums">{time}</span>
            <span className="text-[10px] text-slate-600 font-bold">{date}</span>
          </div>
        )}
        {live && (
          <span className="text-[9px] font-black text-red-400 animate-pulse">{event.status?.description || "LIVE"}</span>
        )}
        {finished && (
          <span className="text-[9px] text-slate-600 font-bold">{date}</span>
        )}
      </div>

      {/* Away team */}
      <Link href={`/team/${away?.slug || "team"}/${away?.id}`} className="flex items-center gap-2 flex-1 min-w-0 justify-start group/away z-10">
        <TeamLogo id={away?.id} name={away?.name} />
        <span className={`text-sm font-bold truncate group-hover/away:text-sky-300 transition-colors ${
          isAwayTeam ? "text-white" : "text-slate-400"
        }`}>
          {getArabicName(away?.shortName || away?.name, away?.fieldTranslations)}
        </span>
      </Link>

      {/* Competition logo */}
      {event.tournament?.uniqueTournament?.id && (
        <div className="z-10 shrink-0">
          <img
            src={`/api/sofascore/unique-tournament/${event.tournament.uniqueTournament.id}/image`}
            alt={comp}
            width={20} height={20}
            className="w-5 h-5 object-contain rounded"
            onError={e => { e.target.style.display = "none"; }}
          />
        </div>
      )}
    </div>
  );
}

// ── Form Bar Chart ─────────────────────────────────────────────────────────────

function FormChart({ events, teamId }) {
  const results = events
    .filter(e => e.status?.type === "finished")
    .map(e => {
      const isHome = String(e.homeTeam?.id) === String(teamId);
      const ms = e.homeScore?.current ?? 0;
      const as = e.awayScore?.current ?? 0;
      const my = isHome ? ms : as;
      const their = isHome ? as : ms;
      if (my > their) return "W";
      if (my === their) return "D";
      return "L";
    })
    .slice(-10);

  if (!results.length) return null;

  const colorMap = { W: "#34d399", D: "#fbbf24", L: "#f87171" };
  const maxH = 32;

  return (
    <div className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-0.5 h-4 rounded-full" style={{ background: "linear-gradient(to bottom, #34d399, #38bdf8)" }} />
        <span className="text-sm font-black text-white">الشكل الأخير</span>
      </div>
      <div className="flex items-end gap-1.5 h-10">
        {results.map((r, i) => {
          const height = r === "W" ? maxH : r === "D" ? maxH * 0.6 : maxH * 0.3;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-t-sm transition-all duration-700"
                style={{ height: `${height}px`, background: colorMap[r], opacity: 0.85 }}
                title={r === "W" ? "فوز" : r === "D" ? "تعادل" : "خسارة"}
              />
              <span className="text-[9px] font-black" style={{ color: colorMap[r] }}>
                {r === "W" ? "ف" : r === "D" ? "ت" : "خ"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[["ف", "#34d399", "فوز"], ["ت", "#fbbf24", "تعادل"], ["خ", "#f87171", "خسارة"]].map(([l, c, f]) => (
          <span key={l} className="flex items-center gap-1 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-sm" style={{ background: c }} />
            {f}
          </span>
        ))}
        <span className="mr-auto text-[10px] text-slate-600">آخر {results.length} مباراة</span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function TeamMatches({ teamId }) {
  const [lastEvents, setLastEvents] = useState([]);
  const [nextEvents, setNextEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);
  const [tab, setTab]       = useState("last"); // "last" | "next"

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetch(`/api/sofascore/team/${teamId}/events/last/0`).then(r => r.json()),
      fetch(`/api/sofascore/team/${teamId}/events/next/0`).then(r => r.json()),
    ]).then(([lastRes, nextRes]) => {
      if (lastRes.status === "fulfilled") {
        setLastEvents((lastRes.value.events || []).slice().reverse());
      }
      if (nextRes.status === "fulfilled") {
        setNextEvents(nextRes.value.events || []);
      }
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, [teamId]);

  const displayedEvents = tab === "last" ? lastEvents : nextEvents;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-slate-500 text-sm">جاري تحميل المباريات...</span>
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-16 text-slate-500 text-sm">تعذّر تحميل المباريات</div>;
  }

  return (
    <div className="space-y-5">

      {/* Form chart (last matches only) */}
      {tab === "last" && lastEvents.length > 0 && (
        <FormChart events={lastEvents} teamId={teamId} />
      )}

      {/* Sub-tab toggle */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {[["last", "المباريات السابقة"], ["next", "المباريات القادمة"]].map(([id, label]) => (
          <button
            key={id}
            id={`matches-tab-${id}`}
            onClick={() => setTab(id)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
            style={{
              background: tab === id ? "rgba(56,189,248,0.1)" : "transparent",
              color: tab === id ? "#38bdf8" : "rgba(255,255,255,0.3)",
              border: tab === id ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Match list */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {displayedEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">لا توجد مباريات</div>
        ) : (
          displayedEvents.map(event => (
            <MatchRow key={event.id} event={event} highlightTeamId={teamId} />
          ))
        )}
      </div>
    </div>
  );
}
