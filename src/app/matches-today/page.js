import SchedulePageV2 from "@/app/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "جولزا يلا شوت مباريات اليوم بث مباشر | Goolza Yalla Shoot",
  description:
    "جدول مباريات اليوم بث مباشر عبر موقع جولزا يلا شوت Goolza. تابع بث مباشر يلا شوت بدون تقطيع، وتعرف على القنوات الناقلة وتوقيت جميع مباريات اليوم في مختلف الدوريات والبطولات العالمية.",
  keywords: [
    "جولزا",
    "goolza",
    "جولزا يلا شوت",
    "مباريات اليوم",
    "matches today",
    "yalla shoot matches today",
    "مباريات اليوم بث مباشر",
    "يلا شوت مباريات اليوم",
    "يلا شوت بث مباشر",
  ],
  alternates: {
    canonical: "https://goolza.com/matches-today",
  },
};

export default function MatchesTodayPage() {
  return <SchedulePageV2 />;
}
