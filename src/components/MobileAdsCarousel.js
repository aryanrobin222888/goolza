"use client";

import React from "react";
import { Play, Sparkles, Trophy, TrendingUp } from "lucide-react";

export default function MobileAdsCarousel() {
  const ads = [
    {
      type: "live",
      title: "البث المباشر Premium",
      subtitle: "تابع المباريات بجودة FHD بدون تقطيع",
      cta: "شاهد البث الآن",
      icon: <Trophy className="w-5 h-5 text-orange-500" />,
      color: "from-orange-600 to-amber-500",
      badge: " VIP مجاني",
      link: "https://refpa3665.com/L?tag=d_5627564m_45415c_&site=5627564&ad=45415",
    },
    {
      type: "bonus",
      title: "مكافأة التسجيل الأولى",
      subtitle: "ضاعف رصيدك بونص 200% كود برومو: 1x_4884027",
      cta: "سجل الآن وضاعف رصيدك",
      icon: <Sparkles className="w-5 h-5 text-orange-500" />,
      color: "from-amber-500 to-orange-500",
      badge: "200% بونص",
      link: "https://reffpa.com/L?tag=d_5627581m_97c_&site=5627581&ad=97",
    },
    {
      type: "odds",
      title: "توقعات المباريات الكبرى",
      subtitle: "أعلى عوائد للمراهنات الكروية كود برومو: ml_2674066",
      cta: "توقع واربح بونص",
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
      color: "from-orange-500 to-amber-500",
      badge: "أعلى odds",
      link: "https://refpa3665.com/L?tag=d_5627564m_45415c_&site=5627564&ad=45415",
    },
    {
      type: "melbet",
      title: "Melbet Sports Betting",
      subtitle: "المنصة الرسمية للبث المباشر وتوقعات الكرة العالمية كود برومو: ml_2674066",
      cta: "احصل على العرض",
      icon: <Trophy className="w-5 h-5 text-orange-500" />,
      color: "from-amber-600 to-orange-600",
      badge: "شريك رسمي",
      link: "https://refpa3665.com/L?tag=d_5627564m_45415c_&site=5627564&ad=45415",
    },
  ];

  return (
    <div className="block lg:hidden w-full px-6 mt-10 mb-16" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>عروض ورعاة كورة</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-sans">اسحب للمزيد ➔</span>
      </div>

      {/* Horizontal Scroll Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory no-scrollbar -mx-6 px-6">
        {ads.map((ad, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[280px] snap-center rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md p-5 relative overflow-hidden"
          >
            {/* Top color accent strip */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${ad.color}`}></div>
            <span className="absolute top-2 right-2 bg-slate-950/80 text-[8px] text-slate-400 px-1.5 py-0.5 rounded tracking-wider font-sans select-none">
              إعلان
            </span>

            <div className="flex items-center gap-2.5 mb-3 mt-1.5">
              <div className="p-2 rounded-xl bg-orange-500/10 shrink-0">
                {ad.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-bold text-xs truncate">{ad.title}</h4>
                <span className="inline-block text-[8px] font-black text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded mt-0.5">
                  {ad.badge}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-4 h-8 overflow-hidden">
              {ad.subtitle}
            </p>

            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full bg-slate-950 hover:bg-slate-900 text-orange-400 border border-orange-500/20 hover:border-orange-500 font-bold text-[10px] py-2 px-3 rounded-xl transition-all duration-200"
            >
              <span>{ad.cta}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
