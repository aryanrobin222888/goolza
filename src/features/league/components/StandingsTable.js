"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { getArabicName } from "@/features/schedule/utils/mappers";

/** Map SofaScore rowName API fields to zone colors / labels */
const ZONE_CONFIG = {
  "Champions League": {
    color: "#3b82f6",
    label: "دوري أبطال أوروبا",
    dot: "bg-blue-500",
  },
  "Champions League Q": {
    color: "#3b82f6",
    label: "تصفيات دوري أبطال أوروبا",
    dot: "bg-blue-500",
  },
  "Europa League": {
    color: "#f97316",
    label: "الدوري الأوروبي",
    dot: "bg-orange-500",
  },
  "Conference League Q": {
    color: "#06b6d4",
    label: "تصفيات الدوري الكونفرنسي",
    dot: "bg-cyan-500",
  },
  "Conference League": {
    color: "#06b6d4",
    label: "الدوري الكونفرنسي",
    dot: "bg-cyan-500",
  },
  Relegation: {
    color: "#ef4444",
    label: "منطقة الهبوط",
    dot: "bg-red-500",
  },
  "Relegation playoff": {
    color: "#f59e0b",
    label: "ملحق الهبوط",
    dot: "bg-amber-500",
  },
};

function getZone(rowName) {
  if (!rowName) return null;
  for (const [key, val] of Object.entries(ZONE_CONFIG)) {
    if (rowName.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return null;
}

function FormBubble({ result }) {
  const map = {
    W: { bg: "bg-emerald-600", text: "text-white", label: "ف" },
    D: { bg: "bg-amber-500", text: "text-white", label: "ت" },
    L: { bg: "bg-rose-600", text: "text-white", label: "خ" },
  };
  const style = map[result] ?? { bg: "bg-slate-700", text: "text-slate-400", label: "؟" };
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

function TeamLogo({ id, name }) {
  const [err, setErr] = useState(false);
  if (err || !id)
    return (
      <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
        ⚽
      </span>
    );
  return (
    <img
      src={`/api/sofascore/team/${id}/image`}
      alt={name}
      width={24}
      height={24}
      className="w-6 h-6 object-contain rounded-full bg-slate-800"
      onError={() => setErr(true)}
      loading="lazy"
    />
  );
}

export default function StandingsTable({ standings }) {
  const [rulesOpen, setRulesOpen] = useState(false);

  // If standings is not an array, let's wrap it in an array or handle it
  const standingsList = Array.isArray(standings)
    ? standings
    : standings
      ? [standings]
      : [];

  if (standingsList.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        لا تتوفر بيانات الترتيب حالياً
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {standingsList.map((group, groupIdx) => {
        const rows = group.rows || [];
        const groupName = group.name || `المجموعة ${groupIdx + 1}`;
        // Clean/Translate Group names to beautiful Arabic e.g. Group A -> المجموعة A
        const displayGroupName = groupName
          .replace(/Group\s+/i, "المجموعة ")
          .replace(/Group-/i, "المجموعة ");

        if (rows.length === 0) return null;

        // Collect unique zones for this specific group's legend
        const zones = [];
        rows.forEach((r) => {
          const z = getZone(r.promotion?.text);
          if (z && !zones.find((x) => x.label === z.label)) zones.push(z);
        });

        return (
          <div key={groupIdx} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col">
            {/* Group Header (shown if there are multiple groups) */}
            {standingsList.length > 1 && (
              <div className="border-b border-slate-800 bg-slate-950/40 px-5 py-3.5 flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#ff7a00] rounded-full inline-block" />
                  {displayGroupName}
                </span>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[320px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="text-right py-2.5 px-3 font-semibold w-8">#</th>
                    <th className="text-right py-2.5 px-3 font-semibold">الفريق</th>
                    <th className="text-center py-2.5 px-2.5 font-semibold w-8">ل</th>
                    <th className="text-center py-2.5 px-2.5 font-semibold w-8 hidden sm:table-cell">ف</th>
                    <th className="text-center py-2.5 px-2.5 font-semibold w-8 hidden sm:table-cell">ت</th>
                    <th className="text-center py-2.5 px-2.5 font-semibold w-8 hidden sm:table-cell">خ</th>
                    <th className="text-center py-2.5 px-2.5 font-semibold w-10">فارق</th>
                    <th className="text-center py-2.5 px-2.5 font-semibold hidden sm:table-cell">أهداف</th>
                    <th className="text-center py-2.5 px-3 font-bold text-white w-12">نقاط</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {rows.map((row, idx) => {
                    const zone = getZone(row.promotion?.text);
                    const form = (row.team?.shortName && row.form
                      ? row.form.split(",")
                      : []
                    ).slice(0, 5);

                    return (
                      <tr
                        key={row.team?.id ?? idx}
                        className="hover:bg-slate-800/40 transition-colors duration-150 group"
                      >
                        {/* Rank */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            {zone && (
                              <div
                                className="w-0.5 h-5 rounded-full mr-1 shrink-0"
                                style={{ backgroundColor: zone.color }}
                              />
                            )}
                            <span
                              className={`text-xs font-bold tabular-nums w-5 text-center ${
                                zone ? "text-white" : "text-slate-500"
                              }`}
                            >
                              {row.position}
                            </span>
                          </div>
                        </td>

                        {/* Team */}
                        <td className="py-2.5 px-3">
                          <Link
                            href={`/team/${row.team?.slug || "team"}/${row.team?.id}`}
                            className="flex items-center gap-2 group/tlink w-fit"
                          >
                            <TeamLogo id={row.team?.id} name={row.team?.name} />
                            <span className="text-white font-semibold text-sm truncate max-w-[95px] sm:max-w-[140px] group-hover/tlink:text-sky-300 transition-colors">
                              {getArabicName(row.team?.shortName || row.team?.name, row.team?.fieldTranslations)}
                            </span>
                          </Link>
                        </td>

                        {/* Stats */}
                        <td className="py-2.5 px-2.5 text-center text-slate-300 tabular-nums">
                          {row.matches}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-slate-300 tabular-nums hidden sm:table-cell">
                          {row.wins}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-slate-300 tabular-nums hidden sm:table-cell">
                          {row.draws}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-slate-300 tabular-nums hidden sm:table-cell">
                          {row.losses}
                        </td>
                        <td className="py-2.5 px-2.5 text-center tabular-nums font-medium text-slate-300">
                          {row.scoreDiffFormatted ?? (row.scoresFor - row.scoresAgainst > 0 ? `+${row.scoresFor - row.scoresAgainst}` : row.scoresFor - row.scoresAgainst)}
                        </td>
                        <td className="py-2.5 px-2.5 text-center text-slate-400 tabular-nums text-xs hidden sm:table-cell">
                          {row.scoresFor}:{row.scoresAgainst}
                        </td>

                        {/* Points */}
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-black text-white tabular-nums text-base">
                            {row.points}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Rules / Legend (Only show for the very last group table to keep page tidy) */}
            {zones.length > 0 && groupIdx === standingsList.length - 1 && (
              <div className="border-t border-slate-800 px-5 py-3">
                <button
                  onClick={() => setRulesOpen((o) => !o)}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors w-full"
                >
                  <span className="font-semibold text-slate-300">المناطق</span>
                  {rulesOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 mr-auto" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 mr-auto" />
                  )}
                </button>
                {rulesOpen && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {zones.map((z) => (
                      <div key={z.label} className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: z.color }}
                        />
                        <span className="text-xs text-slate-400">{z.label}</span>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-1">
                      {[
                        ["ل", "المباريات المُلعبة"],
                        ["ف", "انتصارات"],
                        ["ت", "تعادلات"],
                        ["خ", "خسائر"],
                        ["فارق", "فارق الأهداف"],
                        ["أهداف", "له:عليه"],
                        ["نقاط", "مجموع النقاط"],
                      ].map(([abbr, full]) => (
                        <div key={abbr} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-300 font-semibold w-10">{abbr}</span>
                          <span className="text-slate-500">{full}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
