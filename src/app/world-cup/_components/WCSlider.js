"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const SLIDES = [
  {
    id: 1,
    tag: "تغطية خاصة",
    tagColor: "#10b981",
    title: "المنتخبات الأوفر حظاً للتتويج بلقب كأس العالم 2026",
    subtitle: "نظرة تحليلية على أبرز المنتخبات المرشحة للفوز بالكأس الذهبي في نسخة 2026",
    date: "9 يونيو 2026",
    image: "https://images.unsplash.com/photo-1634912383059-bec253e4d4c3?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    tag: "الدوائر الإقصائية",
    tagColor: "#3b82f6",
    title: "نظام الـ 48 منتخباً: كيف تغيرت قواعد اللعبة للأبد في مونديال 2026",
    subtitle: "نسخة تاريخية غير مسبوقة ب12 مجموعة و48 فريقاً تتنافس في الإقصاء",
    date: "5 يونيو 2026",
    image: "https://images.unsplash.com/photo-1540747913346-19e32fc3e6bb?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    tag: "المنتخبات العربية",
    tagColor: "#f59e0b",
    title: "العرب في المونديال: آمال وطموحات تتجدد في أضخم نسخة بالتاريخ",
    subtitle: "المنتخبات العربية تستعد بقوة لتصفيات مونديال 2026 رافعةً سقف التوقعات",
    date: "2 يونيو 2026",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 4,
    tag: "المباراة الافتتاحية",
    tagColor: "#ec4899",
    title: "أزتيكا يتهيأ لاستقبال مباراة تاريخية بين المكسيك وجنوب أفريقيا",
    subtitle: "الملعب الأسطوري يحتضن ثلاثة مونديالات في تاريخه ويُكمل إرثه العظيم",
    date: "28 مايو 2026",
    image: "https://images.unsplash.com/photo-1620023594833-28c005b4fbfa?q=80&w=2000&auto=format&fit=crop",
  }
];

export default function WCSlider({ articles = [] }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const slidesData = articles.length > 0 ? articles.map((article, i) => ({
    id: article._id || i,
    tag: article.tags?.[0] || "أخبار البطولة",
    tagColor: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"][i % 5],
    title: article.title,
    subtitle: article.excerpt || "",
    date: new Date(article.publishedAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    }),
    image: article.imageUrl || "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop",
    href: `/world-cup/news/${article.slug}`
  })) : SLIDES.map(s => ({ ...s, href: "#" }));

  const resetTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  
  useEffect(() => {
    resetTimer();
    timerRef.current = setInterval(() => go(1), 5000);
    return () => resetTimer();
  }, [idx]);

  const go = (d) => {
    if (animating) return;
    setDir(d);
    setAnimating(true);
    setTimeout(() => {
      setIdx(i => (i + d + SLIDES.length) % SLIDES.length);
      setAnimating(false);
    }, 300);
    resetTimer();
  };

  const slide = slidesData[idx];

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden group select-none cursor-pointer"
         style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
         onClick={() => slide.href !== "#" && router.push(slide.href)}>

      {/* BG Image */}
      <div className="absolute inset-0 transition-opacity duration-300" style={{ opacity: animating ? 0 : 1 }}>
        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, #020617 0%, rgba(2,6,23,0.8) 40%, rgba(2,6,23,0.3) 70%, transparent 100%)"
        }}/>
        {/* Side vignette */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(2,6,23,0.6) 0%, transparent 30%, transparent 70%, rgba(2,6,23,0.3) 100%)"
        }}/>
      </div>

      {/* Top-left counter */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
           style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }} dir="ltr">
        <span style={{ color: slide.tagColor }}>{idx + 1}</span>
        <span className="text-white/30">/</span>
        <span className="text-white/60">{slidesData.length}</span>
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 z-10 transition-all duration-300"
           style={{ opacity: animating ? 0 : 1, transform: animating ? `translateX(${dir * 20}px)` : 'translateX(0)' }}>

        {/* Tag + time bar */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-black text-white"
                style={{ backgroundColor: slide.tagColor, boxShadow: `0 0 15px ${slide.tagColor}60` }}>
            {slide.tag}
          </span>
          <span className="text-[11px] font-bold text-white/50 flex items-center gap-1.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {slide.date}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug mb-2 max-w-xl" dir="rtl">
          {slide.title}
        </h2>
        <p className="text-sm text-white/50 leading-relaxed max-w-lg hidden sm:block" dir="rtl">
          {slide.subtitle}
        </p>

        {/* Dots + Arrows row */}
        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            {slidesData.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setDir(i > idx ? 1 : -1); setIdx(i); }}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i === idx ? "28px" : "8px",
                  height: "8px",
                  backgroundColor: i === idx ? slide.tagColor : "rgba(255,255,255,0.2)",
                  boxShadow: i === idx ? `0 0 10px ${slide.tagColor}` : "none"
                }}/>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
              <ChevronRight size={16} className="text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
              <ChevronLeft size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
