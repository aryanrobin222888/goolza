import axios from "axios";

// Webshare IP list to rotate through if Cloudflare blocks one
const proxyList = [
  { host: "31.59.20.176", port: "6754" },
  { host: "23.95.150.145", port: "6114" },
  { host: "198.23.239.134", port: "6540" },
  { host: "45.38.107.97", port: "6014" },
  { host: "107.172.163.27", port: "6543" },
  { host: "198.105.121.200", port: "6462" },
  { host: "64.137.96.74", port: "6641" },
  { host: "216.10.27.159", port: "6837" },
  { host: "142.111.67.146", port: "5611" },
  { host: "191.96.254.138", port: "6185" },
  { host: "31.59.20.176", port: "6754" },
];

const SOFA_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.sofascore.com/",
  Origin: "https://www.sofascore.com",
};

/**
 * Generic fetch from SofaScore through rotating proxies.
 * @param {string} url - Full SofaScore API URL
 * @param {object} opts - { responseType: 'json' | 'arraybuffer' }
 * @returns {Promise<{data: any, contentType: string}>}
 */
export async function fetchFromSofaScore(url, opts = {}) {
  const proxyUser = process.env.PROXY_USER || "nvdlmmdp";
  const proxyPass = process.env.PROXY_PASS || "2j29y5uhofbp";
  const responseType = opts.responseType || "json";

  let lastError = null;

  for (const proxy of proxyList) {
    const proxyConfig = {
      protocol: "http",
      host: proxy.host,
      port: parseInt(proxy.port, 10),
      auth: { username: proxyUser, password: proxyPass },
    };

    try {
      const response = await axios.get(url, {
        proxy: proxyConfig,
        headers: SOFA_HEADERS,
        timeout: 10000,
        responseType,
      });

      return {
        data: response.data,
        contentType: response.headers["content-type"] || "application/json",
      };
    } catch (err) {
      lastError = err;
      console.log(
        `[SofaScore] Failed ${proxy.host} → ${url} (${err.response?.status || err.message})`
      );
    }
  }

  throw new Error(lastError?.message || "All proxies failed");
}

// ─── Scheduled Events (existing) ──────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

export async function fetchSofaScoreEvents(date) {
  const now = Date.now();
  const cached = cache.get(date);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`[SofaScore Fetch] Returning cached data for ${date}`);
    return cached.data;
  }

  const url = `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${date}`;
  const { data } = await fetchFromSofaScore(url);

  cache.set(date, { timestamp: now, data });
  return data;
}
