"use client";

import { useState, useEffect } from "react";

export default function AboutMatch({ event }) {
  if (!event) return null;

  const home = event.homeTeam?.name || "Home";
  const away = event.awayTeam?.name || "Away";
  const venue = event.venue;
  const tournament = event.tournament;
  const ut = tournament?.uniqueTournament;
  const round = event.roundInfo;

  // Format start time safely for hydration
  const [dateStr, setDateStr] = useState(() => {
    if (!event?.startTimestamp) return "";
    const d = new Date(event.startTimestamp * 1000);
    const date = d.toLocaleDateString("en-GB", {
       day: "numeric", month: "short", year: "numeric"
    });
    const time = d.toLocaleTimeString("en-GB", {
       hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC"
    });
    return `${date} at ${time} UTC`;
  });

  useEffect(() => {
    if (event?.startTimestamp) {
      const d = new Date(event.startTimestamp * 1000);
      const date = d.toLocaleDateString("en-GB", {
         day: "numeric", month: "short", year: "numeric"
      });
      const time = d.toLocaleTimeString("en-GB", {
         hour: "2-digit", minute: "2-digit", hour12: false
      });
      setDateStr(`${date} at ${time}`);
    }
  }, [event?.startTimestamp]);

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
