import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";
import ScheduleClient from "@/features/schedule/components/ScheduleClient";
import { syncMatchWithSofaScore } from "@/lib/matchSync";
import { fetchSofaScoreEvents } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "يلا شوت الجديد yallashoot | جدول مباريات اليوم بث مباشر بدون تقطيع",
  description:
    "تابع أهم مباريات اليوم بث مباشر عبر يلا شوت الجديد yallashoot. بث مباشر مباريات اليوم بدون تقطيع بجودة عالية HD تناسب الجوال والإنترنت الضعيف.",
  keywords: [
    "yallashoot",
    "يلا شوت",
    "yalla live",
    "yalla shoot live",
    "بث مباشر مباريات اليوم",
    "yalla tv",
    "يلا شوت بث مباشر",
    "يلا لايف",
    "بث مباشر",
    "مباريات اليوم بث مباشر",
    "yalla shot",
    "يلا شوت بث مباشر الان",
    "yalla shoot koora",
    "yallah shoot",
    "يلا شوت لايف",
    "yalla",
    "يلا شووت",
    "yalla shoot live football",
    "yalla shoot live koora",
    "koora live yalla shoot",
    "yalla live tv",
    "yalalive",
    "يلا شوت مباشر",
    "يلا شوت مباشر الان",
    "yalla live football",
    "مباريات اليوم",
    "بث مباشر لايف",
  ],
  alternates: {
    canonical: "https://goolza.com",
  },
};

const faqData = [
  {
    question: "أين أشاهد مباريات اليوم بث مباشر مجاناً؟",
    answer:
      "يمكنك متابعة جميع مباريات اليوم بث مباشر مجاناً عبر موقع يلا شوت yallashoot، الذي يجمع روابط البث المباشر لجميع المباريات في صفحة واحدة محدّثة لحظياً.",
  },
  {
    question: "ما هي مباريات اليوم في دوري أبطال أوروبا؟",
    answer:
      "يعرض يلا شوت جدول مباريات دوري أبطال أوروبا اليوم بالتوقيت العربي مع القنوات الناقلة. يُحدَّث الجدول يومياً ليشمل جميع مباريات الليلة.",
  },
  {
    question: "كيف أعرف القناة الناقلة لمباراة اليوم؟",
    answer:
      "يُظهر يلا شوت اسم القناة الناقلة بجانب كل مباراة في الجدول، سواء كانت beIN Sports أو SSC أو MBC أو أي قناة مجانية أو مشفرة.",
  },
  {
    question: "هل يعمل موقع يلا شوت على الجوال؟",
    answer:
      "نعم، موقع يلا شوت متوافق بالكامل مع الهواتف الذكية وأجهزة الكمبيوتر، ويمكنك متابعة مباريات اليوم مباشرة من أي جهاز.",
  },
];

export default async function SchedulePageV2() {
  let initialMatches = [];

  try {
    await connectDB();
    const todayStr = format(startOfToday(), "yyyy-MM-dd");
    const liveMatches = await LiveMatch.findOne({ date: todayStr }).lean();

    if (liveMatches && liveMatches.matches) {
      let matches = Array.isArray(liveMatches.matches)
        ? liveMatches.matches
        : [];

      try {
        const sofaData = await fetchSofaScoreEvents(todayStr);
        const events = sofaData.events || [];
        if (events.length > 0) {
          matches.forEach((match) => {
            const event = events.find(
              (e) => e.id?.toString() === match.id?.toString(),
            );
            if (event) {
              syncMatchWithSofaScore(match, event);
            }
          });
        }
      } catch (err) {
        console.warn("Failed to fetch fresh sofascore data:", err.message);
      }

      const groupedData = groupMatches(matches);
      initialMatches = JSON.parse(JSON.stringify(groupedData));
    }
  } catch (error) {
    console.error("Failed to fetch initial matches on server:", error);
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <ScheduleClient initialMatches={initialMatches}>
        {/* ═══ SEO Content Section (server-rendered, crawlable) ═══ */}
        <section
          className="mt-4 pt-16 pb-20 border-t border-slate-800/80 px-6 max-w-4xl mx-auto w-full"
          dir="rtl"
          style={{ textAlign: "right" }}
        >
          <h2 className="text-2xl font-extrabold text-[#ff7a00] mb-4">
            يلا شوت الجديد yallashoot — جدول مباريات اليوم بث مباشر بدون تقطيع
          </h2>
          <p className="text-gray-400 leading-loose mb-6 text-[0.95rem]">
            يقدم موقع يلا شوت الجديد yallashoot تغطية حصرية لمشاهدة بث مباشر مباريات اليوم بدون تقطيع. نوفر جدولاً محدثاً لحظة بلحظة يضم كافة مواجهات الدوري السعودي للمحترفين، دوري أبطال أوروبا، الدوري الإنجليزي الممتاز، الدوري الإسباني، وغيرها من البطولات العالمية والمحلية. استمتع بتجربة مشاهدة مباريات اليوم بث مباشر (yalla live) بجودة HD مناسبة للجوال والإنترنت الضعيف عبر كورة لايف يلا شوت. نوفر تجربة تصفح رائعة لمتابعة{" "}
            <a
              href="https://goolza.com/matches-today"
              className="text-[#ff7a00] hover:underline"
            >
              مباريات اليوم
            </a>
            .
          </p>

          <h3 className="text-xl font-bold text-[#ff7a00] mb-3 mt-8">
            يلا شوت بث مباشر الان — القنوات الناقلة ومواعيد المباريات
          </h3>
          <p className="text-gray-400 leading-loose mb-6 text-[0.95rem]">
            يعرض موقع يلا شوت لايف (yalla live) توقيت انطلاق جميع مباريات اليوم بث مباشر بتوقيت بلدك، مع الكشف عن القناة الناقلة والتعليق الصوتي المباشر. سواء كنت تتابع عبر قنوات beIN Sports أو SSC الرياضية، أو تبحث عن بث مباشر يلا شوت و yalla tv، ستجد كافة الروابط والسيرفرات الفعالة هنا. احرص على تصفح موقعنا قبل انطلاق مباريات اليوم لتغطية كاملة وشاملة.
          </p>

          <h3 className="text-xl font-bold text-[#ff7a00] mb-3 mt-8">
            نتائج مباريات اليوم وملخصات الأهداف — تغطية شاملة لحظة بلحظة
          </h3>
          <p className="text-gray-400 leading-loose mb-8 text-[0.95rem]">
            بالإضافة إلى خدمة يلا شوت بث مباشر الان، يتيح لك موقعنا تتبع نتائج مباريات أمس وجداول مواجهات الغد. نوفر ملخصات سريعة وفيديوهات أهداف مباريات اليوم أولاً بأول، مع تحليل أداء الفرق وإحصائيات الاستحواذ والتسديدات لضمان بقائك في قلب الحدث الرياضي.
          </p>

          <h3 className="text-lg font-bold text-white mb-4 mt-10">
            أسئلة شائعة
          </h3>
          <dl className="flex flex-col gap-4">
            {faqData.map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/50"
              >
                <dt className="font-bold text-slate-200 mb-2 text-[0.95rem]">
                  {item.question}
                </dt>
                <dd className="text-gray-400 text-sm leading-relaxed">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </ScheduleClient>
    </>
  );
}
