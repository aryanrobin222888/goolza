"use client";

export default function AboutMatch({ event }) {
  if (!event) return null;

  const home = event.homeTeam?.name || "Home";
  const away = event.awayTeam?.name || "Away";
  const venue = event.venue;
  const tournament = event.tournament;
  const ut = tournament?.uniqueTournament;
  const round = event.roundInfo;

  // Format start time
  let dateStr = "";
  if (event.startTimestamp) {
    const d = new Date(event.startTimestamp * 1000);
    dateStr = d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
    dateStr = `${dateStr} at ${timeStr} UTC`;
  }

  const tournamentName = ut?.name || tournament?.name || "the tournament";
  const roundName = round?.name || "";
  const venueName = venue?.name || "";
  const venueCity = venue?.city?.name || "";
  const venueCountry = venue?.country?.name || "";

  const venueStr = [venueName, venueCity, venueCountry]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="px-4 py-5 border-t border-slate-800/60">
      <h3 className="text-sm font-bold text-white text-center mb-3">
        About the match
      </h3>
      <div className="text-sm text-slate-300 leading-relaxed space-y-2">
        <p>
          {home} is going head to head with {away}
          {dateStr && ` starting on ${dateStr}`}
          {venueStr && ` at ${venueStr}`}.
          {tournamentName && (
            <>
              {" "}
              The match is a part of the{" "}
              <span className="text-[#0aa674] font-medium">{tournamentName}</span>
              {roundName && `, ${roundName}`}.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
