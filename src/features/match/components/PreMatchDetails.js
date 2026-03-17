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
import AboutMatch from "./AboutMatch";
import SeasonStats from "./SeasonStats";
import TopPlayers from "./TopPlayers";

export default function PreMatchDetails({ eventId, activeTab }) {
  const { data: eventData } = useEventDetails(eventId);
  const { data: lineupsData } = useLineups(eventId);
  const { data: managersData } = useManagers(eventId);

  const event = eventData?.event;
  const homeTeamId = event?.homeTeam?.id;
  const awayTeamId = event?.awayTeam?.id;
  const utId = event?.tournament?.uniqueTournament?.id;
  const seasonId = event?.season?.id;

  const { data: homeStats } = useTeamSeasonStats(homeTeamId, utId, seasonId);
  const { data: awayStats } = useTeamSeasonStats(awayTeamId, utId, seasonId);

  return (
    <div className="bg-[#111923]">
      {activeTab === "lineups" && (
          <div className="space-y-0">
            {/* Lineups */}
            <LineupsView data={lineupsData} event={event} />

            {/* Referee */}
            <RefereeCard event={event} />

            {/* Managers */}
            <ManagersCard data={managersData} />

            {/* Injuries */}
            <InjuriesSuspensions data={lineupsData} />

            {/* About */}
            <AboutMatch event={event} />
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="space-y-0">
            {/* Info banner */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 text-xs text-slate-400">
                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                  i
                </span>
                Match &amp; player stats will appear once the match has kicked off
              </div>
            </div>

            {/* Season Stats */}
            <SeasonStats
              event={event}
              homeStats={homeStats?.statistics}
              awayStats={awayStats?.statistics}
            />

            {/* Top Players */}
            <TopPlayers data={lineupsData} />

            {/* About Match (also in statistics tab) */}
            <AboutMatch event={event} />
          </div>
        )}
    </div>
  );
}
