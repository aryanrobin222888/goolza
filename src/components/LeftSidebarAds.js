import React from "react";
import AdsterraBanner from "./AdsterraBanner";

export default function LeftSidebarAds() {
  return (
    <aside className="hidden xl:block w-[300px] shrink-0 sticky top-20 h-[calc(100vh-120px)] self-start mt-6 z-20 space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar pb-6">
      {/* 1xBet Banner - Height 250px */}
      <div className="w-[300px] h-[250px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 shadow-lg relative flex items-center justify-center">
        {/* Ad Badge */}
        <span className="absolute top-2 right-2 bg-slate-950/80 text-[9px] text-slate-400 px-2 py-0.5 rounded border border-slate-800/80 tracking-wider font-sans select-none z-10">
          إعلان
        </span>
        <iframe
          scrolling="no"
          frameBorder="0"
          style={{ padding: "0px", margin: "0px", border: "0px", borderStyle: "none" }}
          width="100%"
          height="250"
          src="https://refbanners.com/I?tag=d_5627581m_170391c_&site=5627581&ad=170391"
          title="1xBet Advertisement"
        ></iframe>
      </div>

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

