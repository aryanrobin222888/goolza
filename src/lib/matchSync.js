/**
 * Utility to merge live SofaScore event data into a match object.
 * 
 * @param {Object} match - The match object from our database
 * @param {Object} event - The SofaScore event data
 * @returns {Object} The updated match object
 */
export function syncMatchWithSofaScore(match, event) {
  if (!match || !event) return match;

  const isLive = event.status?.type === "inprogress";
  const isFinished = event.status?.type === "finished";

  let status = "COMING_SOON";
  if (isLive) status = "LIVE";
  else if (isFinished) status = "ENDED";
  else if (event.status?.type === "postponed") status = "postponed";
  else if (event.status?.type === "canceled") status = "canceled";

  match.status = status;
  match.time = new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (event.homeScore?.display !== undefined) {
    match.home = match.home || {};
    match.home.score = event.homeScore.display;
  }
  if (event.awayScore?.display !== undefined) {
    match.away = match.away || {};
    match.away.score = event.awayScore.display;
  }

  // Preserve some other live data if available
  if (event.status?.description) {
      match.statusDescription = event.status.description;
  }

  return match;
}
