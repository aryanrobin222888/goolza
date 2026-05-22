"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

// Mock Data targeting the Article architecture
const MOCK_NEWS = [
  {
    id: 1,
    title: "الكشف عن الملاعب المستضيفة لبطولة كأس العالم 2026 في أمريكا، كندا والمكسيك",
    tag: "تغطية خاصة",
    tagColor: "#10b981", // Emerald
    image: "https://images.unsplash.com/photo-1518605368461-1e1e11425171?q=80&w=2000&auto=format&fit=crop", 
    time: "منذ ساعتين",
  },
  {
    id: 2,
    title: "المنتخبات العربية تستعد بقوة لتصفيات المونديال بطموحات بلوغ النهائيات بشكل استثنائي",
    tag: "المنتخبات العربية",
    tagColor: "#3b82f6", // Blue
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop", 
    time: "منذ 5 ساعات",
  },
  {
    id: 3,
    title: "نظام البطولة الجديد: 48 منتخباً يتنافسون على اللقب الأغلى في تاريخ كرة القدم",
    tag: "نظام البطولة",
    tagColor: "#f59e0b", // Amber
    image: "https://images.unsplash.com/photo-1540747913346-19e32fc3e6bb?q=80&w=2000&auto=format&fit=crop", 
    time: "منذ 10 ساعات",
  },
  {
    id: 4,
    title: "مكسيكو سيتي تستعد لاستضافة المباراة الافتتاحية في ملعب أزتيكا التاريخي",
    tag: "المباراة الافتتاحية",
    tagColor: "#ec4899", // Pink
    image: "https://images.unsplash.com/photo-1620023594833-28c005b4fbfa?q=80&w=2000&auto=format&fit=crop", 
    time: "أمس",
  }
];

export default function WCNewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === MOCK_NEWS.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => resetTimeout();
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === MOCK_NEWS.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? MOCK_NEWS.length - 1 : prev - 1));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? -100 : 100, // RTL adjusted
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    })
  };

  const currentNews = MOCK_NEWS[currentIndex];

  return (
    <div className="relative w-full h-[450px] lg:h-[500px] rounded-[1.5rem] overflow-hidden group border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 isolation-isolate transform-gpu">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 250, damping: 25 }, opacity: { duration: 0.2 }, scale: { duration: 0.3 } }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image & Overlay */}
          <div className="absolute inset-0">
             <img src={currentNews.image} alt={currentNews.title} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-transparent"></div>
          </div>

          {/* Content Layer */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col justify-end h-full mt-auto">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <span 
                className="px-4 py-1.5 rounded-full text-xs font-black text-white shadow-lg backdrop-blur-sm border border-white/20"
                style={{ backgroundColor: currentNews.tagColor }}
              >
                {currentNews.tag}
              </span>
              <span className="text-white/80 text-xs md:text-sm font-semibold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                {currentNews.time}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight md:leading-snug mb-8 max-w-3xl drop-shadow-2xl">
              {currentNews.title}
            </h2>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Persistent Navigation Layer */}
      <div className="absolute inset-0 pointer-events-none p-6 md:p-10 flex flex-col justify-between z-10">
        {/* Counter Badge */}
        <div className="flex justify-start pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 text-white font-bold px-4 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-xl" dir="ltr">
            <span className="text-emerald-400">{currentIndex + 1}</span>
            <span className="text-white/30 truncate">/</span>
            <span className="text-white/70">{MOCK_NEWS.length}</span>
          </div>
        </div>

        {/* Controls: Arrows + Dots */}
        <div className="flex items-center justify-between mt-auto pointer-events-auto">
          {/* Dots */}
          <div className="flex gap-2.5 items-center">
            {MOCK_NEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-500 rounded-full cursor-pointer ${
                  currentIndex === idx 
                    ? "w-10 h-2 bg-emerald-400" 
                    : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60 hover:scale-125"
                }`}
                style={{
                  backgroundColor: currentIndex === idx ? currentNews.tagColor : ""
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-3">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-xl flex items-center justify-center transition-all group/btn shadow-xl hover:scale-105"
              aria-label="Previous slide"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover/btn:-translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-xl flex items-center justify-center transition-all group/btn shadow-xl hover:scale-105"
              aria-label="Next slide"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
