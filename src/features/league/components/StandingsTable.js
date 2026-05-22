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

  if (!standings?.rows?.length) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        لا تتوفر بيانات الترتيب حالياً
      </div>
    );
  }

  const rows = standings.rows;
  // Collect unique zones for the legend
  const zones = [];
  rows.forEach((r) => {
    const z = getZone(r.promotion?.text);
    if (z && !zones.find((x) => x.label === z.label)) zones.push(z);
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="text-right py-3 px-4 font-semibold w-8">#</th>
              <th className="text-right py-3 px-4 font-semibold">الفريق</th>
              <th className="text-center py-3 px-3 font-semibold">ل</th>
              <th className="text-center py-3 px-3 font-semibold">ف</th>
              <th className="text-center py-3 px-3 font-semibold">ت</th>
              <th className="text-center py-3 px-3 font-semibold">خ</th>
              <th className="text-center py-3 px-3 font-semibold">فارق</th>
              <th className="text-center py-3 px-3 font-semibold">أهداف</th>
              <th className="text-center py-3 px-3 font-semibold hidden md:table-cell">
                آخر 5
              </th>
              <th className="text-center py-3 px-4 font-bold text-white">نقاط</th>
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
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4">
                    <Link
                      href={`/team/${row.team?.slug || "team"}/${row.team?.id}`}
                      className="flex items-center gap-2.5 group/tlink w-fit"
                    >
                      <TeamLogo id={row.team?.id} name={row.team?.name} />
                      <span className="text-white font-semibold text-sm truncate max-w-[140px] group-hover/tlink:text-sky-300 transition-colors">
                        {getArabicName(row.team?.shortName || row.team?.name, row.team?.fieldTranslations)}
                      </span>
                    </Link>
                  </td>

                  {/* Stats */}
                  <td className="py-3 px-3 text-center text-slate-300 tabular-nums">
                    {row.matches}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-300 tabular-nums">
                    {row.wins}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-300 tabular-nums">
                    {row.draws}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-300 tabular-nums">
                    {row.losses}
                  </td>
                  <td className="py-3 px-3 text-center tabular-nums font-medium text-slate-300">
                    {row.scoreDiffFormatted ?? (row.scoresFor - row.scoresAgainst > 0 ? `+${row.scoresFor - row.scoresAgainst}` : row.scoresFor - row.scoresAgainst)}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-400 tabular-nums text-xs">
                    {row.scoresFor}:{row.scoresAgainst}
                  </td>

                  {/* Last 5 form */}
                  <td className="py-3 px-3 hidden md:table-cell">
                    <div className="flex items-center gap-0.5 justify-center">
                      {form.length > 0
                        ? form.map((r, i) => <FormBubble key={i} result={r} />)
                        : <span className="text-slate-700 text-xs">—</span>
                      }
                    </div>
                  </td>

                  {/* Points */}
                  <td className="py-3 px-4 text-center">
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

      {/* Rules / Legend */}
      {zones.length > 0 && (
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
}
