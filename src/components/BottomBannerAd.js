"use client";

import React, { useState } from "react";

export default function BottomBannerAd() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 animate-slide-up flex items-center justify-center">
      {/* Ad content wrapper */}
      <div className="relative w-full max-w-[728px] flex justify-center">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-1 -right-1 md:-right-6 bg-slate-900 hover:bg-red-650 text-slate-400 hover:text-white p-1 rounded-full border border-slate-700 shadow-lg transition-all duration-200 z-10 hover:scale-105"
          aria-label="إغلاق الإعلان"
        >
          <svg
            xmlns="http://www.w3.org/2050/svg"
            className="h-4.5 w-4.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Anchor link */}
        <a
          href="https://reffpa.com/L?tag=d_5620268m_97c_&site=5620268&ad=97"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-[728px] aspect-[728/90] overflow-hidden rounded group relative"
        >
          <img
            src="/1xbet-banner.gif"
            alt="1xBet Advertisement"
            className="w-full h-full object-contain md:object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            loading="lazy"
          />
          {/* Ad Badge */}
          <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[9px] text-slate-400 px-1.5 py-0.5 rounded tracking-wide font-sans select-none">
            إعلان
          </span>
        </a>
      </div>
    </div>
  );
}
