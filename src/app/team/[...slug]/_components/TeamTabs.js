"use client";
import { useState } from "react";
import TeamStatistics from "./TeamStatistics";
import TeamPlayers from "./TeamPlayers";
import TeamDetails from "./TeamDetails";
import TeamMatches from "./TeamMatches";
import TeamStandings from "./TeamStandings";

const TABS = [
  { id: "stats",     label: "الإحصائيات", icon: "📊" },
  { id: "players",   label: "اللاعبون",   icon: "👥" },
  { id: "matches",   label: "المباريات",  icon: "⚽" },
  { id: "standings", label: "الترتيب",    icon: "🏆" },
  { id: "details",   label: "التفاصيل",  icon: "ℹ️"  },
];

export default function TeamTabs({ teamId, team, primaryTournamentId }) {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

      {/* ── Tab Navigation ── */}
      <div
        className="flex gap-1 p-1 rounded-2xl mb-8 overflow-x-auto scrollbar-hide"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`team-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={{
                background: isActive ? "rgba(56,189,248,0.08)" : "transparent",
                color: isActive ? "#38bdf8" : "rgba(255,255,255,0.35)",
                border: isActive ? "1px solid rgba(56,189,248,0.18)" : "1px solid transparent",
              }}
            >
              <span className="text-base leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div>
        {activeTab === "stats"     && <TeamStatistics teamId={teamId} primaryTournamentId={primaryTournamentId} />}
        {activeTab === "players"   && <TeamPlayers teamId={teamId} />}
        {activeTab === "matches"   && <TeamMatches teamId={teamId} />}
        {activeTab === "standings" && <TeamStandings teamId={teamId} primaryTournamentId={primaryTournamentId} />}
        {activeTab === "details"   && <TeamDetails teamId={teamId} team={team} />}
      </div>
    </div>
  );
}
