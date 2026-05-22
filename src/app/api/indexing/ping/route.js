/**
 * /api/indexing/ping — Internal route for triggering Google Indexing API pings.
 *
 * POST body: { url: string, type?: "URL_UPDATED" | "URL_DELETED" }
 *
 * This route is protected by a shared secret (INDEXING_PING_SECRET) to prevent
 * unauthorized pings. Call this from your admin tools or the live-matches POST handler.
 *
 * Usage:
 *   fetch('/api/indexing/ping', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'x-ping-secret': process.env.INDEXING_PING_SECRET },
 *     body: JSON.stringify({ url: 'https://goolza.com/match/real-madrid-vs-getafe-123' })
 *   })
 */

import { NextResponse } from "next/server";
import { pingGoogleIndex } from "@/lib/googleIndexing";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // ── Secret guard (prevents abuse) ──────────────────────────────────────────
  const secret = req.headers.get("x-ping-secret");
  const expectedSecret = process.env.INDEXING_PING_SECRET;

  // If a secret is configured, enforce it
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized — invalid or missing x-ping-secret header" },
      { status: 401 },
    );
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url, type = "URL_UPDATED" } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid 'url' field in request body" },
      { status: 400 },
    );
  }

  // Validate URL is a goolza.com URL (prevents pinging arbitrary domains)
  if (!url.startsWith("https://goolza.com/")) {
    return NextResponse.json(
      { error: "URL must be a goolza.com URL" },
      { status: 400 },
    );
  }

  // ── Ping Google ─────────────────────────────────────────────────────────────
  const result = await pingGoogleIndex(url, type);

  if (!result.success) {
    return NextResponse.json(
      { error: result.message },
      { status: result.message === "Credentials not configured" ? 503 : 500 },
    );
  }

  return NextResponse.json({ success: true, url, type, data: result.data });
}
