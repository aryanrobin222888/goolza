export function getArabicName(original, translations) {
  return translations?.nameTranslation?.ar || original;
}

export const mapEventToMatch = (event, league, tournamentId, tournament) => {
  // If it's already a Match object
  if (event.home && event.home.name) return event;

  const isLive = event.status?.type === "inprogress";
  const isFinished = event.status?.type === "finished";

  let status = "COMING_SOON";
  if (isLive) status = "LIVE";
  else if (isFinished) status = "ENDED";
  else if (event.status?.type === "postponed") status = "postponed";
  else if (event.status?.type === "canceled") status = "canceled";

  return {
    id: event.id?.toString() || Math.random().toString(),
    status,
    startTime: event.startTimestamp
      ? new Date(event.startTimestamp * 1000).toISOString()
      : null,
    time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    league,
    tournamentId,
    channel: "غير محدد",
    commentator: "غير محدد",
    home: {
      name: getArabicName(
        event.homeTeam?.name,
        event.homeTeam?.fieldTranslations
      ),
      logo: event.homeTeam?.logo || "",
      score: event.homeScore?.display ?? null,
      id: event.homeTeam?.id,
    },
    away: {
      name: getArabicName(
        event.awayTeam?.name,
        event.awayTeam?.fieldTranslations
      ),
      logo: event.awayTeam?.logo || "",
      score: event.awayScore?.display ?? null,
      id: event.awayTeam?.id,
    },
    tournament: tournament || event.tournament,
    roundInfo: event.roundInfo,
    customId: event.customId,
    season: event.season,
    slug: event.slug,
  };
};
