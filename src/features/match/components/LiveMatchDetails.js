"use client";

import {
  useEventDetails,
  useIncidents,
  useGraph,
  useBestPlayers,
  useH2H,
  useOdds,
} from "../hooks/useMatchDetails";
import AttackMomentum from "./AttackMomentum";
import IncidentTimeline from "./IncidentTimeline";
import HighestRatedPlayers from "./HighestRatedPlayers";
import HeadToHead from "./HeadToHead";
import OddsCard from "./OddsCard";

export default function LiveMatchDetails({ eventId }) {
  const { data: eventData } = useEventDetails(eventId);
  const { data: incidentsData } = useIncidents(eventId);
  const { data: graphData } = useGraph(eventId);
  const { data: bestPlayersData } = useBestPlayers(eventId);
  const { data: h2hData } = useH2H(eventId);
  const { data: oddsData } = useOdds(eventId);

  const event = eventData?.event;

  return (
    <div className="bg-[#111923]">
      {/* Attack Momentum */}
      <AttackMomentum data={graphData} event={event} incidents={incidentsData?.incidents} />

      {/* Incident Timeline */}
      <IncidentTimeline data={incidentsData} />

      {/* Highest-Rated Players */}
      <HighestRatedPlayers data={bestPlayersData} />

      {/* Head to Head */}
      <HeadToHead data={h2hData} event={event} />

      {/* Odds */}
      <OddsCard data={oddsData} event={event} />
    </div>
  );
}
