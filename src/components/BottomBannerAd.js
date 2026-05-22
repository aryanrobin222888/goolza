"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export default function BottomBannerAd() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-t border-orange-500/20 px-4 py-3 shadow-[0_-10px_30px_rgba(255,122,0,0.1)] transition-all duration-300 animate-slide-up flex items-center justify-center">
      {/* Ad content wrapper */}
      <div className="relative w-full max-w-[728px] flex justify-center">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2.5 -right-2 bg-slate-900 hover:bg-orange-500 text-slate-400 hover:text-white p-1 rounded-full border border-slate-750 shadow-lg transition-all duration-200 z-10 hover:scale-105"
          aria-label="إغلاق الإعلان"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Anchor link */}
        <a
          href="https://reffpa.com/L?tag=d_5627581m_97c_&site=5627581&ad=97"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[728px] aspect-[728/90] overflow-hidden rounded-xl border border-slate-800/80 group relative"
        >
          <img
            src="/1xbet-banner.gif"
            alt="1xBet Advertisement"
            className="w-full h-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
          {/* Ad Badge */}
          <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] text-slate-400 px-1.5 py-0.5 rounded tracking-wide font-sans select-none border border-slate-850">
            إعلان
          </span>
        </a>
      </div>
    </div>
  );
}
