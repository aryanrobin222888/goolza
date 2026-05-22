import SchedulePageV2 from "@/app/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "يلا شوت مباريات اليوم بث مباشر | Yalla Shoot Matches Today",
  description:
    "تعرف على جدول مباريات اليوم بث مباشر عبر موقع يلا شوت Yalla Shoot. تابع أهم مباريات اليوم لحظة بلحظة وبدون تقطيع، مع تفاصيل القنوات الناقلة، المعلقين، وتحديثات النتائج المباشرة لكل البطولات.",
  keywords: [
    "مباريات اليوم",
    "matches today",
    "yalla shoot matches today",
    "مباريات اليوم بث مباشر",
    "يلا شوت مباريات اليوم",
  ],
  alternates: {
    canonical: "https://goolza.com/matches-today",
  },
};

export default function MatchesTodayPage() {
  return <SchedulePageV2 />;
}
