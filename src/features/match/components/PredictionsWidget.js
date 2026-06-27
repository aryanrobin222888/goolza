import React from "react";

function translateAdvice(advice, homeName, awayName) {
  if (!advice) return "";
  let translated = advice;
  translated = translated.replace(/Double chance/gi, "فرصة مزدوجة");
  translated = translated.replace(/or draw/gi, "أو التعادل");
  translated = translated.replace(/win/gi, "فوز");
  translated = translated.replace(/draw/gi, "تعادل");
  translated = translated.replace(/Home/gi, homeName);
  translated = translated.replace(/Away/gi, awayName);
  return translated;
}

export default function PredictionsWidget({ predictionsData, homeTeam, awayTeam }) {
  const prediction = predictionsData?.response?.[0];
  if (!prediction) return null;

  const { percent, advice } = prediction.predictions;
  const comparison = prediction.comparison;

  const homePercent = percent.home ? parseInt(percent.home) : 0;
  const drawPercent = percent.draw ? parseInt(percent.draw) : 0;
  const awayPercent = percent.away ? parseInt(percent.away) : 0;

  const comparisonMetrics = [
    { key: "form", label: "الفورمة (الحالة الحالية)", home: comparison.form.home, away: comparison.form.away },
    { key: "att", label: "القوة الهجومية", home: comparison.att.home, away: comparison.att.away },
    { key: "def", label: "القوة الدفاعية", home: comparison.def.home, away: comparison.def.away },
    { key: "h2h", label: "المواجهات المباشرة", home: comparison.h2h.home, away: comparison.h2h.away },
  ];

  return (
    <div className="bg-slate-900/45 backdrop-blur-md rounded-2xl border border-emerald-500/20 shadow-sm p-6 space-y-6 w-full text-right" dir="rtl">
      {/* Widget Title */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          تحليل وتوقعات المباراة
        </h3>
        <span className="text-xs text-slate-400 font-medium bg-slate-800/60 px-3 py-1 rounded-full border border-emerald-500/10">
          تحليل إحصائي
        </span>
      </div>

      {/* Probabilities */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-300">نسب الفوز والتعادل المتوقعة</h4>
        <div className="flex justify-between text-xs font-semibold text-slate-300">
          <span>فوز {homeTeam.name} ({homePercent}%)</span>
          <span className="text-slate-400">تعادل ({drawPercent}%)</span>
          <span>فوز {awayTeam.name} ({awayPercent}%)</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-800/60 rounded-full overflow-hidden flex border border-slate-800">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${homePercent}%` }} />
          <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${drawPercent}%` }} />
          <div className="bg-emerald-900 h-full transition-all duration-500" style={{ width: `${awayPercent}%` }} />
        </div>
      </div>

      {/* Advice / Recommendation */}
      {advice && (
        <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 space-y-1">
          <span className="text-xs text-emerald-400 font-bold">نصيحة التوقع:</span>
          <p className="text-sm text-white font-medium">{translateAdvice(advice, homeTeam.name, awayTeam.name)}</p>
        </div>
      )}

      {/* Comparison Metrics */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-300">مقارنة الأداء الإحصائي</h4>
        <div className="space-y-3 bg-slate-950/20 rounded-xl p-4 border border-slate-850">
          {comparisonMetrics.map((metric) => {
            const homeVal = parseInt(metric.home) || 0;
            const awayVal = parseInt(metric.away) || 0;
            return (
              <div key={metric.key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">{metric.label}</span>
                  <div className="flex gap-4 font-mono font-semibold text-slate-300">
                    <span className="text-emerald-400">{metric.home}</span>
                    <span>vs</span>
                    <span className="text-emerald-500">{metric.away}</span>
                  </div>
                </div>
                {/* Visual Bar Comparison */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${homeVal}%` }} />
                  <div className="bg-emerald-950 h-full" style={{ width: `${awayVal}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
