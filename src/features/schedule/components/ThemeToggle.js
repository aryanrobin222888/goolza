"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid layout shift
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-full overflow-hidden text-slate-500 hover:text-[#0aa674] dark:text-slate-400 dark:hover:text-[#0aa674] transition-colors bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0aa674]/50 dark:focus:ring-[#0aa674]/50"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 0 : 1, opacity: isDark ? 0 : 1, rotate: isDark ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center p-2"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: isDark ? 1 : 0, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -90 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center p-2"
      >
        <Moon className="w-5 h-5" />
      </motion.div>
      <div className="w-5 h-5 opacity-0" /> {/* Sizing placeholder */}
    </button>
  );
}
