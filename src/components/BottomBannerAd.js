"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { SMARTLINK } from "./GoolzaSmartlink";

export default function BottomBannerAd() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-t border-orange-500/20 px-4 py-3 shadow-[0_-10px_30px_rgba(255,122,0,0.1)] transition-all duration-300 animate-slide-up flex items-center justify-center">
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

        {/* Smartlink Banner */}
        <a
          href={SMARTLINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 w-full max-w-[728px] h-[90px] rounded-xl border border-orange-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 hover:border-orange-500/60 hover:from-orange-950/30 transition-all duration-300 px-6 group"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <span className="text-2xl">⚽</span>
          </div>

          {/* Text */}
          <div className="flex flex-col items-start min-w-0">
            <span className="text-white font-extrabold text-sm leading-tight">
              بث مباشر مجاني — تابع المباريات الآن بجودة HD
            </span>
            <span className="text-orange-400 text-xs mt-0.5">
              بدون تقطيع • يعمل على جميع الأجهزة • مجاناً 100%
            </span>
          </div>

          {/* CTA */}
          <div className="shrink-0 mr-auto">
            <span className="inline-block bg-orange-500 group-hover:bg-orange-400 text-white font-black text-xs px-4 py-2 rounded-xl transition-colors duration-200 whitespace-nowrap">
              شاهد الآن ←
            </span>
          </div>
        </a>

        {/* Ad Badge */}
        <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] text-slate-400 px-1.5 py-0.5 rounded tracking-wide font-sans select-none border border-slate-850">
          إعلان
        </span>
      </div>
    </div>
  );
}
