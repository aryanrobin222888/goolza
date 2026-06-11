"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";

export const useMatches = (date, initialData = null, serverDateStr) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const todayFormatted = format(startOfToday(), "yyyy-MM-dd");
  
  const hasInitialData =
    (serverDateStr ? formattedDate === serverDateStr : formattedDate === todayFormatted) &&
    initialData?.length > 0;

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
    initialData: hasInitialData ? initialData : undefined,
    staleTime: 60 * 1000,
  });
};
