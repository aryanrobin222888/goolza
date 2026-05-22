"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ZONE_MAP = {
  "champions league":   { color: "#3b82f6", label: "دوري أبطال أوروبا" },
  "europa league":      { color: "#f97316", label: "الدوري الأوروبي" },
  "conference league":  { color: "#06b6d4", label: "دوري الكونفرنسي" },
  "relegation playoff": { color: "#f59e0b", label: "ملحق الهبوط" },
  "relegation":         { color: "#ef4444", label: "منطقة الهبوط" },
};

function getZone(text = "") {
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(ZONE_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
}

function FormBubble({ result }) {
  const map = {
    W: { bg: "#16a34a", label: "ف" },
    D: { bg: "#d97706", label: "ت" },
    L: { bg: "#dc2626", label: "خ" },
  };
  const s = map[result] || { bg: "#334155", label: "؟" };
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black text-white shrink-0"
      style={{ background: s.bg }}
    >
      {s.label}
    </span>
  );
}

function TeamLogo({ id, name }) {
  const [err, setErr] = useState(false);
  if (err || !id)
    return (
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
        style={{ background: "rgba(255,255,255,0.06)" }}>⚽</span>
    );
  return (
    <img
      src={`/api/sofascore/team/${id}/image`}
      alt={name}
      width={24} height={24}
      className="w-6 h-6 object-contain rounded-full"
      style={{ background: "rgba(255,255,255,0.04)" }}
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TeamStandings({ teamId, primaryTournamentId }) {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTid, setSelectedTid] = useState(primaryTournamentId || null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSid, setSelectedSid] = useState(null);
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  // 1. Load available tournaments
  useEffect(() => {
    fetch(`/api/sofascore/team/${teamId}/unique-tournaments`)
      .then(r => r.json())
      .then(d => {
        const list = d.uniqueTournaments || [];
        setTournaments(list);
        if (!selectedTid && list.length) setSelectedTid(list[0].id);
      })
      .catch(() => {});
  }, [teamId]);

  // 2. Load seasons
  useEffect(() => {
    if (!selectedTid) return;
    setSelectedSid(null);
    setStandings(null);
    fetch(`/api/sofascore/unique-tournament/${selectedTid}/seasons`)
      .then(r => r.json())
      .then(d => {
        const list = d.seasons || [];
        setSeasons(list);
        if (list.length) setSelectedSid(list[0].id);
      })
      .catch(() => {});
  }, [selectedTid]);

  // 3. Load standings
  useEffect(() => {
    if (!selectedTid || !selectedSid) return;
    setLoading(true);
    setError(false);
    fetch(`/api/sofascore/unique-tournament/${selectedTid}/season/${selectedSid}/standings/total`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => {
        const groups = d.standings || [];
        setStandings(groups);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [selectedTid, selectedSid]);

  const rows = standings?.[0]?.rows || [];

  // Collect legend zones
  const zones = [];
  rows.forEach(r => {
    const z = getZone(r.promotion?.text || r.rowName || "");
    if (z && !zones.find(x => x.label === z.label)) zones.push(z);
  });

  return (
    <div className="space-y-5">

      {/* ── Selectors ── */}
      <div className="flex flex-wrap gap-3">
        {tournaments.length > 1 && (
          <select
            value={selectedTid || ""}
            onChange={e => setSelectedTid(Number(e.target.value))}
            className="text-sm font-semibold rounded-xl px-4 py-2 outline-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            {tournaments.map(t => (
              <option key={t.id} value={t.id} style={{ background: "#0f172a" }}>{getArabicName(t.name, t.fieldTranslations)}</option>
            ))}
          </select>
        )}
        {seasons.length > 1 && (
          <select
            value={selectedSid || ""}
            onChange={e => setSelectedSid(Number(e.target.value))}
            className="text-sm font-semibold rounded-xl px-4 py-2 outline-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
          >
            {seasons.map(s => (
              <option key={s.id} value={s.id} style={{ background: "#0f172a" }}>{s.name || s.year}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Loading / Error ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-7 h-7 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">جاري تحميل الترتيب...</span>
        </div>
      )}
      {!loading && error && (
        <div className="text-center py-16 text-slate-500 text-sm">تعذّر تحميل الترتيب</div>
      )}

      {/* ── Table ── */}
      {!loading && !error && rows.length > 0 && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[580px]">
              <thead>
                <tr className="border-b text-slate-500 text-[10px] uppercase tracking-wider"
                  style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
                  <th className="text-right py-3 px-4 font-semibold w-8">#</th>
                  <th className="text-right py-3 px-4 font-semibold">الفريق</th>
                  <th className="text-center py-3 px-2 font-semibold">ل</th>
                  <th className="text-center py-3 px-2 font-semibold">ف</th>
                  <th className="text-center py-3 px-2 font-semibold">ت</th>
                  <th className="text-center py-3 px-2 font-semibold">خ</th>
                  <th className="text-center py-3 px-2 font-semibold">فارق</th>
                  <th className="text-center py-3 px-2 font-semibold hidden md:table-cell">آخر 5</th>
                  <th className="text-center py-3 px-4 font-bold text-white">نقاط</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                {rows.map((row, idx) => {
                  const zone = getZone(row.promotion?.text || row.rowName || "");
                  const isCurrentTeam = String(row.team?.id) === String(teamId);
                  const form = (row.form || "").split(",").filter(Boolean).slice(0, 5);
                  const diff = (row.scoresFor ?? 0) - (row.scoresAgainst ?? 0);

                  return (
                    <tr
                      key={row.team?.id ?? idx}
                      className="transition-colors duration-150 hover:bg-white/[0.03]"
                      style={isCurrentTeam ? { background: "rgba(56,189,248,0.05)" } : {}}
                    >
                      {/* Position */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {zone && (
                            <div className="w-0.5 h-5 rounded-full shrink-0" style={{ background: zone.color }} />
                          )}
                          <span className={`text-xs font-bold tabular-nums w-5 text-center ${zone ? "text-white" : "text-slate-500"}`}>
                            {row.position}
                          </span>
                        </div>
                      </td>

                      {/* Team name */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/team/${row.team?.slug || "team"}/${row.team?.id}`}
                          className="flex items-center gap-2.5 group/teamlink w-fit"
                        >
                          <TeamLogo id={row.team?.id} name={row.team?.name} />
                          <span className={`font-semibold truncate max-w-[130px] group-hover/teamlink:underline transition-colors ${
                            isCurrentTeam ? "text-sky-300" : "text-white hover:text-sky-300"
                          }`}>
                            {getArabicName(row.team?.shortName || row.team?.name, row.team?.fieldTranslations)}
                          </span>
                          {isCurrentTeam && (
                            <span className="text-[9px] font-black text-sky-400 bg-sky-400/10 px-1.5 py-0.5 rounded shrink-0">أنت</span>
                          )}
                        </Link>
                      </td>

                      <td className="py-3 px-2 text-center text-slate-300 tabular-nums text-xs">{row.matches}</td>
                      <td className="py-3 px-2 text-center text-slate-300 tabular-nums text-xs">{row.wins}</td>
                      <td className="py-3 px-2 text-center text-slate-300 tabular-nums text-xs">{row.draws}</td>
                      <td className="py-3 px-2 text-center text-slate-300 tabular-nums text-xs">{row.losses}</td>
                      <td className="py-3 px-2 text-center tabular-nums text-xs font-medium text-slate-300">
                        {diff > 0 ? `+${diff}` : diff}
                      </td>

                      {/* Last 5 form */}
                      <td className="py-3 px-2 hidden md:table-cell">
                        <div className="flex items-center gap-0.5 justify-center">
                          {form.length > 0
                            ? form.map((r, i) => <FormBubble key={i} result={r} />)
                            : <span className="text-slate-700 text-xs">—</span>
                          }
                        </div>
                      </td>

                      {/* Points */}
                      <td className="py-3 px-4 text-center">
                        <span className={`font-black tabular-nums text-base ${isCurrentTeam ? "text-sky-300" : "text-white"}`}>
                          {row.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          {zones.length > 0 && (
            <div className="border-t px-5 py-3" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => setRulesOpen(o => !o)}
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors w-full"
              >
                <span className="font-semibold">المناطق والمفتاح</span>
                <svg className={`w-3.5 h-3.5 mr-auto transition-transform ${rulesOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {rulesOpen && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {zones.map(z => (
                    <div key={z.label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: z.color }} />
                      <span className="text-xs text-slate-400">{z.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
