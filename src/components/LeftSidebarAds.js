import React from "react";
import AdsterraBanner from "./AdsterraBanner";
import { SMARTLINK } from "./GoolzaSmartlink";

export default function LeftSidebarAds() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 sticky top-20 h-[calc(100vh-120px)] self-start mt-6 z-20 space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar pb-6">
      {/* Smartlink CTA Card — Top */}
      <a
        href={SMARTLINK}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-[300px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:border-orange-500/50 shadow-lg relative group"
        style={{ minHeight: "250px" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-amber-500/5 group-hover:from-orange-600/20 transition-all duration-300" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center" style={{ minHeight: "250px" }}>
          <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-3xl">📺</span>
          </div>
          <h3 className="text-white font-bold text-base mb-2 leading-snug">
            شاهد المباريات بدون قيود
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            بث مباشر HD بدون انقطاع على جميع الأجهزة
          </p>
          <span className="inline-block bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors duration-200">
            ابدأ المشاهدة الآن ←
          </span>
        </div>
        <span className="absolute top-2 right-2 bg-slate-950/80 text-[9px] text-slate-400 px-2 py-0.5 rounded border border-slate-800/80 tracking-wider font-sans select-none z-10">
          إعلان
        </span>
      </a>

      {/* Adsterra Banner - Height 600px (160x600 scaled to fit) */}
      <div className="w-[300px] h-[600px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 shadow-lg relative">
        {/* Ad Badge */}
        <span className="absolute top-2 right-2 bg-slate-950/80 text-[9px] text-slate-400 px-2 py-0.5 rounded border border-slate-800/80 tracking-wider font-sans select-none z-10">
          إعلان
        </span>
        <div className="w-full h-full relative" style={{ overflow: "hidden" }}>
          <AdsterraBanner
            id="bbd91c6aa3dfbf67943369b81e29aec1"
            width={160}
            height={600}
            style={{
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%) scale(1.875)",
              transformOrigin: "top center",
            }}
          />
        </div>
      </div>
    </aside>
  );
}
