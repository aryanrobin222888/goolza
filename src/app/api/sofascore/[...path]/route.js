import { NextResponse } from "next/server";
import { fetchFromSofaScore } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

// In-memory cache for proxied requests (2 min TTL)
const proxyCache = new Map();
const CACHE_TTL = 120 * 1000;

export async function GET(req, { params }) {
  let pathStr = "";
  try {
    const { path } = await params;
    pathStr = Array.isArray(path) ? path.join("/") : path;
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
    console.warn("[SofaScore Proxy Bypass]", error.message);
    const isImage = pathStr.includes("/image") || pathStr.endsWith("/logo");
    if (isImage) {
      const transparentPng = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        "base64"
      );
      return new NextResponse(transparentPng, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
    return NextResponse.json({}, { status: 200 });
  }

}
