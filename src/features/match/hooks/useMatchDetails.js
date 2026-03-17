"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const sofaFetch = (path) =>
  axios.get(`/api/sofascore/${path}`).then((r) => r.data);

/**
 * Full event details (referee, venue, tournament, teams, etc.)
 */
export function useEventDetails(eventId) {
  return useQuery({
    queryKey: ["event-details", eventId],
    queryFn: () => sofaFetch(`event/${eventId}`),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Lineups, formations, missing players (injuries & suspensions)
 */
export function useLineups(eventId) {
  return useQuery({
    queryKey: ["lineups", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/lineups`),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Home and away managers
 */
export function useManagers(eventId) {
  return useQuery({
    queryKey: ["managers", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/managers`),
    enabled: !!eventId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Team season statistics in a specific tournament/season
 */
export function useTeamSeasonStats(teamId, uniqueTournamentId, seasonId) {
  return useQuery({
    queryKey: ["team-stats", teamId, uniqueTournamentId, seasonId],
    queryFn: () =>
      sofaFetch(
        `team/${teamId}/unique-tournament/${uniqueTournamentId}/season/${seasonId}/statistics/overall`
      ),
    enabled: !!teamId && !!uniqueTournamentId && !!seasonId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Match incidents — goals, cards, substitutions, periods
 */
export function useIncidents(eventId) {
  return useQuery({
    queryKey: ["incidents", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/incidents`),
    enabled: !!eventId,
    staleTime: 30 * 1000,
  });
}

/**
 * Attack momentum graph — minute-by-minute pressure values
 */
export function useGraph(eventId) {
  return useQuery({
    queryKey: ["graph", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/graph`),
    enabled: !!eventId,
    staleTime: 30 * 1000,
  });
}

/**
 * Highest-rated players — top 3 per team
 */
export function useBestPlayers(eventId) {
  return useQuery({
    queryKey: ["best-players", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/best-players/summary`),
    enabled: !!eventId,
    staleTime: 60 * 1000,
  });
}

/**
 * Head-to-head record between teams
 */
export function useH2H(eventId) {
  return useQuery({
    queryKey: ["h2h", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/h2h`),
    enabled: !!eventId,
    staleTime: 30 * 60 * 1000,
  });
}

/**
 * Betting odds — 1X2 full-time
 */
export function useOdds(eventId) {
  return useQuery({
    queryKey: ["odds", eventId],
    queryFn: () => sofaFetch(`event/${eventId}/odds/1/all`),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}
