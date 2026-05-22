import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";

export const metadata = {
  title: "الشروط والأحكام — يلا شوت",
  description:
    "الشروط والأحكام الخاصة باستخدام موقع يلا شوت (Yallashoot). تعرف على سياسة الاستخدام، حقوق الملكية الفكرية، والقواعد المنظمة لمتابعة مباريات اليوم والخدمات الرياضية.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://goolza.com/terms",
  },
  openGraph: {
    title: "الشروط والأحكام — يلا شوت",
    description:
      "الشروط والأحكام الخاصة باستخدام موقع يلا شوت. تعرف على سياسة الاستخدام والقواعد المنظمة.",
    url: "https://goolza.com/terms",
    images: ["/og-image.jpg"],
    type: "website",
    siteName: "يلا شوت",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "الشروط والأحكام — يلا شوت",
    description:
      "الشروط والأحكام الخاصة باستخدام موقع يلا شوت. تعرف على سياسة الاستخدام وحقوق الملكية.",
    images: ["/og-image.jpg"],
  },
};

export default function TermsPage() {
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
          الشروط والأحكام
        </h1>
        <p className="text-slate-300 text-sm mb-10">آخر تحديث: فبراير 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              1. قبول الشروط
            </h2>
            <p>
              باستخدامك لموقع يلا شوت (Yallashoot)، فإنك توافق على الالتزام بهذه
              الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم
              استخدام الموقع. نحتفظ بالحق في تعديل هذه الشروط في أي وقت.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              2. استخدام الخدمة
            </h2>
            <p>
              يوفر يلا شوت (Yallashoot) جداول المباريات والنتائج المباشرة
              لمباريات كرة القدم. تُقدَّم جميع المعلومات لأغراض إعلامية فقط. لا
              نتحمل أي مسؤولية عن دقة أو اكتمال المعلومات المعروضة.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              3. حقوق الملكية الفكرية
            </h2>
            <p>
              جميع المحتويات المعروضة على الموقع، بما في ذلك النصوص والتصاميم
              والشعارات والرسومات، هي ملكية حصرية لـ يلا شوت (Yallashoot) أو
              الجهات المرخصة. لا يجوز نسخها أو توزيعها أو استخدامها بدون إذن
              مسبق.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              4. سلوك المستخدم
            </h2>
            <p>
              يلتزم المستخدم بعدم استخدام الموقع لأي أغراض غير قانونية أو غير
              أخلاقية. يمنع محاولة الوصول غير المصرح به إلى أنظمة الموقع أو
              إجراء أي تعديلات غير مصرح بها.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              5. إخلاء المسؤولية
            </h2>
            <p>
              يُقدَّم الموقع &quot;كما هو&quot; دون أي ضمانات من أي نوع. لا
              نتحمل أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام
              هذا الموقع.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              6. تعديل الشروط
            </h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر أي تغييرات على
              هذه الصفحة. يُعتبر استمرارك في استخدام الموقع بعد التعديلات قبولاً
              للشروط المحدثة.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
