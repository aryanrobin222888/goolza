import axios from "axios";

// Webshare IP list to rotate through if Cloudflare blocks one
const proxyList = [
  { host: "154.6.127.72", port: "5543" },
  { host: "45.41.172.42", port: "5785" },
  { host: "46.202.79.41", port: "7051" },
  { host: "154.29.232.127", port: "6787" },
  { host: "194.38.18.231", port: "7293" },
  { host: "216.173.74.85", port: "5765" },
  { host: "82.27.247.117", port: "5451" },
  { host: "92.112.168.224", port: "6308" },
  { host: "45.38.78.47", port: "5984" },
  { host: "209.242.202.136", port: "6536" },
  { host: "38.154.224.147", port: "6688" },
  { host: "152.232.16.222", port: "8773" },
  { host: "184.174.27.116", port: "6339" },
  { host: "152.232.101.164", port: "8296" },
  { host: "82.21.209.42", port: "6371" },
  { host: "107.174.25.94", port: "5548" },
  { host: "173.244.41.108", port: "6292" },
  { host: "45.83.59.89", port: "7105" },
  { host: "154.6.8.61", port: "5528" },
  { host: "142.111.227.124", port: "6319" },
  { host: "31.59.18.92", port: "6673" },
  { host: "45.115.195.177", port: "6155" },
  { host: "209.242.204.61", port: "5802" },
  { host: "217.69.127.59", port: "6680" },
  { host: "109.196.161.69", port: "6517" },
  { host: "136.0.103.205", port: "5906" },
  { host: "45.14.83.48", port: "8026" },
  { host: "64.137.77.93", port: "5528" },
  { host: "104.239.104.169", port: "6393" },
  { host: "92.112.91.147", port: "6382" },
  { host: "191.101.25.199", port: "6596" },
  { host: "82.24.249.250", port: "6087" },
  { host: "82.29.244.171", port: "5994" },
  { host: "185.72.241.115", port: "7407" },
  { host: "108.165.197.209", port: "6448" },
  { host: "108.165.197.167", port: "6406" },
  { host: "45.131.92.209", port: "6820" },
  { host: "104.143.226.164", port: "5767" },
  { host: "166.0.102.41", port: "5280" },
  { host: "172.84.191.83", port: "7561" },
  { host: "23.109.208.124", port: "6648" },
  { host: "104.143.244.47", port: "5995" },
  { host: "45.131.103.122", port: "6108" },
  { host: "46.203.196.41", port: "5487" },
  { host: "185.15.179.218", port: "6184" },
  { host: "192.186.172.47", port: "9047" },
  { host: "104.239.73.90", port: "6633" },
  { host: "82.25.213.52", port: "5404" },
  { host: "193.25.167.8", port: "5539" },
  { host: "142.111.48.169", port: "6946" },
  { host: "104.239.39.139", port: "6068" },
  { host: "104.252.20.100", port: "6032" },
  { host: "31.58.23.199", port: "5772" },
  { host: "45.67.0.24", port: "6460" },
  { host: "45.150.176.123", port: "5996" },
  { host: "152.232.15.12", port: "8180" },
  { host: "142.111.93.149", port: "6710" },
  { host: "142.147.131.174", port: "6074" },
  { host: "45.43.82.127", port: "6121" },
  { host: "64.137.8.62", port: "6744" },
  { host: "198.23.214.26", port: "6293" },
  { host: "107.174.25.30", port: "5484" },
  { host: "185.101.254.50", port: "5597" },
  { host: "216.74.115.8", port: "6602" },
  { host: "45.38.111.121", port: "6036" },
  { host: "136.0.184.136", port: "6557" },
  { host: "185.198.37.154", port: "5841" },
  { host: "31.59.18.165", port: "6746" },
  { host: "82.25.216.78", port: "6920" },
  { host: "107.172.116.137", port: "5593" },
  { host: "192.177.103.167", port: "6660" },
  { host: "82.26.245.217", port: "7040" },
  { host: "104.164.49.214", port: "7869" },
  { host: "142.147.128.227", port: "6727" },
  { host: "104.249.55.83", port: "6451" },
  { host: "104.252.136.231", port: "7148" },
  { host: "198.105.100.106", port: "6357" },
  { host: "23.27.196.104", port: "6473" },
  { host: "84.33.236.42", port: "6685" },
  { host: "173.0.9.121", port: "5704" },
  { host: "84.33.214.21", port: "5907" },
  { host: "92.113.3.133", port: "6142" },
  { host: "191.101.41.178", port: "6250" },
  { host: "140.99.191.236", port: "8113" },
  { host: "46.202.227.172", port: "8179" },
  { host: "86.38.26.160", port: "6325" },
  { host: "92.119.182.39", port: "6684" },
  { host: "82.21.248.84", port: "6420" },
  { host: "82.26.222.7", port: "7819" },
  { host: "191.96.104.133", port: "5870" },
  { host: "46.203.88.240", port: "6864" },
  { host: "173.211.68.21", port: "6303" },
  { host: "206.206.73.29", port: "6645" },
  { host: "23.27.75.36", port: "6116" },
  { host: "84.33.243.10", port: "5701" },
  { host: "166.88.195.6", port: "5638" },
  { host: "172.120.120.17", port: "5172" },
  { host: "146.103.1.14", port: "5547" },
  { host: "212.135.181.89", port: "6271" },
  { host: "45.41.179.232", port: "6767" }
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
  const proxyUser = process.env.PROXY_USER;
  const proxyPass = process.env.PROXY_PASS;
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
      // If it's explicitly a 404 Not Found, don't try other proxies. It means the data simply doesn't exist yet (e.g. no events scheduled).
      if (err.response?.status === 404) {
        throw new Error("404 Not Found from SofaScore API");
      }
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
