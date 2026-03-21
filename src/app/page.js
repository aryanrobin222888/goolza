import connectDB from "@/lib/db";
import LiveMatch from "@/models/LiveMatch";
import { format, startOfToday } from "date-fns";
import { groupMatches } from "@/lib/matchUtils";
import ScheduleClient from "@/features/schedule/components/ScheduleClient";
import { syncMatchWithSofaScore } from "@/lib/matchSync";
import { fetchSofaScoreEvents } from "@/lib/sofascore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "جولزا — مباريات اليوم بث مباشر | جدول كرة القدم",
  description:
    "شاهد مباريات اليوم بث مباشر مجاناً على جولزا. جدول شامل لمباريات كرة القدم اليوم مع القنوات الناقلة والتوقيت العربي — دوري أبطال أوروبا، الدوري السعودي، الإنجليزي، الإسباني والمزيد.",
  keywords: [
    "مباريات اليوم",
    "بث مباشر كرة القدم",
    "مباريات اليوم بث مباشر",
    "جدول مباريات اليوم",
    "مباريات الليلة",
    "القنوات الناقلة",
    "دوري أبطال أوروبا اليوم",
    "goolza",
  ],
  alternates: {
    canonical: "https://goolza.com",
  },
};

const faqData = [
  {
    question: "أين أشاهد مباريات اليوم بث مباشر مجاناً؟",
    answer:
      "يمكنك متابعة جميع مباريات اليوم بث مباشر مجاناً عبر موقع جولزا goolza.com، الذي يجمع روابط البث المباشر لجميع المباريات في صفحة واحدة محدّثة لحظياً.",
  },
  {
    question: "ما هي مباريات اليوم في دوري أبطال أوروبا؟",
    answer:
      "يعرض جولزا جدول مباريات دوري أبطال أوروبا اليوم بالتوقيت العربي مع القنوات الناقلة. يُحدَّث الجدول يومياً ليشمل جميع مباريات الليلة.",
  },
  {
    question: "كيف أعرف القناة الناقلة لمباراة اليوم؟",
    answer:
      "يُظهر جولزا اسم القناة الناقلة بجانب كل مباراة في الجدول، سواء كانت beIN Sports أو SSC أو MBC أو أي قناة مجانية أو مشفرة.",
  },
  {
    question: "هل يعمل موقع جولزا على الجوال؟",
    answer:
      "نعم، موقع جولزا متوافق بالكامل مع الهواتف الذكية وأجهزة الكمبيوتر، ويمكنك متابعة مباريات اليوم مباشرة من أي جهاز.",
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
              (e) => e.id?.toString() === match.id?.toString()
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

      <ScheduleClient initialMatches={initialMatches} />

      {/* ═══ SEO Content Section (server-rendered, crawlable) ═══ */}
      <section
        dir="rtl"
        style={{
          direction: "rtl",
          textAlign: "right",
          marginTop: "3rem",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "2.5rem 1.5rem",
          maxWidth: "56rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#10b981",
            marginBottom: "1rem",
          }}
        >
          مباريات اليوم بث مباشر — جدول كامل لكل المباريات
        </h2>
        <p
          style={{
            color: "rgba(203,213,225,0.75)",
            lineHeight: 1.9,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          يُقدّم موقع جولزا جدولاً شاملاً لمباريات اليوم بث مباشر، يضمّ جميع
          المباريات من أبرز الدوريات العالمية كالدوري السعودي للمحترفين، دوري
          أبطال أوروبا، الدوري الإسباني، الدوري الإنجليزي الممتاز، والدوري
          المصري. يمكنك متابعة جميع مباريات كرة القدم اليوم مجاناً وبجودة عالية
          دون الحاجة إلى اشتراك.
        </p>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#10b981",
            marginBottom: "0.75rem",
          }}
        >
          بث مباشر كرة القدم — القنوات الناقلة وتوقيت المباريات
        </h2>
        <p
          style={{
            color: "rgba(203,213,225,0.75)",
            lineHeight: 1.9,
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          يعرض جولزا توقيت كل مباراة بالتوقيت المحلي لكل دولة عربية، مع اسم
          القناة الناقلة لكل مباراة سواء كانت beIN Sports أو SSC أو MBC أو
          غيرها. احرص على مراجعة جدول مباريات اليوم كرة القدم قبل انطلاق
          المباريات للاطلاع على آخر التعديلات في المواعيد والقنوات الناقلة.
        </p>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#10b981",
            marginBottom: "0.75rem",
          }}
        >
          نتائج المباريات ومباريات الغد — كل ما تحتاجه في مكان واحد
        </h2>
        <p
          style={{
            color: "rgba(203,213,225,0.75)",
            lineHeight: 1.9,
            marginBottom: "2rem",
            fontSize: "0.95rem",
          }}
        >
          إلى جانب مباريات اليوم، يتيح لك جولزا الاطلاع على نتائج مباريات أمس
          ومتابعة جدول مباريات غد. سواء كنت تبحث عن مباريات دوري أبطال أوروبا
          الليلة أو أي مباراة في أي دوري عربي أو عالمي، ستجد كل التفاصيل هنا —
          التشكيلة، أهداف مباريات اليوم، وملخصات الجولات.
        </p>

        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: "1rem",
          }}
        >
          أسئلة شائعة
        </h3>
        <dl
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {faqData.map((item, i) => (
            <div
              key={i}
              style={{
                background: "rgba(30,41,59,0.6)",
                borderRadius: "0.75rem",
                padding: "1rem 1.25rem",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <dt
                style={{
                  fontWeight: 700,
                  color: "#e2e8f0",
                  marginBottom: "0.5rem",
                  fontSize: "0.95rem",
                }}
              >
                {item.question}
              </dt>
              <dd
                style={{
                  color: "rgba(203,213,225,0.75)",
                  fontSize: "0.9rem",
                  lineHeight: 1.8,
                }}
              >
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
