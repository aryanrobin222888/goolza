/**
 * matchSlug.js
 * 
 * Generates and parses SEO-friendly URL slugs for match pages.
 * 
 * Format: {home-slug}-vs-{away-slug}-{matchId}
 * Example: real-madrid-vs-getafe-14081819
 *
 * The match ID is always appended at the end to guarantee uniqueness.
 * Parsing always extracts the ID from the last segment (after the last "-"),
 * so we can reliably fetch the match from the DB even with exotic team names.
 */

// Arabic → Latin transliteration map (common football team name characters)
const AR_MAP = {
  أ: "a", إ: "e", آ: "a", ا: "a", ب: "b", ت: "t", ث: "th", ج: "j",
  ح: "h", خ: "kh", د: "d", ذ: "dh", ر: "r", ز: "z", س: "s", ش: "sh",
  ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q",
  ك: "k", ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y", ى: "a",
  ة: "a", ء: "", ئ: "y", ؤ: "w", لا: "la",
};

/**
 * Converts a team name string (Arabic or Latin) into a URL-safe slug segment.
 * e.g. "ريال مدريد" → "ryal-mdrd"
 *      "Real Madrid" → "real-madrid"
 */
function toSlugSegment(name) {
  if (!name) return "team";

  // Replace Arabic chars using map
  let result = "";
  for (const char of name) {
    result += AR_MAP[char] ?? char;
  }

  return result
    .toLowerCase()
    .trim()
    // Replace accented characters
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace any non-alphanumeric except spaces/hyphens
    .replace(/[^a-z0-9\s-]/g, "")
    // Collapse whitespace and hyphens
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Generates a full match slug.
 * 
 * Priority:
 * 1. If the match has a .slug field from Sofascore API (already Latin), use it + ID
 * 2. Otherwise, build from home/away names + ID
 * 
 * @param {object} match  - match object with .id, .home.name, .away.name, .slug?
 * @returns {string}      - e.g. "real-madrid-vs-getafe-14081819"
 */
export function generateMatchSlug(match) {
  const id = match.id ?? match._id ?? "";

  // Prefer the Sofascore-provided slug (already Latin, e.g. "real-madrid-getafe")
  if (match.slug && /^[a-z0-9-]+$/.test(match.slug)) {
    return `${match.slug}-${id}`;
  }

  const homeSegment = toSlugSegment(match.home?.name || "home");
  const awaySegment = toSlugSegment(match.away?.name || "away");

  return `${homeSegment}-vs-${awaySegment}-${id}`;
}

/**
 * Extracts the match ID from a slug string.
 * The ID is always the last hyphen-separated segment.
 * 
 * @param {string} slug  - e.g. "real-madrid-vs-getafe-14081819"
 * @returns {string}     - e.g. "14081819"
 */
export function extractIdFromSlug(slug) {
  if (!slug) return "";
  const parts = slug.split("-");
  return parts[parts.length - 1];
}
