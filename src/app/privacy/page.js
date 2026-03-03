import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "سياسة الخصوصية — goolza",
  description: "سياسة الخصوصية الخاصة بموقع goolza",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-black text-[#5c2d91] dark:text-purple-400 mb-2">سياسة الخصوصية</h1>
        <p className="text-slate-300 text-sm mb-10">آخر تحديث: فبراير 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-purple-400 mb-3">1. المعلومات التي نجمعها</h2>
            <p>
              نقوم بجمع معلومات محدودة لتحسين تجربة المستخدم. قد تشمل هذه المعلومات عنوان IP، نوع المتصفح، نظام التشغيل، والصفحات التي تمت زيارتها. لا نقوم بجمع معلومات شخصية حساسة.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-purple-400 mb-3">2. كيف نستخدم المعلومات</h2>
            <p>
              نستخدم المعلومات المجمعة لتحسين خدماتنا، تحليل أنماط الاستخدام، ضمان أمان الموقع، وتقديم محتوى يتناسب مع اهتمامات المستخدمين.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-purple-400 mb-3">3. ملفات تعريف الارتباط (الكوكيز)</h2>
            <p>
              يستخدم موقعنا ملفات تعريف الارتباط لتحسين أداء الموقع وتخصيص تجربة المستخدم. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال إعدادات متصفحك.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-purple-400 mb-3">4. مشاركة المعلومات</h2>
            <p>
              لا نقوم ببيع أو مشاركة معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك المعلومات مع مزودي الخدمات الذين يساعدوننا في تشغيل الموقع.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-purple-400 mb-3">5. أمان البيانات</h2>
            <p>
              نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-purple-400 mb-3">6. حقوقك</h2>
            <p>
              يحق لك الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. للاستفسار حول بياناتك، يرجى التواصل معنا عبر صفحة الاتصال.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
