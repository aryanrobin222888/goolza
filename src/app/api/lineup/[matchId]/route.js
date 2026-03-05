import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";

export const dynamic = "force-dynamic";

/**
 * GET /api/lineup/[matchId]
 *
 * 1. Look up the match in MongoDB.
 * 2. If it already has lineups stored (and ?fresh is not set), return them.
 * 3. Otherwise fetch from SofaScore and persist before responding.
 */
export async function GET(req, { params }) {
  const { matchId } = await params;
  const { searchParams } = new URL(req.url);
  const fresh = searchParams.get("fresh") === "1";

  if (!matchId) {
    return NextResponse.json({ error: "matchId is required" }, { status: 400 });
  }

  try {
    await connectDB();

    const matchIdNum = Number(matchId);
    const query = isNaN(matchIdNum)
      ? { "matches.id": matchId }
      : { $or: [{ "matches.id": matchId }, { "matches.id": matchIdNum }] };

    const record = await LiveMatch.findOne(query).lean();

    if (record && !fresh) {
      const match = record.matches.find(
        (m) => String(m.id) === String(matchId)
      );
      if (match?.lineups) {
        return NextResponse.json({ lineups: match.lineups, source: "cache" });
      }
    }

    // ── Fetch fresh from SofaScore ──────────────────────────────────────────
    const sofaUrl = `https://www.sofascore.com/api/v1/event/${matchId}/lineups`;
    const sofaRes = await fetch(sofaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://www.sofascore.com/",
      },
      next: { revalidate: 0 },
    });

    if (!sofaRes.ok) {
      if (sofaRes.status === 404) {
        return NextResponse.json(
          { lineups: null, message: "Lineups not yet available" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: `SofaScore returned ${sofaRes.status}` },
        { status: 502 }
      );
    }

    const data = await sofaRes.json();
    const lineups = data; // raw SofaScore lineup object

    // ── Persist into MongoDB ────────────────────────────────────────────────
    if (record) {
      await LiveMatch.updateOne(
        { _id: record._id, "matches.id": matchId },
        { $set: { "matches.$.lineups": lineups } }
      ).catch(() => {
        // Also try numeric id
        return LiveMatch.updateOne(
          { _id: record._id, "matches.id": matchIdNum },
          { $set: { "matches.$.lineups": lineups } }
        );
      });
    }

    return NextResponse.json({ lineups, source: "live" });
  } catch (err) {
    console.error("[lineup] Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
