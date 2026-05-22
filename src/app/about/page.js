import Link from "next/link";
import { ArrowLeft, Target, Eye, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";

export const metadata = {
  title: "من نحن — جولزا يلا شوت | Goolza Yalla Shoot",
  description:
    "تعرف على فريق جولزا يلا شوت (Goolza Yalla Shoot) ورؤيتنا لمستقبل الإعلام الرياضي العربي. منصة رقمية متخصصة في تقديم جداول مباريات اليوم بث مباشر، نتائج حية، وتغطية شاملة لكل الأحداث الرياضية عبر يلا شوت الجديد yallashoot.",
  alternates: {
    canonical: "https://goolza.com/about",
  },
  openGraph: {
    title: "من نحن — جولزا يلا شوت | Goolza Yalla Shoot",
    description:
      "تعرف على فريق جولزا يلا شوت ورؤيتنا لمستقبل الإعلام الرياضي العربي. منصة متخصصة في مباريات اليوم بث مباشر عبر يلا شوت لايف.",
    url: "https://goolza.com/about",
    images: ["/og-image.jpg"],
    type: "website",
    siteName: "جولزا يلا شوت",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "من نحن — جولزا يلا شوت | Goolza Yalla Shoot",
    description:
      "تعرف على فريق جولزا يلا شوت ورؤيتنا لمستقبل الإعلام الرياضي العربي. منصة متخصصة في مباريات اليوم بث مباشر.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
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
        <h1 className="text-3xl font-black text-[#ff7a00] mb-2">من نحن</h1>
        <p className="text-slate-300 text-sm mb-10">
          تعرف على منصة جولزا يلا شوت (Goolza Yalla Shoot) ورؤيتنا لمستقبل الإعلام الرياضي
        </p>

        {/* Intro */}
        <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 mb-8 shadow-sm transition-colors duration-300">
          <p className="text-slate-300 leading-loose text-sm">
            جولزا يلا شوت (Goolza Yalla Shoot) هي منصة رقمية رائدة متخصصة في تقديم جداول مباريات اليوم والنتائج المباشرة لكرة القدم. نهدف إلى توفير تجربة مستخدم سلسة وحديثة تمكّن عشاق الرياضة من متابعة مباريات اليوم بث مباشر في مختلف الدوريات والبطولات العالمية لحظة بلحظة عبر يلا شوت الجديد وبجودة عالية، مع التركيز التام على السرعة والدقة في نقل المعلومة الحية.
          </p>
        </section>

        {/* Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Target,
              title: "مهمتنا",
              text: "تقديم أفضل تجربة لمتابعة مباريات كرة القدم والبث المباشر بأحدث التقنيات وأجمل التصاميم عبر جولزا يلا شوت.",
            },
            {
              icon: Eye,
              title: "رؤيتنا",
              text: "أن تكون منصة جولزا يلا شوت الوجهة الأولى عربياً لمتابعة مباريات كرة القدم المباشرة والنتائج الحية.",
            },
            {
              icon: Users,
              title: "فريقنا",
              text: "فريق متكامل من المطورين والمحررين الرياضيين الشغوفين بكرة القدم وتغطية البث المباشر yalla shoot.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 hover:border-[#ff7a00]/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ff7a00]/10 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-[#ff7a00]" />
              </div>
              <h2 className="text-white font-bold mb-2">{item.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section className="bg-[#1e293b] border border-slate-800 rounded-2xl p-8 transition-colors duration-300">
          <h2 className="text-lg font-bold text-[#ff7a00] mb-6 text-center">
            أرقامنا
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "50+", label: "بطولة متابَعة" },
              { value: "1000+", label: "مباراة يومياً" },
              { value: "24/7", label: "تحديث مستمر" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-[#ff7a00] mb-1">
                  {stat.value}
                </div>
                <p className="text-slate-300 text-xs font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
