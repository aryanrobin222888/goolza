import { NextResponse } from "next/server";
import { fetchFromSofaScore } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

// In-memory cache for proxied requests (2 min TTL)
const proxyCache = new Map();
const CACHE_TTL = 120 * 1000;

export async function GET(req, { params }) {
  try {
    const { path } = await params;
    const pathStr = Array.isArray(path) ? path.join("/") : path;
    const sofaUrl = `https://api.sofascore.com/api/v1/${pathStr}`;

    // Check if this is an image request
    const isImage = pathStr.includes("/image");

    // Check cache (skip for images — they're large)
    if (!isImage) {
      const now = Date.now();
      const cached = proxyCache.get(pathStr);
      if (cached && now - cached.timestamp < CACHE_TTL) {
        return NextResponse.json(cached.data);
      }
    }

    const { data, contentType } = await fetchFromSofaScore(sofaUrl, {
      responseType: isImage ? "arraybuffer" : "json",
    });

    if (isImage) {
      return new NextResponse(Buffer.from(data), {
        headers: {
          "Content-Type": contentType || "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Cache JSON responses
    proxyCache.set(pathStr, { timestamp: Date.now(), data });

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=120" },
    });
  } catch (error) {
    console.error("[SofaScore Proxy]", error.message);
    const is404 = error.message.includes("404");
    return NextResponse.json(
      { error: is404 ? "Not Found" : "Failed to fetch from SofaScore" },
      { status: is404 ? 404 : 502 }
    );
  }

}
