"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";

export const useMatches = (date, initialData = null) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const todayFormatted = format(startOfToday(), "yyyy-MM-dd");
  
  return useQuery({
    queryKey: ["matches", formattedDate],
    queryFn: async () => {
      const response = await axios.get(
        `/api/admin/live-matches?date=${formattedDate}`
      );

      if (!response.data || !response.data.matches) {
        return [];
      }

      return groupMatches(response.data.matches);
    },
    // Only use initialData if the date matches today and we actually have data
    initialData:
      formattedDate === todayFormatted && initialData?.length > 0
        ? initialData
        : undefined,
    staleTime: 60 * 1000,
  });
};
