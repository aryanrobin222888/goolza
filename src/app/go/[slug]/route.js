import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { extractIdFromSlug } from "@/lib/matchSlug";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();
    
    // Extract the numeric match ID from the end of the slug
    const matchId = extractIdFromSlug(slug);
    const matchIdNum = Number(matchId);

    const query = isNaN(matchIdNum)
      ? { "matches.id": matchId }
      : { $or: [{ "matches.id": matchId }, { "matches.id": matchIdNum }] };

    const record = await LiveMatch.findOne(query).lean();
    if (record) {
      const match = record.matches.find((m) => String(m.id) === String(matchId));
      if (match && match.streamPageUrl) {
        return NextResponse.redirect(match.streamPageUrl, 302);
      }
    }
    
    // Fallback if not found: redirect to homepage
    return NextResponse.redirect(new URL("/", req.url), 302);
  } catch (error) {
    console.error("Redirect error in /go/[slug]:", error);
    return NextResponse.redirect(new URL("/", req.url), 302);
  }
}
