"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LeagueHeader({ tournament, season }) {
  const [imgError, setImgError] = useState(false);

  const logoUrl = `/api/sofascore/unique-tournament/${tournament.id}/image`;
  const seasonLabel = season?.year
    ? `${season.year}/${String(season.year + 1).slice(2)}`
    : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 mb-6">
      {/* Ambient glow behind logo */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, #0aa674 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-center gap-5 px-6 py-7">
        {/* Breadcrumb */}
        <div className="absolute top-3 right-5 flex items-center gap-1 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-slate-400">{tournament.nameAr}</span>
        </div>

        {/* League Logo */}
        <div className="relative shrink-0 w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center overflow-hidden shadow-xl shadow-black/30 mt-3">
          {!imgError ? (
            <img
              src={logoUrl}
              alt={`شعار ${tournament.nameAr}`}
              width={64}
              height={64}
              className="w-14 h-14 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-3xl">🏆</span>
          )}
        </div>

        {/* League Info */}
        <div className="mt-3">
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">
            {tournament.nameAr}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
              <span className="text-base">{tournament.flag}</span>
              {tournament.countryAr}
            </span>
            {seasonLabel && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-sm text-[#0aa674] font-semibold bg-[#0aa674]/10 px-2.5 py-0.5 rounded-full border border-[#0aa674]/20">
                  موسم {seasonLabel}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5 font-medium tracking-wide uppercase">
            {tournament.name}
          </p>
        </div>
      </div>
    </div>
  );
}
