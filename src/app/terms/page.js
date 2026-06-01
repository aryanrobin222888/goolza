import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/ui/Logo";

export const metadata = {
  title: "الشروط والأحكام — يلا شوت | Yalla Shoot",
  description:
    "الشروط والأحكام الخاصة باستخدام موقع يلا شوت (yallashoot). تعرف على سياسة الاستخدام، حقوق الملكية الفكرية، والقواعد المنظمة لمتابعة مباريات اليوم والخدمات الرياضية.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://goolza.com/terms",
  },
  openGraph: {
    title: "الشروط والأحكام — يلا شوت | Yalla Shoot",
    description:
      "الشروط والأحكام الخاصة باستخدام موقع يلا شوت. تعرف على سياسة الاستخدام والقواعد المنظمة.",
    url: "https://goolza.com/terms",
    images: ["/og-image.jpg"],
    type: "website",
    siteName: "يلا شوت | yallashoot",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "الشروط والأحكام — يلا شوت | Yalla Shoot",
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
        <p className="text-slate-300 text-sm mb-10">آخر تحديث: مايو 2026</p>

        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              1. قبول الشروط
            </h2>
            <p>
              باستخدامك وتصفحك لموقع يلا شوت (yallashoot)، فإنك توافق تماماً على الالتزام بشروط الاستخدام والأحكام الواردة هنا. إذا كنت لا توافق على أي من هذه الشروط، يرجى التوقف فوراً عن استخدام الموقع. نحن نحتفظ بكامل الحق في تعديل أو تحديث هذه الشروط في أي وقت ودون إشعار مسبق.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              2. استخدام الخدمة
            </h2>
            <p>
              توفّر منصة يلا شوت جداول وتفاصيل المباريات والنتائج المباشرة لمباريات كرة القدم في مختلف البطولات والدوريات. تُقدّم هذه المعلومات والبيانات لأغراض إعلامية وتثقيفية فقط. لا نتحمل في يلا شوت أي مسؤولية قانونية عن دقة، اكتمال، أو تحديث المعلومات المعروضة الناتجة عن أي أخطاء من المصادر الأساسية.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              3. حقوق الملكية الفكرية
            </h2>
            <p>
              جميع المواد والمحتويات المعروضة على موقعنا، بما في ذلك النصوص البرمجية، التصاميم، الأكواد، الشعارات والرسومات التوضيحية، هي ملكية فكرية وحصرية لمنصة يلا شوت (yallashoot) أو الجهات المزودة والمرخصة لنا. يمنع منعاً باتاً نسخ، إعادة إنتاج، توزيع أو استخدام أي من هذه المحتويات تجارياً بدون إذن كتابي رسمي ومسبق منا.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              4. سلوك المستخدم
            </h2>
            <p>
              يلتزم مستخدم موقع يلا شوت باستخدام المنصة لأغراض قانونية ومشروعة فقط ووفقاً للآداب العامة. يُمنع منعاً باتاً محاولة إلحاق الضرر بخوادم الموقع، محاولة اختراق أو تعطيل أي جزء من أنظمتنا الأمنية، أو القيام بأي تعديلات برمجية غير مصرح بها.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              5. إخلاء المسؤولية
            </h2>
            <p>
              يُقدّم موقع يلا شوت وخدماته المتنوعة للمستخدمين &quot;كما هي&quot; ودون أي ضمانات من أي نوع، صريحة أو ضمنية. نحن لا نضمن عدم انقطاع الخدمة أو خلوها التام من الأخطاء الفنية المؤقتة، ولا نتحمل مسؤولية أي أضرار ناجمة عن استخدام أو عدم القدرة على استخدام الموقع.
            </p>
          </section>

          <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-bold text-[#ff7a00] mb-3">
              6. تعديل الشروط والأحكام
            </h2>
            <p>
              نحتفظ بحقنا المطلق في تعديل وتغيير شروط الاستخدام والأحكام في أي وقت نراه مناسباً. سيتم فوراً نشر أي تعديلات جديدة على هذه الصفحة مباشرة، ويُعتبر استمرار زيارتك واستخدامك لمنصة يلا شوت بعد التعديل بمثابة موافقة كاملة منك على الشروط والأحكام بصيغتها المحدثة.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
