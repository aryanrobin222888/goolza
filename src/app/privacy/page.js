import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";

export const metadata = {
  title: "سياسة الخصوصية — يلا شوت | Yalla Shoot",
  description:
    "سياسة الخصوصية الخاصة بموقع يلا شوت (yallashoot). تعرف على كيفية جمع واستخدام وحماية معلوماتك الشخصية أثناء تصفح جداول مباريات اليوم ومتابعة البث المباشر yallashoot.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://goolza.com/privacy",
  },
  openGraph: {
    title: "سياسة الخصوصية — يلا شوت | Yalla Shoot",
    description:
      "سياسة الخصوصية الخاصة بموقع يلا شوت (yallashoot). تعرف على كيفية حماية معلوماتك أثناء استخدام الموقع.",
    url: "https://goolza.com/privacy",
    images: ["/og-image.jpg"],
    type: "website",
    siteName: "يلا شوت | yallashoot",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "سياسة الخصوصية — يلا شوت | Yalla Shoot",
    description:
      "سياسة الخصوصية الخاصة بموقع يلا شوت (yallashoot). تعرف على كيفية حماية معلوماتك الشخصية.",
    images: ["/og-image.jpg"],
  },
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 font-sans transition-colors duration-300"
      dir="rtl"
    >
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          <nav>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#ff7a00] text-sm transition-colors font-medium"
            >
              العودة للرئيسية
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-[#ff7a00] mb-2">
          سياسة الخصوصية
        </h1>
        <p className="text-slate-300 text-sm mb-10">آخر تحديث: مايو 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              1. المعلومات التي نجمعها
            </h2>
            <p>
              في يلا شوت (yallashoot)، نقوم بجمع معلومات محدودة لتحسين تجربة المستخدم على الموقع. قد تشمل هذه المعلومات عنوان IP الخاص بك، نوع المتصفح، نظام التشغيل، والصفحات التي قمت بزيارتها. نحن لا نقوم بجمع أي معلومات شخصية حساسة دون علمك وموافقتك.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              2. كيف نستخدم المعلومات
            </h2>
            <p>
              نستخدم المعلومات المجمعة في يلا شوت لتحسين جودة خدماتنا، تحليل أنماط استخدام الموقع، ضمان أمان وسلامة المنصة، وتقديم محتوى وإحصائيات تتناسب مع اهتمامات وتطلعات عشاق الرياضة والباحثين عن بث مباشر مباريات اليوم.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              3. ملفات تعريف الارتباط (الكوكيز)
            </h2>
            <p>
              يستخدم موقعنا ملفات تعريف الارتباط لتحسين أداء الموقع وتخصيص تجربة تصفح جداول مباريات اليوم. يمكنك بكل سهولة التحكم في إعدادات ملفات تعريف الارتباط أو تعطيلها من خلال إعدادات متصفحك الخاص في أي وقت.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              4. مشاركة المعلومات
            </h2>
            <p>
              نحن نلتزم التزاماً تاماً بعدم بيع أو مشاركة معلوماتك الشخصية مع أي أطراف ثالثة لأغراض تسويقية. قد نشارك بعض البيانات غير الشخصية والمجمعة مع مزودي الخدمات الفنية المعتمدين لمساعدتنا في تحسين خدمات تشغيل منصة يلا شوت.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              5. أمان البيانات
            </h2>
            <p>
              نتخذ في يلا شوت أعلى المعايير والإجراءات الأمنية والتقنية المناسبة لحماية بياناتك من الوصول غير المصرح به، التعديل، الإفصاح، أو الإتلاف.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">6. حقوقك</h2>
            <p>
              يحق لك دائماً معرفة البيانات التي نجمعها، وطلب تصحيحها أو مسحها. لأي استفسارات أو أسئلة تتعلق بخصوصيتك على موقع يلا شوت، يمكنك التواصل معنا مباشرة عبر صفحة الاتصال بالموقع.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
