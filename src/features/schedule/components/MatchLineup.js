"use client";

import { useState, useEffect } from "react";

/**
 * MatchLineup
 * ─────────────────────────────────────────────────────────────────
 * Pure render component — all data comes from the server as props.
 * Lineup is already stored in MongoDB (matches[].lineups) and is
 * passed down from page.js.  No client-side SofaScore calls.
 *
 * Player photos are fetched via our own proxy route
 *   /api/player-image/[playerId]
 * which adds the right headers on the server side, so the feature
 * works in production too.
 *
 * Props:
 *   lineups  – raw SofaScore lineup object from MongoDB
 *   homeTeam – { name }
 *   awayTeam – { name }
 */

// ── Formation → positions ─────────────────────────────────────────────────────
function computePositions(formationStr, side) {
  const rows = (formationStr ?? "")
    .split("-")
    .map(Number)
    .filter((n) => !isNaN(n) && n > 0);

  const allRows = [1, ...rows]; // prepend GK row
  const n = allRows.length;

  const positions = [];
  allRows.forEach((count, rowIdx) => {
    const t = rowIdx / Math.max(n - 1, 1);
    const leftPct = side === "home"
      ? 95 - t * (95 - 53)
      : 5  + t * (47 - 5);

    // Vertical spread scales with player count, centred on 50%.
    const spread = count === 1 ? 0 : Math.min(82, count * 19);
    const topMin = 50 - spread / 2;

    for (let i = 0; i < count; i++) {
      const topPct = count === 1
        ? 50
        : topMin + (i / (count - 1)) * spread;
      positions.push({ leftPct, topPct });
    }
  });
  return positions;
}

function ratingColor(r) {
  if (r == null) return "#475569";
  if (r >= 7) return "#16a34a";
  if (r >= 6) return "#ca8a04";
  return "#dc2626";
}

