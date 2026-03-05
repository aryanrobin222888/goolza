import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";

export const dynamic = "force-dynamic";

/**
 * GET /api/lineup/[matchId]
 * ─────────────────────────
 * Reads lineups from MongoDB only.
 * Returns { lineups: <object|null>, source: "cache"|"empty" }
 *
 * If lineups are not yet stored, returns 200 with lineups: null
 * (instead of server-side-fetching SofaScore which gets blocked).
 * The browser-side MatchLineup component handles the SofaScore
 * fetch + saves the result via POST (see below).
 */
export async function GET(req, { params }) {
  const { matchId } = await params;
  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  try {
    await connectDB();
    const matchIdNum = Number(matchId);
    const query = isNaN(matchIdNum)
      ? { "matches.id": matchId }
      : { $or: [{ "matches.id": matchId }, { "matches.id": matchIdNum }] };

    const record = await LiveMatch.findOne(query).lean();
    if (!record) {
      return NextResponse.json({ lineups: null, source: "empty" });
    }

    const match = record.matches.find(
      (m) => String(m.id) === String(matchId)
    );

    if (match?.lineups) {
      return NextResponse.json({ lineups: match.lineups, source: "cache" });
    }

    return NextResponse.json({ lineups: null, source: "empty" });
  } catch (err) {
    console.error("[lineup GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/lineup/[matchId]
 * ──────────────────────────
 * Body: the raw SofaScore lineup object.
 * Saves it into MongoDB so future page loads read from the DB.
 * Called by the browser after a successful SofaScore browser-fetch.
 */
export async function POST(req, { params }) {
  const { matchId } = await params;
  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  let lineups;
  try {
    lineups = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await connectDB();
    const matchIdNum = Number(matchId);

    // Try string id first, fall back to numeric
    const res = await LiveMatch.updateOne(
      { "matches.id": matchId },
      { $set: { "matches.$.lineups": lineups } }
    );

    if (res.matchedCount === 0 && !isNaN(matchIdNum)) {
      await LiveMatch.updateOne(
        { "matches.id": matchIdNum },
        { $set: { "matches.$.lineups": lineups } }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lineup POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
