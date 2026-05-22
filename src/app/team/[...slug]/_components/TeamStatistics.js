"use client";
import { useState, useEffect } from "react";
import { getArabicName } from "@/features/schedule/utils/mappers";

// ── Helpers ──────────────────────────────────────────────────────────────────

function ProgressRow({ label, value, pct, color = "#38bdf8" }) {
  return (
    <div className="space-y-1.5 py-2.5 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-sm font-bold text-white tabular-nums">
          {pct !== undefined ? `${Number(pct).toFixed(1)}%` : (value ?? "—")}
        </span>
      </div>
      {pct !== undefined && (
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Number(pct) || 0)}%`,
              background: `linear-gradient(90deg, ${color}60, ${color})`,
              transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm font-bold text-white tabular-nums">{value ?? "—"}</span>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 py-5 px-3 rounded-2xl text-center"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="text-2xl md:text-3xl font-black tabular-nums" style={{ color }}>
        {value ?? "—"}
      </span>
      <span className="text-[11px] text-slate-500 font-medium leading-tight">{label}</span>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="px-5 py-3 border-b flex items-center gap-2"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
        <span className="text-sm font-black text-white">{title}</span>
      </div>
      <div className="px-5 pb-2">{children}</div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TeamStatistics({ teamId, primaryTournamentId }) {
  const [tournaments, setTournaments] = useState([]);
  const [seasons, setSeasons]         = useState([]);
  const [selectedTid, setSelectedTid] = useState(primaryTournamentId || null);
  const [selectedSid, setSelectedSid] = useState(null);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(false);

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

  // 2. Load seasons when tournament changes
  useEffect(() => {
    if (!selectedTid) return;
    setSelectedSid(null);
    setStats(null);
    fetch(`/api/sofascore/unique-tournament/${selectedTid}/seasons`)
      .then(r => r.json())
      .then(d => {
        const list = d.seasons || [];
        setSeasons(list);
        if (list.length) setSelectedSid(list[0].id);
      })
      .catch(() => {});
  }, [selectedTid]);

  // 3. Load stats when season changes
  useEffect(() => {
    if (!selectedTid || !selectedSid) return;
    setLoading(true);
    setError(false);
    fetch(`/api/sofascore/team/${teamId}/unique-tournament/${selectedTid}/season/${selectedSid}/statistics/overall`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setStats(d.statistics || null); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [teamId, selectedTid, selectedSid]);

  const s = stats || {};
  const rating = s.rating ? Number(s.rating).toFixed(2) : null;

  return (
    <div className="space-y-6">

      {/* ── Selectors ── */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Tournament picker */}
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
        {/* Season picker */}
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
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">جاري تحميل الإحصائيات...</span>
        </div>
      )}
      {!loading && error && (
        <div className="text-center py-16 text-slate-500 text-sm">تعذّر تحميل الإحصائيات</div>
      )}

      {/* ── Data ── */}
      {!loading && !error && stats && (
        <div className="space-y-6">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {rating && <SummaryCard label="تقييم سوفاسكور" value={rating} color="#fbbf24" />}
            <SummaryCard label="مباريات ملعوبة"    value={s.matches}       color="#38bdf8" />
            <SummaryCard label="أهداف مسجلة"       value={s.goals}         color="#34d399" />
            <SummaryCard label="أهداف مستقبلة"    value={s.goalsConceded}  color="#f87171" />
            <SummaryCard label="تمريرات حاسمة"     value={s.assists}       color="#a78bfa" />
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Attacking */}
            <Section title="الهجوم" color="#34d399">
              <StatRow label="أهداف" value={s.goals} />
              <StatRow label="متوسط أهداف/مباراة" value={s.goalsPerGame ? Number(s.goalsPerGame).toFixed(2) : null} />
              <StatRow label="تسديدات على المرمى" value={s.shotsOnTarget} />
              <StatRow label="فرص كبيرة خُلقت" value={s.bigChancesCreated} />
              <StatRow label="فرص كبيرة أُهدرت" value={s.bigChancesMissed} />
              <StatRow label="أهداف بالرأس" value={s.headedGoals} />
              <StatRow label="أهداف خارج المنطقة" value={s.goalsFromOutOfBox} />
              <ProgressRow label="المراوغات الناجحة" value={s.successfulDribbles} pct={s.successfulDribblesPercentage} color="#34d399" />
              <ProgressRow label="الكرات العرضية الدقيقة" value={s.accurateCrosses} pct={s.accurateCrossesPercentage} color="#34d399" />
              <StatRow label="التسللات" value={s.offsides} />
            </Section>

            {/* Passes */}
            <Section title="التمريرات" color="#38bdf8">
              <ProgressRow label="التمريرات الدقيقة" value={s.accuratePasses} pct={s.accuratePassesPercentage} color="#38bdf8" />
              <ProgressRow label="الكرات الطويلة الدقيقة" value={s.accurateLongBalls} pct={s.accurateLongBallsPercentage} color="#38bdf8" />
              <StatRow label="التمريرات المفتاحية" value={s.keyPasses} />
              <StatRow label="التمريرات (المجموع)" value={s.totalPasses} />
              <StatRow label="التمريرات في آخر الثلث" value={s.finalThirdEntries} />
            </Section>

            {/* Defending */}
            <Section title="الدفاع" color="#f87171">
              <StatRow label="الشباك النظيفة" value={s.cleanSheet} />
              <StatRow label="الإنقاذات" value={s.saves} />
              <StatRow label="التدخلات" value={s.tackles} />
              <StatRow label="التصفيات" value={s.clearances} />
              <StatRow label="الإعتراضات" value={s.interceptions} />
              <StatRow label="التسديدات المحجوبة" value={s.blocks} />
              <StatRow label="أخطاء أفضت لهدف" value={s.errorsLeadingToGoal} />
              <StatRow label="أخطاء أفضت لتسديدة" value={s.errorsLeadingToShot} />
              <StatRow label="البطاقات الصفراء" value={s.yellowCards} />
              <StatRow label="البطاقات الحمراء" value={s.redCards} />
            </Section>

          </div>
        </div>
      )}
    </div>
  );
}
