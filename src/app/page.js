import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";
import ScheduleClient from "@/features/schedule/components/ScheduleClient";
import { syncMatchWithSofaScore } from "@/lib/matchSync";
import { fetchSofaScoreEvents } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "يلا شوت الجديد | بث مباشر مباريات اليوم وتغطية حصرية - Yalla Shoot",
  description:
    "تابع أهم مباريات اليوم بث مباشر عبر يلا شوت الجديد Yalla Shoot. تغطية شاملة وحصرية لنتائج المباريات، أخبار الدوريات العالمية والمحلية، وتفاصيل البطولات الكبرى لحظة بلحظة وبدون تقطيع.",
  keywords: [
    "مباريات اليوم",
    "بث مباشر مباريات اليوم",
    "yalla shoot live",
    "يلا شوت بث مباشر",
    "مباريات اليوم بث مباشر",
    "yalla live",
    "بث مباشر",
    "يلا شوت بث مباشر الان",
    "يلا لايف",
    "يلا شوت لايف",
    "yalla shoot koora",
    "yalla shot",
    "يلا شوت مباشر الان",
    "يلا شووت",
    "بث مباشر يلا شوت",
    "yalla tv",
    "yalla shoot live koora",
    "مشاهدة مباريات اليوم بث مباشر",
    "يلا شوت مباشر",
    "yallah shoot",
    "يلا شوط",
    "يلا شوت الجديد",
    "يلاشوط",
    "كوره لايف يلا شوت",
    "Yallashoot",
    "yalla shoot",
  ],
  alternates: {
    canonical: "https://goolza.com",
  },
};

const faqData = [
  {
    question: "أين أشاهد مباريات اليوم بث مباشر مجاناً؟",
    answer:
      "يمكنك متابعة جميع مباريات اليوم بث مباشر مجاناً عبر موقع يلا شوت goolza.com، الذي يجمع روابط البث المباشر لجميع المباريات في صفحة واحدة محدّثة لحظياً.",
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
          <h2 className="text-2xl font-extrabold text-emerald-500 mb-4">
            مباريات اليوم بث مباشر — جدول كامل لكل المباريات
          </h2>
          <p className="text-gray-400 leading-loose mb-6 text-[0.95rem]">
            يُقدّم موقع يلا شوت (yalla shoot) الجديد جدولاً شاملاً لمباريات
            اليوم بث مباشر، يضمّ جميع المباريات من أبرز الدوريات العالمية
            كالدوري السعودي للمحترفين، دوري أبطال أوروبا، الدوري الإسباني،
            الدوري الإنجليزي الممتاز، والدوري المصري. يمكنك مشاهدة مباريات اليوم
            بث مباشر (yalla live) مجاناً وبدون تقطيع. نوفر عبر كوره لايف يلا شوت
            تجربة مشاهدة ممتعة عبر صفحة{" "}
            <a
              href="https://goolza.com/matches-today"
              className="text-emerald-500 hover:underline"
            >
              مباريات اليوم
            </a>
            .
          </p>

          <h3 className="text-xl font-bold text-emerald-500 mb-3 mt-8">
            يلا شوت بث مباشر الان — القنوات الناقلة وتوقيت المباريات
          </h3>
          <p className="text-gray-400 leading-loose mb-6 text-[0.95rem]">
            يعرض موقع يلا شوت لايف توقيت كل مباراة بالتوقيت المحلي لكل دولة
            عربية، مع اسم القناة الناقلة لكل مباراة. سواء كنت تبحث عن يلا شوت بث
            مباشر أو yalla tv، فنحن نوفر التغطية من قنوات beIN Sports، SSC، MBC
            وغيرها. احرص على مراجعة جدول مباريات اليوم بث مباشر قبل انطلاق
            المباريات للاطلاع على آخر التعديلات.
          </p>

          <h3 className="text-xl font-bold text-emerald-500 mb-3 mt-8">
            نتائج المباريات ومباريات الغد — كل ما تحتاجه في مكان واحد
          </h3>
          <p className="text-gray-400 leading-loose mb-8 text-[0.95rem]">
            إلى جانب مباريات اليوم، يتيح لك يلا شوت الاطلاع على نتائج مباريات
            أمس ومتابعة جدول مباريات غد. سواء كنت تبحث عن مباريات دوري أبطال
            أوروبا الليلة أو أي مباراة في أي دوري عربي أو عالمي، ستجد كل
            التفاصيل هنا — التشكيلة، أهداف مباريات اليوم، وملخصات الجولات.
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
