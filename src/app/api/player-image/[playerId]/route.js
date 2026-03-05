import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/player-image/[playerId]
 *
 * Server-side proxy for SofaScore player headshots.
 * Fetches the image with proper browser-like headers (SofaScore blocks
 * bare Node.js requests in production) and streams it back to the client.
 *
 * Returns the image with a 1-day cache header to avoid hammering SofaScore.
 */
export async function GET(req, { params }) {
  const { playerId } = await params;

  if (!playerId || !/^\d+$/.test(playerId)) {
    return new NextResponse("Invalid player ID", { status: 400 });
  }

  try {
    const url = `https://api.sofascore.com/api/v1/player/${playerId}/image`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "image/webp,image/png,image/jpeg,*/*",
        Referer: "https://www.sofascore.com/",
      },
    });

    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 24 hours on the CDN / browser
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
