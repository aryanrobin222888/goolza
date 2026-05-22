"use client";

import { useState } from "react";
import PreMatchDetails from "./PreMatchDetails";
import LiveMatchDetails from "./LiveMatchDetails";

export default function MatchTabs({ eventId, isLive, isFinished }) {
  // If match has started, default to Details. If not, default to Lineups.
  const [activeTab, setActiveTab] = useState(
    isLive || isFinished ? "details" : "lineups"
  );

  const tabs = [];
  
  if (isLive || isFinished) {
    tabs.push({ id: "details", label: "التفاصيل" });
  }
  tabs.push({ id: "lineups", label: "التشكيلات" });
  tabs.push({ id: "statistics", label: "الإحصائيات" });

  return (
    <div className="space-y-0 rounded-2xl overflow-hidden border border-slate-800">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-[#1a2332]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors duration-200 relative ${
              activeTab === tab.id
                ? "text-[#ff7a00]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#ff7a00] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#111923]">
        {activeTab === "details" && (
          <LiveMatchDetails eventId={eventId} />
        )}
        
        {activeTab === "lineups" && (
          <PreMatchDetails eventId={eventId} activeTab="lineups" />
        )}

        {activeTab === "statistics" && (
          <PreMatchDetails eventId={eventId} activeTab="statistics" />
        )}
      </div>
    </div>
  );
}
