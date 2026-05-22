import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WCArticle from "@/models/WCArticle";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const article = await WCArticle.findOne({
      slug: params.slug,
      status: "PUBLISHED",
    }).lean();

    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (err) {
    console.error("[WC News Slug] GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
