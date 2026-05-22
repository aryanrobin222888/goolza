"use client";
import { useState, useEffect } from "react";
import { getArabicName } from "@/features/schedule/utils/mappers";

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-bold text-white text-left">{value}</span>
    </div>
  );
}

function SummaryCard({ label, value, color = "#38bdf8" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-5 rounded-2xl text-center"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="text-2xl font-black tabular-nums" style={{ color }}>{value ?? "—"}</span>
      <span className="text-[11px] text-slate-500">{label}</span>
    </div>
  );
}

function TrophyCard({ name, count }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
        🏆
      </div>
      <span className="flex-1 text-sm text-white font-semibold">{name}</span>
      <span className="font-black text-base text-amber-400 tabular-nums">{count}×</span>
    </div>
  );
}

function TransferCard({ type, transfer }) {
  const player  = transfer.player || {};
  const team    = type === "in" ? transfer.fromTeam : transfer.toTeam;
  const fee     = transfer.transferFee;
  const date    = transfer.date
    ? new Date(transfer.date * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : null;

  const isLoan  = transfer.type === "loan" || transfer.transferFeeRaw?.value === 0;

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
      <img
        src={`/api/sofascore/player/${player.id}/image`}
        alt={player.name}
        width={36} height={36}
        className="w-9 h-9 rounded-full object-cover shrink-0"
        style={{ background: "rgba(255,255,255,0.04)" }}
        onError={e => { e.target.src = "/api/placeholder/36/36"; }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{getArabicName(player.name, player.fieldTranslations)}</p>
        <span className="text-xs text-slate-400 truncate">
          {type === "in" ? "من" : "إلى"}: {getArabicName(team?.name, team?.fieldTranslations) || "—"}
        </span>
      </div>
      <div className="text-left shrink-0 space-y-0.5">
        {fee ? (
          <p className="text-xs font-black" style={{ color: type === "in" ? "#f87171" : "#34d399" }}>
            {fee}
          </p>
        ) : isLoan ? (
          <p className="text-xs font-bold text-slate-500">إعارة</p>
        ) : (
          <p className="text-xs text-slate-600">حر</p>
        )}
        {date && <p className="text-[10px] text-slate-600">{date}</p>}
      </div>
    </div>
  );
}

export default function TeamDetails({ teamId, team }) {
  const [details, setDetails]   = useState(null);
  const [trophies, setTrophies] = useState([]);
  const [transfers, setTransfers] = useState({ in: [], out: [] });
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    // Fetch team details + trophies + transfers in parallel
    Promise.allSettled([
      fetch(`/api/sofascore/team/${teamId}/details`).then(r => r.json()),
      fetch(`/api/sofascore/team/${teamId}/trophies`).then(r => r.json()),
      fetch(`/api/sofascore/team/${teamId}/transfers`).then(r => r.json()),
    ]).then(([detailsRes, trophiesRes, transfersRes]) => {
      if (detailsRes.status === "fulfilled") setDetails(detailsRes.value);
      if (trophiesRes.status === "fulfilled") {
        setTrophies(trophiesRes.value.trophies || []);
      }
      if (transfersRes.status === "fulfilled") {
        const t = transfersRes.value;
        setTransfers({
          in:  (t.transfersIn  || t.arrivals   || []).slice(0, 8),
          out: (t.transfersOut || t.departures  || []).slice(0, 8),
        });
      }
      setLoadingDetails(false);
    });
  }, [teamId]);

  // Founding year
  const foundedYear = team.foundationDateTimestamp
    ? new Date(team.foundationDateTimestamp * 1000).getFullYear()
    : null;

  const d = details || {};
  const venue = team.venue || {};

  return (
    <div className="space-y-6">

      {/* ── Squad Summary ── */}
      {(d.totalPlayers || d.averageAge || d.foreignPlayers) && (
        <div>
          <SectionTitle>نظرة عامة على الفريق</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard label="إجمالي اللاعبين"    value={d.totalPlayers}   color="#38bdf8" />
            <SummaryCard label="متوسط العمر"        value={d.averageAge ? Number(d.averageAge).toFixed(1) : null} color="#34d399" />
            <SummaryCard label="لاعبون أجانب"       value={d.foreignPlayers} color="#a78bfa" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Club Info ── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <PanelHeader color="#38bdf8">معلومات النادي</PanelHeader>
          <div className="px-5 pb-2">
            <InfoRow label="تاريخ التأسيس" value={foundedYear} />
            <InfoRow label="المدرب"         value={getArabicName(team.manager?.name, team.manager?.fieldTranslations)} />
            <InfoRow label="البلد"          value={getArabicName(team.country?.name, team.country?.fieldTranslations)} />
            <InfoRow label="الملعب"         value={getArabicName(venue.name, venue.fieldTranslations)} />
            <InfoRow label="السعة"          value={venue.capacity?.toLocaleString()} />
            <InfoRow label="الدوري"         value={getArabicName(team.primaryUniqueTournament?.name, team.primaryUniqueTournament?.fieldTranslations)} />
          </div>
        </div>

        {/* ── Trophies ── */}
        {trophies.length > 0 && (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <PanelHeader color="#fbbf24">الألقاب الكبرى</PanelHeader>
            <div className="px-5 pb-2">
              {trophies.map((t, i) => (
                <TrophyCard key={i} name={getArabicName(t.uniqueTournament?.name || t.name, t.uniqueTournament?.fieldTranslations || t.fieldTranslations)} count={t.trophyCount || 1} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Transfers ── */}
      {(transfers.in.length > 0 || transfers.out.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transfers.in.length > 0 && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <PanelHeader color="#34d399">الصفقات الواردة ↓</PanelHeader>
              <div className="px-5 pb-2">
                {transfers.in.map((t, i) => <TransferCard key={i} type="in" transfer={t} />)}
              </div>
            </div>
          )}
          {transfers.out.length > 0 && (
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <PanelHeader color="#f87171">الصفقات الصادرة ↑</PanelHeader>
              <div className="px-5 pb-2">
                {transfers.out.map((t, i) => <TransferCard key={i} type="out" transfer={t} />)}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-0.5 h-5 rounded-full" style={{ background: "linear-gradient(to bottom, #38bdf8, #818cf8)" }} />
      <h2 className="text-base font-black text-white">{children}</h2>
    </div>
  );
}

function PanelHeader({ color, children }) {
  return (
    <div className="flex items-center gap-2 px-5 py-3 border-b"
      style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
      <div className="w-0.5 h-4 rounded-full" style={{ background: color }} />
      <span className="text-sm font-black text-white">{children}</span>
    </div>
  );
}
