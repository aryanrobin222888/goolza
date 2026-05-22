import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { fetchSofaScoreEvents } from "@/lib/sofascore";
import { generateMatchSlug } from "@/lib/matchSlug";
import { pingGoogleIndexBatch } from "@/lib/googleIndexing";
import { pingIndexNowBatch } from "@/lib/indexNow";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const liveMatches = await LiveMatch.findOne({ date }).lean();

    if (!liveMatches) {
      return NextResponse.json({ date, matches: [] });
    }

    const matches = Array.isArray(liveMatches.matches)
      ? liveMatches.matches
      : [];

    // ====== MERGE SOFASCORE DATA ======
    try {
      const sofaData = await fetchSofaScoreEvents(date);
      const events = sofaData.events || [];
      if (events.length > 0) {
        matches.forEach((match) => {
          const event = events.find(
            (e) => e.id?.toString() === match.id?.toString(),
          );
          if (event) {
            const isLive = event.status?.type === "inprogress";
            const isFinished = event.status?.type === "finished";

            let status = "COMING_SOON";
            if (isLive) status = "LIVE";
            else if (isFinished) status = "ENDED";
            else if (event.status?.type === "postponed") status = "postponed";
            else if (event.status?.type === "canceled") status = "canceled";

            match.status = status;
            match.time = new Date(
              event.startTimestamp * 1000,
            ).toLocaleTimeString([], {
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
      console.warn(
        "Failed to fetch fresh sofascore data for Yallashoot live-matches:",
        err.message,
      );
    }
    // ==================================

    return NextResponse.json({
      ...liveMatches,
      matches: matches,
    });
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
} // ─── POST: Create / Update matches for a date ───────────────────────────────────────────────────
// Body: { date: "YYYY-MM-DD", matches: [...] }
// This upserts the match record and pings Google to index new URLs immediately.
export async function POST(req) {
  // Optional admin secret guard
  const adminSecret = req.headers.get("x-admin-secret");
  if (process.env.ADMIN_SECRET && adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { date, matches } = body;

  if (!date || !Array.isArray(matches)) {
    return NextResponse.json(
      { error: "Body must contain 'date' (string) and 'matches' (array)" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    // Upsert: create if not exists, replace matches array if exists
    const result = await LiveMatch.findOneAndUpdate(
      { date },
      { $set: { matches } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // ── Ping Google + Bing for each new match URL (fire-and-forget) ──────
    const urls = matches
      .filter((m) => m.id)
      .map((m) => `https://goolza.com/match/${generateMatchSlug(m)}`);

    // Don't await — both run in the background so the API response is instant
    pingGoogleIndexBatch(urls).catch(() => {});
    pingIndexNowBatch(urls).catch(() => {});

    return NextResponse.json({
      success: true,
      date,
      matchCount: matches.length,
      docId: result._id,
      indexingUrls: urls,
    });
  } catch (error) {
    console.error("Error saving live matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
