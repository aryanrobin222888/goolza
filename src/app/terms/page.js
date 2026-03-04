import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "الشروط والأحكام — goolza",
  description: "الشروط والأحكام الخاصة باستخدام موقع goolza",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#0aa674] flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0aa674] dark:text-[#0aa674]">
              goolza
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-slate-300 hover:text-[#0aa674] text-sm transition-colors font-medium">
            العودة للرئيسية
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-[#0aa674] dark:text-[#0aa674] mb-2">الشروط والأحكام</h1>
        <p className="text-slate-300 text-sm mb-10">آخر تحديث: فبراير 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#0aa674] mb-3">1. قبول الشروط</h2>
            <p>
              باستخدامك لموقع goolza، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع. نحتفظ بالحق في تعديل هذه الشروط في أي وقت.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#0aa674] mb-3">2. استخدام الخدمة</h2>
            <p>
              يوفر goolza جداول المباريات والنتائج المباشرة لمباريات كرة القدم. تُقدَّم جميع المعلومات لأغراض إعلامية فقط. لا نتحمل أي مسؤولية عن دقة أو اكتمال المعلومات المعروضة.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#0aa674] mb-3">3. حقوق الملكية الفكرية</h2>
            <p>
              جميع المحتويات المعروضة على الموقع، بما في ذلك النصوص والتصاميم والشعارات والرسومات، هي ملكية حصرية لـ goolza أو الجهات المرخصة. لا يجوز نسخها أو توزيعها أو استخدامها بدون إذن مسبق.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#0aa674] mb-3">4. سلوك المستخدم</h2>
            <p>
              يلتزم المستخدم بعدم استخدام الموقع لأي أغراض غير قانونية أو غير أخلاقية. يمنع محاولة الوصول غير المصرح به إلى أنظمة الموقع أو إجراء أي تعديلات غير مصرح بها.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#0aa674] mb-3">5. إخلاء المسؤولية</h2>
            <p>
              يُقدَّم الموقع &quot;كما هو&quot; دون أي ضمانات من أي نوع. لا نتحمل أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام هذا الموقع.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#0aa674] mb-3">6. تعديل الشروط</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة. يُعتبر استمرارك في استخدام الموقع بعد التعديلات قبولاً للشروط المحدثة.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
