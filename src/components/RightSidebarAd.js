import React from "react";
import { SMARTLINK } from "./GoolzaSmartlink";

export default function RightSidebarAd() {
  return (
    <aside className="hidden md:block w-[300px] shrink-0 sticky top-20 h-[600px] self-start mt-6 z-20">
      <a
        href={SMARTLINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-[300px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50 group relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-amber-500/5 group-hover:from-orange-600/20 transition-all duration-300" />
        <div className="absolute top-16 right-8 w-40 h-40 rounded-full bg-orange-500/5 blur-3xl group-hover:bg-orange-500/10 transition-all duration-500" />
        <div className="absolute bottom-20 left-4 w-28 h-28 rounded-full bg-amber-500/5 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/25 transition-all duration-300">
            <span className="text-6xl">⚽</span>
          </div>

          <h3 className="text-white font-extrabold text-2xl mb-3 leading-tight">
            بث مباشر
            <br />
            <span className="text-orange-400">مجاني</span>
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[200px]">
            تابع جميع مباريات اليوم بجودة HD بدون انقطاع على أي جهاز
          </p>

          <div className="flex gap-5 mb-8">
            <div className="text-center">
              <div className="text-orange-400 font-black text-xl">HD</div>
              <div className="text-slate-500 text-[11px]">جودة</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-orange-400 font-black text-xl">24/7</div>
              <div className="text-slate-500 text-[11px]">متاح</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-orange-400 font-black text-xl">مجاني</div>
              <div className="text-slate-500 text-[11px]">100%</div>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm px-8 py-3.5 rounded-2xl transition-all duration-200 group-hover:scale-105 shadow-xl shadow-orange-500/20">
            <span>شاهد الآن</span>
            <span>←</span>
          </span>
        </div>

        <span className="absolute top-2 right-2 bg-slate-950/80 text-[10px] text-slate-400 px-2 py-0.5 rounded border border-slate-850 tracking-wider font-medium font-sans select-none">
          إعلان
        </span>
      </a>
    </aside>
  );
}
