import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { fetchSofaScoreEvents } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const liveMatches = await LiveMatch.findOne({ date }).lean();

    if (!liveMatches) {
      return NextResponse.json({ date, matches: [] });
    }

    const matches = Array.isArray(liveMatches.matches) ? liveMatches.matches : [];

    // ====== MERGE SOFASCORE DATA ======
    try {
      const sofaData = await fetchSofaScoreEvents(date);
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
      console.warn("Failed to fetch fresh sofascore data for goolza live-matches:", err.message);
    }
    // ==================================

    return NextResponse.json({
      ...liveMatches,
      matches: matches
    });
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


