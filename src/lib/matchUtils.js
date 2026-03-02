export const groupMatches = (matchesArray) => {
  if (!matchesArray || !Array.isArray(matchesArray)) return [];

  const matchesByTournament = matchesArray.reduce((acc, match) => {
    // CASE A: Raw Match Data
    if (match.tournament) {
      const tournament = match.tournament;
      const uniqueTournament = tournament.uniqueTournament;
      const key = uniqueTournament ? uniqueTournament.id : tournament.id;

      if (!acc[key]) {
        acc[key] = {
          info: {
            name: uniqueTournament
              ? uniqueTournament.name
              : tournament.name,
            category: uniqueTournament
              ? uniqueTournament.category
              : tournament.category,
            uniqueTournament: uniqueTournament,
            fieldTranslations: uniqueTournament
              ? uniqueTournament.fieldTranslations
              : tournament.fieldTranslations,
          },
          matches: [],
        };
      }
      acc[key].matches.push(match);
      return acc;
    }

    // CASE B: Saved Match Data
    if (match.league) {
      const key = match.tournamentId || match.league;

      if (!acc[key]) {
        acc[key] = {
          info: {
            name: match.league,
            category: { name: "Live Selection" },
            uniqueTournament: match.tournamentId
              ? { id: match.tournamentId }
              : undefined,
            fieldTranslations: undefined,
          },
          matches: [],
        };
      }
      acc[key].matches.push(match);
      return acc;
    }

    return acc;
  }, {});

  return Object.values(matchesByTournament);
};
