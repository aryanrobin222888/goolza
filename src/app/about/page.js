import Link from "next/link";
import { Zap, ArrowLeft, Target, Eye, Users } from "lucide-react";

export const metadata = {
  title: "من نحن — goolza",
  description: "تعرف على فريق goolza ورؤيتنا",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#5c2d91] flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#5c2d91] dark:text-purple-400">
              goolza
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-slate-300 hover:text-purple-400 text-sm transition-colors font-medium">
            العودة للرئيسية
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-[#5c2d91] dark:text-purple-400 mb-2">من نحن</h1>
        <p className="text-slate-300 text-sm mb-10">تعرف على goolza ورؤيتنا لمستقبل الإعلام الرياضي</p>    

        {/* Intro */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition-colors duration-300">
          <p className="text-slate-300 leading-loose">
            goolza هي منصة رقمية متخصصة في تقديم جداول المباريات والنتائج المباشرة لكرة القدم. نهدف إلى توفير
            تجربة مستخدم سلسة وحديثة تمكّن عشاق الرياضة من متابعة أحدث المباريات في مختلف الدوريات والبطولات العالمية
            لحظة بلحظة، مع التركيز على السرعة والدقة في نقل المعلومة.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Target,
              title: "مهمتنا",
              text: "تقديم أفضل تجربة لمتابعة مباريات كرة القدم بأحدث التقنيات وأجمل التصاميم.",
            },
            {
              icon: Eye,
              title: "رؤيتنا",
              text: "أن نكون المنصة الأولى عربياً لمتابعة مباريات كرة القدم المباشرة والجداول.",
            },
            {
              icon: Users,
              title: "فريقنا",
              text: "فريق من المطورين والمصممين المحترفين الشغوفين بكرة القدم والتكنولوجيا.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-900/20 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 transition-colors duration-300">
          <h2 className="text-lg font-bold text-purple-400 mb-6 text-center">أرقامنا</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "50+", label: "بطولة متابَعة" },
              { value: "1000+", label: "مباراة يومياً" },
              { value: "24/7", label: "تحديث مستمر" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-purple-400 mb-1">
                  {stat.value}
                </div>
                <p className="text-slate-300 text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
