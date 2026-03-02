import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";

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

    return NextResponse.json(liveMatches);
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


