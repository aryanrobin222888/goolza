import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";
import ScheduleClient from "@/features/schedule/components/ScheduleClient";
import { syncMatchWithSofaScore } from "@/lib/matchSync";
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
              syncMatchWithSofaScore(match, event);
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
