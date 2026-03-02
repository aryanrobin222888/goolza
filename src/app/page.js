import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";
import ScheduleClient from "@/features/schedule/components/ScheduleClient";

export const dynamic = "force-dynamic";

export default async function SchedulePageV2() {
  let initialMatches = [];
  
  try {
    await connectDB();
    const todayStr = format(startOfToday(), "yyyy-MM-dd");
    const liveMatches = await LiveMatch.findOne({ date: todayStr }).lean();
    
    if (liveMatches && liveMatches.matches) {
      // Group the raw matches using the shared utility
      // Also, parsing to ensure we remove any non-serializable MongoDB objects before passing to a Client Component
      const groupedData = groupMatches(liveMatches.matches);
      initialMatches = JSON.parse(JSON.stringify(groupedData));
    }
  } catch (error) {
    console.error("Failed to fetch initial matches on server:", error);
  }

  return <ScheduleClient initialMatches={initialMatches} />;
}
