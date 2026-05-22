/**
 * googleIndexing.js
 *
 * Utility to ping the Google Indexing API whenever a new match page is created.
 * This signals Googlebot to crawl and index the URL immediately, rather than
 * waiting for the next sitemap crawl cycle.
 *
 * Prerequisites (set in .env.local):
 *   GOOGLE_INDEXING_KEY_JSON  — Base64-encoded service account JSON key
 *                               (recommended for Vercel / server deployments)
 *   OR
 *   GOOGLE_INDEXING_KEY_PATH  — Absolute path to the service account .json file
 *                               (for local dev only)
 *
 * How to obtain the key:
 *   1. Go to Google Cloud Console → APIs & Services → Credentials
 *   2. Create a Service Account → download JSON key
 *   3. In Google Search Console → Settings → Users & Permissions → Add User
 *      with the service account email as "Owner"
 *   4. Encode the JSON: `base64 -w 0 your-key.json` and paste into .env.local
 */

const INDEXING_API_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";
const SCOPES = ["https://www.googleapis.com/auth/indexing"];

/**
 * Obtains a short-lived OAuth2 access token from a service account JWT.
 * This avoids needing the `googleapis` npm package (zero extra dependency).
 *
 * @param {object} serviceAccount - Parsed service account JSON
 * @returns {Promise<string>} OAuth2 access token
 */
async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600;

  // Build JWT header + payload
  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const payload = btoa(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: SCOPES.join(" "),
      aud: "https://oauth2.googleapis.com/token",
      exp: expiry,
      iat: now,
    }),
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const signingInput = `${header}.${payload}`;

  // Import the RSA private key
  const pemBody = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");

  const keyBuffer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  // Sign the JWT
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    enc.encode(signingInput),
  );

  const signature = btoa(
    String.fromCharCode(...new Uint8Array(signatureBuffer)),
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${signingInput}.${signature}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Google OAuth token error: ${err}`);
  }

  const { access_token } = await tokenRes.json();
  return access_token;
}

/**
 * Loads the service account credentials from environment variables.
 * @returns {object|null} Parsed service account JSON, or null if not configured
 */
function loadServiceAccount() {
  // Method 1: Base64-encoded JSON (recommended for production/Vercel)
  if (process.env.GOOGLE_INDEXING_KEY_JSON) {
    try {
      const decoded = Buffer.from(
        process.env.GOOGLE_INDEXING_KEY_JSON,
        "base64",
      ).toString("utf-8");
      return JSON.parse(decoded);
    } catch (e) {
      console.error(
        "[GoogleIndexing] Failed to parse GOOGLE_INDEXING_KEY_JSON:",
        e.message,
      );
      return null;
    }
  }

  // Method 2: File path (local dev)
  if (process.env.GOOGLE_INDEXING_KEY_PATH) {
    try {
      // Dynamic require only in Node.js environment
      const fs = require("fs");
      const path = require("path");
      const keyPath = path.resolve(process.env.GOOGLE_INDEXING_KEY_PATH);
      return JSON.parse(fs.readFileSync(keyPath, "utf-8"));
    } catch (e) {
      console.error("[GoogleIndexing] Failed to load key file:", e.message);
      return null;
    }
  }

  return null;
}

/**
 * Pings the Google Indexing API to request immediate crawl of a URL.
 *
 * @param {string} url  - Full canonical URL to index, e.g. "https://goolza.com/match/real-madrid-vs-getafe-123"
 * @param {"URL_UPDATED"|"URL_DELETED"} type - Notification type (default: URL_UPDATED)
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function pingGoogleIndex(url, type = "URL_UPDATED") {
  const serviceAccount = loadServiceAccount();

  if (!serviceAccount) {
    // Credentials not configured yet — log a warning and bail gracefully
    console.warn(
      `[GoogleIndexing] Skipping index ping for ${url} — no credentials configured.\n` +
        `Set GOOGLE_INDEXING_KEY_JSON in .env.local to enable instant indexing.`,
    );
    return { success: false, message: "Credentials not configured" };
  }

  try {
    const accessToken = await getAccessToken(serviceAccount);

    const res = await fetch(INDEXING_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url, type }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Indexing API responded ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    console.log(
      `[GoogleIndexing] ✓ Pinged ${url} → ${data.urlNotificationMetadata?.url}`,
    );
    return { success: true, message: "Indexed successfully", data };
  } catch (err) {
    console.error(`[GoogleIndexing] ✗ Failed to ping ${url}:`, err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Pings multiple URLs in parallel (fire-and-forget, no throw).
 * Use this after bulk match creation to avoid blocking the response.
 *
 * @param {string[]} urls - Array of canonical match URLs
 */
export async function pingGoogleIndexBatch(urls) {
  if (!urls || urls.length === 0) return;
  await Promise.allSettled(urls.map((url) => pingGoogleIndex(url)));
}
