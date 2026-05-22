import React from "react";

export default function RightSidebarAd() {
  return (
    <aside className="hidden md:block w-[300px] shrink-0 sticky top-20 h-[600px] self-start mt-6 z-20">
      <div className="w-[300px] h-[600px] rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 group">
        <a
          href="https://refpa3665.com/L?tag=d_5627564m_45415c_&site=5627564&ad=45415"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full relative"
        >
          <img
            src="/melbet-banner.gif"
            alt="Melbet Advertisement"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Ad Badge */}
          <span className="absolute top-2 right-2 bg-slate-950/80 text-[10px] text-slate-400 px-2 py-0.5 rounded border border-slate-850 tracking-wider font-medium font-sans select-none">
            إعلان
          </span>
        </a>
      </div>
    </aside>
  );
}
