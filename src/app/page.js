import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";
import ScheduleClient from "@/features/schedule/components/ScheduleClient";
import { fetchSofaScoreEvents } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

export default async function SchedulePageV2() {
  let initialMatches = [];
  
  try {
    await connectDB();
    const todayStr = format(startOfToday(), "yyyy-MM-dd");
    const liveMatches = await LiveMatch.findOne({ date: todayStr }).lean();
    
    if (liveMatches && liveMatches.matches) {
      let matches = Array.isArray(liveMatches.matches) ? liveMatches.matches : [];

      // ====== MERGE SOFASCORE DATA ======
      try {
        const sofaData = await fetchSofaScoreEvents(todayStr);
        const events = sofaData.events || [];
        if (events.length > 0) {
          matches.forEach((match) => {
            const event = events.find((e) => e.id?.toString() === match.id?.toString());
            if (event) {
              const isLive = event.status?.type === "inprogress";
              const isFinished = event.status?.type === "finished";

              let status = "COMING_SOON";
              if (isLive) status = "LIVE";
              else if (isFinished) status = "ENDED";
              else if (event.status?.type === "postponed") status = "postponed";
              else if (event.status?.type === "canceled") status = "canceled";

              match.status = status;
              match.time = new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              if (event.homeScore?.display !== undefined) {
                match.home = match.home || {};
                match.home.score = event.homeScore.display;
              }
              if (event.awayScore?.display !== undefined) {
                match.away = match.away || {};
                match.away.score = event.awayScore.display;
              }
            }
          });
        }
      } catch (err) {
        console.warn("Failed to fetch fresh sofascore data for server-side initialMatches:", err.message);
      }
      // ==================================

      // Group the raw matches using the shared utility
      const groupedData = groupMatches(matches);
      initialMatches = JSON.parse(JSON.stringify(groupedData));
    }
  } catch (error) {
    console.error("Failed to fetch initial matches on server:", error);
  }

  return <ScheduleClient initialMatches={initialMatches} />;
}
