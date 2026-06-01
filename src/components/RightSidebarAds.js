import React from "react";
import AdsterraBanner from "./AdsterraBanner";
import { SMARTLINK } from "./GoolzaSmartlink";

export default function RightSidebarAds() {
  return (
    <aside className="hidden lg:block w-[300px] shrink-0 sticky top-20 h-[calc(100vh-120px)] self-start mt-6 z-20 space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar pb-6">
      {/* Smartlink CTA Card — Top (replaces Melbet 160x600) */}
      <a
        href={SMARTLINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-[300px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 shadow-lg relative group"
        style={{ minHeight: "600px" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-slate-900/0 to-amber-500/5 group-hover:from-orange-600/20 transition-all duration-300" />
        {/* Decorative circles */}
        <div className="absolute top-12 right-8 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl group-hover:bg-orange-500/10 transition-all duration-500" />
        <div className="absolute bottom-16 left-4 w-24 h-24 rounded-full bg-amber-500/5 blur-xl" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center" style={{ minHeight: "600px" }}>
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500/25 transition-all duration-300">
            <span className="text-5xl">⚽</span>
          </div>

          {/* Headline */}
          <h3 className="text-white font-extrabold text-xl mb-3 leading-tight">
            بث مباشر
            <br />
            <span className="text-orange-400">بدون انقطاع</span>
          </h3>

          {/* Sub */}
          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-[200px]">
            شاهد جميع مباريات اليوم بجودة HD على موبايلك وحاسوبك مجاناً
          </p>

          {/* Stats row */}
          <div className="flex gap-4 mb-6">
            <div className="text-center">
              <div className="text-orange-400 font-black text-lg">HD</div>
              <div className="text-slate-500 text-[10px]">جودة</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-orange-400 font-black text-lg">24/7</div>
              <div className="text-slate-500 text-[10px]">متاح</div>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-orange-400 font-black text-lg">مجاني</div>
              <div className="text-slate-500 text-[10px]">100%</div>
            </div>
          </div>

          {/* CTA Button */}
          <span className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm px-6 py-3 rounded-2xl transition-all duration-200 group-hover:scale-105 shadow-lg shadow-orange-500/20">
            <span>شاهد الآن</span>
            <span>←</span>
          </span>
        </div>

        <span className="absolute top-2 right-2 bg-slate-950/80 text-[9px] text-slate-400 px-2 py-0.5 rounded border border-slate-800/80 tracking-wider font-sans select-none z-10">
          إعلان
        </span>
      </a>

      {/* Adsterra Banner - Height 250px (300x250) */}
      <div className="w-[300px] h-[250px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 shadow-lg relative flex items-center justify-center">
        {/* Ad Badge */}
        <span className="absolute top-2 right-2 bg-slate-950/80 text-[9px] text-slate-400 px-2 py-0.5 rounded border border-slate-800/80 tracking-wider font-sans select-none z-10">
          إعلان
        </span>
        <AdsterraBanner
          id="b42b32b7c708438f29325ade779f40f9"
          width={300}
          height={250}
        />
      </div>
    </aside>
  );
}
