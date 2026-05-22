"use client";

import Link from "next/link";
import { useState } from "react";
import { format, addDays, subDays, startOfToday } from "date-fns";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { Zap, AlertCircle, Clock } from "lucide-react";
import Logo from "@/components/ui/Logo";
import Footer from "@/features/schedule/components/Footer";
import MobileAdsCarousel from "@/components/MobileAdsCarousel";
import {
  FacebookIcon,
  TelegramIcon,
  TikTokIcon,
  XIcon,
} from "@/features/schedule/components/SocialIcons";
import { useMatches } from "@/features/schedule/api/useMatches";
import CompetitionGroup from "@/features/schedule/components/CompetitionGroup";

export default function ScheduleClient({ initialMatches, children }) {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const {
    data: competitions,
    isLoading,
    error,
  } = useMatches(selectedDate, initialMatches);
  const today = startOfToday();
  const days = [
    { label: "الغد", date: addDays(today, 1) },
    { label: "اليوم", date: today },
    { label: "الأمس", date: subDays(today, 1) },
  ];

  const isActiveDay = (d) =>
    format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-orange-500/25 flex flex-col">
        {/* ═══ Header ═══ */}
        <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-md border-b border-slate-800/80">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo />
            </Link>

            <nav className="flex items-center gap-1">
              <a
                href="https://www.facebook.com/profile.php?id=61584373584701"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white hover:text-[#ff7a00] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/+kDM7uK-Kq20wODlk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-white hover:text-[#ff7a00] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full"
              >
                <TelegramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@goolza.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-white hover:text-[#ff7a00] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/six1398361"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-white hover:text-[#ff7a00] transition-colors duration-300 p-2 hover:bg-slate-800 rounded-full"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </nav>
          </div>
        </header>

        {/* ═══ Main ═══ */}
        <main className="max-w-4xl mx-auto px-6 py-10 flex-1 w-full animate-fade-in">
          {/* World Cup Promo Banner */}
          <Link
            href="/world-cup"
            className="block mb-10 w-full group"
            dir="rtl"
          >
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#2e3192] to-[#4b358a] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-[0_5px_30px_rgba(75,53,138,0.4)] transition-all duration-500 shadow-xl">
              {/* Background Subtle Gradient effects */}
              <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-[#22d3ee]/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-[-50%] right-[-10%] w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>

              {/* Right Side (Content) */}
              <div className="relative flex flex-col items-start z-10 w-full md:w-auto">
                {/* Badge */}
                <div className="bg-white/10 border border-white/10 px-3 py-1 rounded-full flex items-center justify-center gap-2 mb-4 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
                  <span className="text-[11px] font-bold text-white/90">
                    تغطية خاصة
                  </span>
                </div>

                {/* Title Area */}
                <div className="flex items-center gap-3 mb-2 w-full">
                  <h2
                    className="text-3xl font-black text-white shrink-0 tracking-tight"
                    style={{ fontFamily: "var(--font-cairo), sans-serif" }}
                  >
                    كأس العالم 2026 FIFA™
                  </h2>
                  <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
                    <img
                      src="https://flagcdn.com/w40/us.png"
                      className="w-6 h-6 rounded-full border border-[#2e3192] object-cover shadow-sm"
                      alt="USA"
                    />
                    <img
                      src="https://flagcdn.com/w40/ca.png"
                      className="w-6 h-6 rounded-full border border-[#2e3192] object-cover shadow-sm -ml-2"
                      alt="Canada"
                    />
                    <img
                      src="https://flagcdn.com/w40/mx.png"
                      className="w-6 h-6 rounded-full border border-[#2e3192] object-cover shadow-sm -ml-2"
                      alt="Mexico"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <p className="text-indigo-100 text-sm md:text-[0.95rem] leading-relaxed max-w-xl font-medium opacity-90 text-right w-full">
                  متابعة شاملة لأضخم حدث كروي: إحصائيات اللاعبين، الترتيب، أفضل
                  تشكيلة، وأخبار حصرية.
                </p>
              </div>

              {/* Left Side (Button) */}
              <div className="relative z-10 w-full md:w-auto flex justify-end shrink-0">
                <button className="bg-[#0b0f19] text-white font-bold px-6 py-2.5 rounded-xl border border-cyan-400 flex items-center gap-3 w-full md:w-auto justify-center group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
                  <span>اكتشف التغطية</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:-translate-x-1 transition-transform"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </Link>

          {/* Date Selector */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center mb-12 w-full gap-4">
            <h1 className="text-3xl font-bold text-[#ff7a00]">
              جدول المباريات
            </h1>
            <m.div className="flex bg-slate-900 p-1.5 rounded-full border border-slate-700 shadow-sm">
              {days.map((day) => {
                const active = isActiveDay(day.date);
                return (
                  <button
                    key={day.label}
                    onClick={() => setSelectedDate(day.date)}
                    className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      active
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {active && (
                      <m.div
                        layoutId="activeTabV2"
                        className="absolute inset-0 bg-[#ff7a00] rounded-full shadow-lg shadow-[#ff7a00]/25"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">{day.label}</span>
                  </button>
                );
              })}
            </m.div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <m.div
                key="load"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <div className="w-6 h-6 border-2 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
              </m.div>
            ) : error ? (
              <m.div
                key="err"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                <p className="text-slate-100 font-medium">
                  Unable to load matches
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Please check your connection and try again.
                </p>
              </m.div>
            ) : !competitions || competitions.length === 0 ? (
              <m.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                  <Clock className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-100 font-medium">
                  لا توجد مباريات مجدولة
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  تحقق مرة أخرى لاحقًا للمباريات القادمة.
                </p>
              </m.div>
            ) : (
              <m.div
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
              </m.div>
            )}
          </AnimatePresence>

          {/* Elegant Mobile Ads Carousel placed cleanly below matches schedule */}
          <MobileAdsCarousel />
        </main>

        {/* ═══ Children (SEO Content) ═══ */}
        {children}

        {/* ═══ Footer ═══ */}
        <Footer />
      </div>
    </LazyMotion>
  );
}
