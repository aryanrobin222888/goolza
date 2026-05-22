"use client";

import { useState } from "react";
import {
  useEventDetails,
  useLineups,
  useManagers,
  useTeamSeasonStats,
} from "../hooks/useMatchDetails";
import LineupsView from "./LineupsView";
import RefereeCard from "./RefereeCard";
import ManagersCard from "./ManagersCard";
import InjuriesSuspensions from "./InjuriesSuspensions";
import SeasonStats from "./SeasonStats";
import TopPlayers from "./TopPlayers";

export default function PreMatchDetails({ eventId, activeTab }) {
  const { data: eventData, isLoading: isEventLoading } = useEventDetails(eventId);
  const { data: lineupsData, isLoading: isLineupsLoading } = useLineups(eventId);
  const { data: managersData } = useManagers(eventId);

  const event = eventData?.event;
  const homeTeamId = event?.homeTeam?.id;
  const awayTeamId = event?.awayTeam?.id;
  const utId = event?.tournament?.uniqueTournament?.id;
  const seasonId = event?.season?.id;

  const { data: homeStats } = useTeamSeasonStats(homeTeamId, utId, seasonId);
  const { data: awayStats } = useTeamSeasonStats(awayTeamId, utId, seasonId);

  // If core data is still loading, show a skeleton or loading message
  if (isEventLoading || isLineupsLoading) {
    return (
      <div className="bg-[#111923] p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#0aa674] border-t-transparent flex-shrink-0 animate-spin rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#111923]">
      {activeTab === "lineups" ? (
          <div className="space-y-0">
            <LineupsView data={lineupsData} event={event} />
            <RefereeCard event={event} />
            <ManagersCard data={managersData} />
            <InjuriesSuspensions data={lineupsData} />
            
          </div>
        ) : null}

        {activeTab === "statistics" ? (
          <div className="space-y-0">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 text-xs text-slate-400">
                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                  i
                </span>
                ستظهر إحصائيات المباراة واللاعبين بمجرد بدء المباراة
              </div>
            </div>

            <SeasonStats
              event={event}
              homeStats={homeStats?.statistics}
              awayStats={awayStats?.statistics}
            />

            <TopPlayers data={lineupsData} event={event} />
          </div>
        ) : null}
    </div>
  );
}
