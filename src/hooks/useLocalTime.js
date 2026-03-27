import { useState, useEffect } from "react";

export function useLocalTime(startTime, fallbackTime) {
  const [time, setTime] = useState(fallbackTime || "");

  useEffect(() => {
    if (startTime) {
      try {
        const localTime = new Date(startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        setTime(localTime);
      } catch (error) {
        console.error("Failed to format local time", error);
      }
    }
  }, [startTime]);

  return time;
}
