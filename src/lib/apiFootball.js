import axios from "axios";
import connectDB from "@/lib/db";
import FootballCache from "@/models/FootballCache";

export async function fetchFromApiFootball(endpoint, params = {}) {
  const centralProxyUrl = process.env.CENTRAL_PROXY_URL;
  const internalSecret = process.env.INTERNAL_API_SECRET;

  if (!centralProxyUrl || !internalSecret) {
    throw new Error("CENTRAL_PROXY_URL or INTERNAL_API_SECRET is not defined in environment variables");
  }

  // Construct a unique cache key based on endpoint and query parameters
  const API_FOOTBALL_URL = "https://v3.football.api-sports.io";
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join("&");
  const cacheKey = `${API_FOOTBALL_URL}/${endpoint}?${sortedParams}`;

  // 1. Try to read from the shared MongoDB cache first
  try {
    await connectDB();
    const cached = await FootballCache.findOne({ url: cacheKey }).lean();
    if (cached && new Date() < new Date(cached.expiresAt)) {
      return cached.data;
    }
  } catch (dbErr) {
    console.error("[Football Cache Read Error]", dbErr.message);
  }

  // 2. Fetch from the Central Proxy
  const proxyUrl = `${centralProxyUrl}/api/football/${endpoint}`;
  console.log(`[API-Football Proxy Client] Fetching from central proxy: ${proxyUrl} with params:`, params);

  const response = await axios.get(proxyUrl, {
    params,
    headers: {
      "x-internal-secret": internalSecret,
    },
    timeout: 15000,
  });

  return response.data;
}
