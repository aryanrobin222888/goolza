/**
 * indexNow.js
 *
 * Utility to ping the Bing IndexNow API whenever new content is published.
 * IndexNow is a protocol supported by Bing, Yandex, and other search engines
 * that allows sites to instantly notify them of new or updated URLs.
 *
 * Prerequisites (set in .env.local):
 *   INDEXNOW_KEY  — The key string that matches the file at /[key].txt in public/
 *
 * Bing IndexNow docs: https://www.bing.com/indexnow
 */

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "0a54166f64e0492eb7c27829b8dbfa76";
const SITE_HOST = "goolza.com";
const BING_ENDPOINT = "https://www.bing.com/indexnow";

/**
 * Submits a single URL to Bing via IndexNow.
 *
 * @param {string} url - Full canonical URL, e.g. "https://goolza.com/match/real-madrid-vs-getafe-123"
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function pingIndexNow(url) {
  try {
    const body = {
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: [url],
    };

    const res = await fetch(BING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    // 200 = Accepted, 202 = Accepted (async), both are success
    if (res.ok || res.status === 202) {
      console.log(`[IndexNow] ✓ Pinged Bing for: ${url}`);
      return { success: true, message: "Submitted to Bing IndexNow" };
    }

    const errText = await res.text();
    throw new Error(`Bing IndexNow responded ${res.status}: ${errText}`);
  } catch (err) {
    console.error(`[IndexNow] ✗ Failed for ${url}:`, err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Submits multiple URLs to Bing IndexNow in a single batch request.
 * Bing supports up to 10,000 URLs per request.
 *
 * @param {string[]} urls - Array of canonical URLs
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function pingIndexNowBatch(urls) {
  if (!urls || urls.length === 0)
    return { success: true, message: "No URLs to submit" };

  try {
    const body = {
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const res = await fetch(BING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (res.ok || res.status === 202) {
      console.log(`[IndexNow] ✓ Batch submitted ${urls.length} URLs to Bing`);
      return {
        success: true,
        message: `Submitted ${urls.length} URLs to Bing IndexNow`,
      };
    }

    const errText = await res.text();
    throw new Error(`Bing IndexNow responded ${res.status}: ${errText}`);
  } catch (err) {
    console.error(`[IndexNow] ✗ Batch failed:`, err.message);
    return { success: false, message: err.message };
  }
}