function hexFromKey(obj, key, fallback) {
  const v = obj?.[key];
  return v ? `#${v}` : fallback;
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * Props:
 *   lineups  – lineup object already in MongoDB (may be null if not yet stored)
 *   matchId  – SofaScore event ID used as fallback fetch key
 *   homeTeam – { name }
 *   awayTeam – { name }
 *
 * Strategy:
 *   1. If `lineups` is provided → render immediately (instant, no loading)
 *   2. If `lineups` is null → fetch from /api/lineup/[matchId]
 *      • That route checks MongoDB first, then SofaScore, then persists
 *      • On localhost: works even if not yet stored
 *      • In production without stored data: silently hides the section
 */
export default function MatchLineup({ lineups: lineupsProp, matchId, homeTeam, awayTeam }) {
  const [lineups, setLineups] = useState(lineupsProp ?? null);
  const [loading, setLoading] = useState(!lineupsProp && !!matchId);

  useEffect(() => {
    // Already have data from MongoDB — nothing to fetch
    if (lineupsProp) return;
    if (!matchId) { setLoading(false); return; }

    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        // Stage 1: check MongoDB via our API (always fast, no external call)
        const apiRes = await fetch(`/api/lineup/${matchId}`);
        const apiData = apiRes.ok ? await apiRes.json() : null;

        if (apiData?.lineups) {
          if (!cancelled) { setLineups(apiData.lineups); setLoading(false); }
          return;
        }

        // Stage 2: MongoDB was empty — try SofaScore directly from the browser.
        // Works on localhost; in production SofaScore may block it (graceful hide).
        const sofaRes = await fetch(
          `https://www.sofascore.com/api/v1/event/${matchId}/lineups`,
          { headers: { Accept: "application/json" } }
        );

        if (!sofaRes.ok) {
          if (!cancelled) setLoading(false);
          return;
        }

        const lineupData = await sofaRes.json();
        if (!cancelled) { setLineups(lineupData); setLoading(false); }

        // Stage 3: persist to MongoDB (fire-and-forget) so next load is instant
        fetch(`/api/lineup/${matchId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lineupData),
        }).catch(() => {});

      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [matchId, lineupsProp]);

  if (loading) return <Skeleton />;
  if (!lineups?.home?.players?.length) return null;

  const hFormation = lineups.home?.formation ?? "";
  const aFormation = lineups.away?.formation ?? "";

  const hStarters = (lineups.home.players).filter((p) => !p.substitute);
  const aStarters = (lineups.away?.players ?? []).filter((p) => !p.substitute);
  const hSubs     = (lineups.home.players).filter((p) =>  p.substitute);
  const aSubs     = (lineups.away?.players ?? []).filter((p) =>  p.substitute);

  const hPos = computePositions(hFormation, "home");
  const aPos = computePositions(aFormation, "away");

  const hJersey = hexFromKey(lineups.home?.playerColor, "primary", "#1d4ed8");
  const hText   = hexFromKey(lineups.home?.playerColor, "number",  "#ffffff");
  const aJersey = hexFromKey(lineups.away?.playerColor, "primary", "#dc2626");
  const aText   = hexFromKey(lineups.away?.playerColor, "number",  "#ffffff");

  const referee = lineups.referee;

  const s = {
    wrap: {
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 16,
      overflow: "hidden",
      fontFamily: "inherit",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      background: "#1e293b",
      borderBottom: "1px solid #334155",
      gap: 8,
    },
    teamBox: {
      display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0,
    },
    teamBoxAway: {
      display: "flex", alignItems: "center", flexDirection: "row-reverse",
      gap: 6, flex: 1, minWidth: 0,
    },
    teamName: {
      fontSize: 13, fontWeight: 700, color: "#f1f5f9",
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100,
    },
    badge: {
      background: "#0f172a", color: "#94a3b8", fontSize: 10, fontWeight: 700,
      padding: "2px 6px", borderRadius: 20, border: "1px solid #334155",
      whiteSpace: "nowrap", flexShrink: 0,
    },
    centerLabel: {
      fontSize: 11, fontWeight: 700, color: "#64748b",
      textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap", flexShrink: 0,
    },
    pitchOuter: { position: "relative", width: "100%" },
    pitchSizer: {
      width: "100%",
      paddingBottom: "65%", // landscape: 105m × 68m → height ≈ 65% of width
      position: "relative",
    },
    pitchInner: { position: "absolute", inset: 0 },
    pitchSvg:   { position: "absolute", inset: 0, width: "100%", height: "100%" },
    playersLayer: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    subsWrap: {
      display: "flex", padding: "10px 14px",
      background: "#1e293b", borderTop: "1px solid #334155",
    },
    subsCol: { flex: 1, display: "flex", flexDirection: "column", gap: 5, minWidth: 0 },
    subsColAway: {
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "flex-end", gap: 5, minWidth: 0,
    },
    subsDivider: { width: 1, background: "#334155", margin: "0 10px" },
    subsTitle: {
      fontSize: 9, fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.7px", color: "#64748b", marginBottom: 2,
    },
    refRow: {
      display: "flex", alignItems: "center", gap: 5,
      padding: "7px 14px", background: "#0f172a",
      borderTop: "1px solid #1e293b", fontSize: 11,
    },
  };

  return (
    <div style={s.wrap} dir="rtl">

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.teamBox}>
          <span style={s.teamName}>{homeTeam?.name}</span>
          {hFormation && <span style={s.badge}>{hFormation}</span>}
        </div>
        <span style={s.centerLabel}>التشكيلة</span>
        <div style={s.teamBoxAway}>
          {aFormation && <span style={s.badge}>{aFormation}</span>}
          <span style={s.teamName}>{awayTeam?.name}</span>
        </div>
      </div>

      {/* ── Pitch ── */}
      <div style={s.pitchOuter}>
        <div style={s.pitchSizer}>
          <div style={s.pitchInner}>
            <svg style={s.pitchSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {[...Array(10)].map((_, i) => (
                <rect key={i} x={i*10} y={0} width={10} height={100}
                  fill={i%2===0 ? "#1a6b3a" : "#1c7340"} />
              ))}
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="0.5"/>
              <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <circle cx="50" cy="50" r=".7" fill="rgba(255,255,255,.4)"/>
              <rect x="2"  y="22" width="14" height="56" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <rect x="2"  y="34" width="6"  height="32" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <rect x="84" y="22" width="14" height="56" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <rect x="92" y="34" width="6"  height="32" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <rect x="0"  y="41" width="2" height="18" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
              <rect x="98" y="41" width="2" height="18" fill="rgba(255,255,255,.25)" stroke="rgba(255,255,255,.4)" strokeWidth="0.4"/>
            </svg>

            <div style={s.playersLayer}>
              {hStarters.map((p, i) => {
                const pos = hPos[i] ?? { leftPct: 75, topPct: 50 };
                return <Dot key={p.player?.id ?? i} player={p} leftPct={pos.leftPct} topPct={pos.topPct} bg={hJersey} fg={hText} />;
              })}
              {aStarters.map((p, i) => {
                const pos = aPos[i] ?? { leftPct: 25, topPct: 50 };
                return <Dot key={p.player?.id ?? i} player={p} leftPct={pos.leftPct} topPct={pos.topPct} bg={aJersey} fg={aText} />;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Substitutes ── */}
      {(hSubs.length > 0 || aSubs.length > 0) && (
        <div style={s.subsWrap}>
          <div style={s.subsCol}>
            <span style={s.subsTitle}>احتياطيون</span>
            {hSubs.map((p, i) => <SubRow key={p.player?.id??i} player={p} />)}
          </div>
          <div style={s.subsDivider} />
          <div style={s.subsColAway}>
            <span style={s.subsTitle}>احتياطيون</span>
            {aSubs.map((p, i) => <SubRow key={p.player?.id??i} player={p} />)}
          </div>
        </div>
      )}

      {/* ── Referee ── */}
      {referee?.name && (
        <div style={s.refRow}>
          <span>🟨</span>
          <span style={{ fontWeight: 700, color: "#64748b" }}>الحكم:</span>
          <span style={{ color: "#94a3b8" }}>{referee.name}</span>
        </div>
      )}
    </div>
  );
}

// ── Dot (player marker) ───────────────────────────────────────────────────────
function Dot({ player, leftPct, topPct, bg, fg }) {
  const rating   = player.statistics?.rating;
  const name     = player.player?.shortName || player.player?.name || "—";
  const shirtNum = player.shirtNumber ?? "";

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%,-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        zIndex: 10,
      }}
      title={player.player?.name || ""}
    >
      {/* Jersey circle */}
      <div
        style={{
          width: "clamp(20px,5.5vw,34px)",
          height: "clamp(20px,5.5vw,34px)",
          borderRadius: "50%",
          background: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "clamp(7px,1.8vw,11px)",
          border: "1.5px solid rgba(255,255,255,0.6)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.7)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {shirtNum}

        {/* Rating badge */}
        {rating != null && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -6,
              background: ratingColor(rating),
              color: "#fff",
              fontSize: "clamp(5px,1.1vw,7.5px)",
              fontWeight: 800,
              padding: "1px 3px",
              borderRadius: 4,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {typeof rating === "number" ? rating.toFixed(1) : rating}
          </span>
        )}
      </div>

      {/* Player name */}
      <span
        style={{
          fontSize: "clamp(5.5px,1.3vw,8.5px)",
          fontWeight: 700,
          color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,1),0 0 6px rgba(0,0,0,.9)",
          whiteSpace: "nowrap",
          maxWidth: "clamp(36px,9vw,62px)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          lineHeight: 1.1,
          display: "block",
        }}
      >
        {name}
      </span>
    </div>
  );
}

// ── SubRow ─────────────────────────────────────────────────────────────────

function SubRow({ player }) {
  const name = player.player?.shortName || player.player?.name || "—";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div
        style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "#334155", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 9, fontWeight: 700,
          color: "#cbd5e1", flexShrink: 0,
        }}
      >
        {player.shirtNumber}
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
        {name}
      </span>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 42, background: "#1e293b" }} />
      <div
        style={{
          width: "100%",
          paddingBottom: "65%",
          position: "relative",
          background: "linear-gradient(135deg,#1a6b3a,#1c7340)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.35)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          جاري تحميل التشكيلة…
        </div>
      </div>
    </div>
  );
}
