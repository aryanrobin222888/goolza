/**
 * /api/indexing/indexnow — Internal route for triggering Bing IndexNow pings for Goolza.
 *
 * POST body: { urls: string[] }
 *
 * This route is protected by a shared secret (INDEXING_PING_SECRET) to prevent
 * unauthorized pings.
 *
 * Usage:
 *   fetch('/api/indexing/indexnow', {
 *     method: 'POST',
 *     headers: { 
 *       'Content-Type': 'application/json', 
 *       'x-ping-secret': process.env.INDEXING_PING_SECRET 
 *     },
 *     body: JSON.stringify({ 
 *       urls: [
 *         'https://goolza.com/news/article-1',
 *         'https://goolza.com/news/article-2'
 *       ] 
 *     })
 *   })
 */

import { NextResponse } from "next/server";
import { pingIndexNowBatch } from "@/lib/indexNow";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // ── Secret guard (prevents abuse) ──────────────────────────────────────────
  const secret = req.headers.get("x-ping-secret");
  const expectedSecret = process.env.INDEXING_PING_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized — invalid or missing x-ping-secret header" },
      { status: 401 }
    );
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { urls } = body;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid 'urls' array in request body" },
      { status: 400 }
    );
  }

  // Validate that all URLs are goolza.com URLs (prevents abuse)
  for (const url of urls) {
    if (typeof url !== "string" || (!url.startsWith("https://goolza.com/") && !url.startsWith("https://www.goolza.com/"))) {
      return NextResponse.json(
        { error: `URL must be a goolza.com URL: ${url}` },
        { status: 400 }
      );
    }
  }

  // ── Ping IndexNow ───────────────────────────────────────────────────────────
  const result = await pingIndexNowBatch(urls);

  if (!result.success) {
    return NextResponse.json(
      { error: result.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, submittedCount: urls.length, urls });
}
