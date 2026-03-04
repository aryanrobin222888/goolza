"use client";

import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { format, addDays, subDays, startOfToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, AlertCircle, Clock } from "lucide-react";
import Footer from "@/features/schedule/components/Footer";
import { FacebookIcon, TelegramIcon, TikTokIcon, XIcon } from "@/features/schedule/components/SocialIcons";
import { useMatches } from "@/features/schedule/api/useMatches";

const CompetitionGroup = dynamic(
  () => import("@/features/schedule/components/CompetitionGroup"),
  {
    loading: () => (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-800/60 rounded-xl" />
        ))}
      </div>
    ),
    ssr: false,
  }
);

export default function ScheduleClient({ initialMatches }) {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const { data: competitions, isLoading, error } = useMatches(selectedDate, initialMatches);
  const today = startOfToday();
  const days = [
    { label: "الغد", date: addDays(today, 1) },
    { label: "اليوم", date: today },
    { label: "الأمس", date: subDays(today, 1) },
  ];

  const isActiveDay = (d) =>
    format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-slate-700 flex flex-col">
      
      {/* ═══ Header ═══ */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#0aa674] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0aa674]">gool<span className="text-white">za</span></span>
          </Link>

          <nav className="flex items-center gap-1">
               <a href="https://www.facebook.com/profile.php?id=61584373584701" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#0aa674] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full">
                  <FacebookIcon className="w-5 h-5" />
               </a>
               <a href="https://t.me/+kDM7uK-Kq20wODlk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#0aa674] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full">
                  <TelegramIcon className="w-5 h-5" />
               </a>
               <a href="https://www.tiktok.com/@goolza.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#0aa674] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full">
                  <TikTokIcon className="w-5 h-5" />
               </a>
               <a href="https://x.com/six1398361" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#0aa674] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full">
                  <XIcon className="w-4 h-4" />
               </a>
          </nav>
        </div>
      </header>

      {/* ═══ Main ═══ */}
      <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full">
        
        {/* Date Selector */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-12 w-full gap-4">
            
            <h1 className="text-3xl font-bold text-[#0aa674]">
              جدول المباريات
            </h1>
            <motion.div 
              className="flex bg-slate-900 p-1.5 rounded-full border border-slate-700 shadow-sm"
            >
                {days.map((day) => {
                    const active = isActiveDay(day.date);
                    return (
                        <button
                            key={day.label}
                            onClick={() => setSelectedDate(day.date)}
                            className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                active ? "text-white" : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {active && (
                                <motion.div 
                                    layoutId="activeTabV2"
                                    className="absolute inset-0 bg-[#0aa674] rounded-full shadow-lg shadow-[#0aa674]/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{day.label}</span>
                        </button>
                    )
                })}
            </motion.div>

        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="load"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="err"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-slate-900 font-medium">Unable to load matches</p>
              <p className="text-slate-500 text-sm mt-1">Please check your connection and try again.</p>
            </motion.div>
          ) : !competitions || competitions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                   <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-900 font-medium">لا توجد مباريات مجدولة</p>
              <p className="text-slate-500 text-sm mt-1">تحقق مرة أخرى لاحقًا للمباريات القادمة.</p>
            </motion.div>
          ) : (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {competitions.map((comp, idx) => (
                <CompetitionGroup
                  key={idx}
                  competition={comp}
                  index={idx}
                  selectedDate={selectedDate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ═══ Footer ═══ */}
      <Footer />
    </div>
  );
}
