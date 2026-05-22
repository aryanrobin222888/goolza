import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import WCArticle from "@/models/WCArticle";
import { pingGoogleIndex } from "@/lib/googleIndexing";
import { pingIndexNow } from "@/lib/indexNow";

export const dynamic = "force-dynamic";

// ─── GET: List published articles (paginated) ────────────────────────────────
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const articles = await WCArticle.find({ status: "PUBLISHED" })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt imageUrl imageAlt tags author publishedAt")
      .lean();

    const total = await WCArticle.countDocuments({ status: "PUBLISHED" });

    return NextResponse.json({ articles, total, page, limit });
  } catch (err) {
    console.error("[WC News] GET error:", err);
    return NextResponse.json({ articles: [], total: 0 }, { status: 200 });
  }
}

// ─── POST: Create a new WC article and trigger indexing ──────────────────────
// Body: { title, slug, content, excerpt, imageUrl, imageAlt, tags, author, status }
// Protected by x-admin-secret header (same secret as other admin routes).
export async function POST(req) {
  // Admin secret guard
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

  const {
    title,
    slug,
    content,
    excerpt,
    imageUrl,
    imageAlt,
    tags,
    author,
    status = "PUBLISHED",
  } = body;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Required fields: title, slug, content" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const article = await WCArticle.create({
      title,
      slug,
      content,
      excerpt,
      imageUrl,
      imageAlt,
      tags,
      author,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    });

    // ── Ping Google + Bing if article is published (fire-and-forget) ──────────
    if (status === "PUBLISHED") {
      const articleUrl = `https://goolza.com/world-cup/news/${slug}`;
      pingGoogleIndex(articleUrl).catch(() => {});
      pingIndexNow(articleUrl).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      id: article._id,
      slug: article.slug,
      indexingTriggered: status === "PUBLISHED",
    });
  } catch (error) {
    // Duplicate slug guard
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An article with this slug already exists" },
        { status: 409 },
      );
    }
    console.error("[WC News] POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
