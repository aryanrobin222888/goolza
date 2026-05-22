"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

const POSITION_GROUPS = [
  { key: "G",  label: "حراس المرمى", icon: "🧤", color: "#fbbf24" },
  { key: "D",  label: "المدافعون",   icon: "🛡️", color: "#38bdf8" },
  { key: "M",  label: "الوسط",       icon: "⚡",  color: "#34d399" },
  { key: "F",  label: "المهاجمون",   icon: "⚽",  color: "#f87171" },
];

const STATUS_BADGES = {
  injured:  { label: "مصاب",    color: "#ef4444", bg: "rgba(239,68,68,0.12)"    },
  doubtful: { label: "مشكوك فيه", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  ill:      { label: "مريض",    color: "#a78bfa", bg: "rgba(167,139,250,0.12)"  },
};

function calcAge(ts) {
  if (!ts) return null;
  const d = new Date(ts * 1000);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

function formatDob(ts) {
  if (!ts) return null;
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function PlayerImage({ id, name }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white/30"
        style={{ background: "rgba(255,255,255,0.06)" }}>
        {name?.[0] || "؟"}
      </div>
    );
  }
  return (
    <img
      src={`/api/sofascore/player/${id}/image`}
      alt={name}
      width={40} height={40}
      className="w-10 h-10 rounded-full object-cover"
      style={{ background: "rgba(255,255,255,0.04)" }}
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

function FlagIcon({ alpha2 }) {
  if (!alpha2) return null;
  return (
    <img
      src={`https://flagcdn.com/16x12/${alpha2.toLowerCase()}.png`}
      alt={alpha2}
      width={16} height={12}
      className="rounded-sm object-cover inline-block"
    />
  );
}

function PlayerRow({ player: p, shirtNumber, position, status }) {
  const age = calcAge(p.dateOfBirthTimestamp);
  const dob = formatDob(p.dateOfBirthTimestamp);
  const badge = status ? STATUS_BADGES[status] : null;

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 border-b transition-colors hover:bg-white/[0.02] group"
      style={{ borderColor: "rgba(255,255,255,0.04)" }}
    >
      {/* Shirt number */}
      <span className="text-xs font-black text-slate-600 tabular-nums w-5 text-center shrink-0">
        {shirtNumber ?? "—"}
      </span>

      {/* Photo */}
      <PlayerImage id={p.id} name={p.name} />

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-white truncate">{getArabicName(p.name, p.fieldTranslations)}</span>
          {badge && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ color: badge.color, background: badge.bg }}
            >
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{position}</span>
          {p.country?.alpha2 && (
            <span className="flex items-center gap-1 text-[10px] text-slate-600">
              <FlagIcon alpha2={p.country.alpha2} />
              {getArabicName(p.country.name, p.country.fieldTranslations)}
            </span>
          )}
        </div>
      </div>

      {/* Height */}
      <div className="hidden sm:flex flex-col items-center gap-0.5 text-center w-14 shrink-0">
        <span className="text-xs font-bold text-white">{p.height ? `${p.height}cm` : "—"}</span>
        <span className="text-[9px] text-slate-600">الطول</span>
      </div>

      {/* DOB + Age */}
      <div className="hidden md:flex flex-col items-end gap-0.5 shrink-0 text-left">
        <span className="text-xs text-slate-400">{dob || "—"}</span>
        {age !== null && (
          <span className="text-[10px] text-slate-600">{age} سنة</span>
        )}
      </div>
    </div>
  );
}

export default function TeamPlayers({ teamId }) {
  const [grouped, setGrouped]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [injuries, setInjuries] = useState({});

  useEffect(() => {
    setLoading(true);
    // Fetch players + injuries in parallel
    Promise.all([
      fetch(`/api/sofascore/team/${teamId}/players`).then(r => r.json()),
      fetch(`/api/sofascore/team/${teamId}/missing-players`).then(r => r.json()).catch(() => ({})),
    ])
      .then(([playersData, injuryData]) => {
        const players = playersData.players || [];

        // Build injury map { playerId → status }
        const injuryMap = {};
        (injuryData.missingPlayers || []).forEach(mp => {
          injuryMap[mp.player?.id] = mp.type || "injured";
        });
        setInjuries(injuryMap);

        // Group by position
        const groups = {};
        POSITION_GROUPS.forEach(g => { groups[g.key] = []; });
        players.forEach(entry => {
          const pos = entry.position || entry.player?.position || "F";
          const key = pos.toUpperCase()[0]; // G, D, M, F
          if (!groups[key]) groups[key] = [];
          groups[key].push(entry);
        });
        // Sort each group by shirt number
        Object.keys(groups).forEach(k => {
          groups[k].sort((a, b) => (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99));
        });
        setGrouped(groups);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [teamId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
        <span className="text-slate-500 text-sm">جاري تحميل قائمة اللاعبين...</span>
      </div>
    );
  }
  if (error || !grouped) {
    return <div className="text-center py-16 text-slate-500 text-sm">تعذّر تحميل اللاعبين</div>;
  }

  return (
    <div className="space-y-6">
      {POSITION_GROUPS.map(group => {
        const players = grouped[group.key] || [];
        if (!players.length) return null;
        return (
          <div key={group.key}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Group Header */}
            <div
              className="flex items-center gap-3 px-5 py-3 border-b"
              style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
            >
              <div className="w-0.5 h-4 rounded-full" style={{ background: group.color }} />
              <span className="text-lg">{group.icon}</span>
              <span className="text-sm font-black text-white">{group.label}</span>
              <span
                className="mr-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${group.color}18`, color: group.color }}
              >
                {players.length}
              </span>
            </div>

            {/* Table Header */}
            <div
              className="grid px-4 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wide border-b"
              style={{ borderColor: "rgba(255,255,255,0.04)", gridTemplateColumns: "20px 40px 1fr 56px 120px" }}
            >
              <span>#</span>
              <span></span>
              <span>الاسم</span>
              <span className="text-center hidden sm:block">الطول</span>
              <span className="text-left hidden md:block">تاريخ الميلاد</span>
            </div>

            {/* Rows */}
            {players.map(entry => (
              <PlayerRow
                key={entry.player?.id}
                player={entry.player}
                shirtNumber={entry.shirtNumber}
                position={entry.position}
                status={injuries[entry.player?.id]}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
