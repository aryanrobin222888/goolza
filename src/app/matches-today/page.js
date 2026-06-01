import SchedulePageV2 from "@/app/page";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "يلا شوت مباريات اليوم بث مباشر الان | yallashoot live",
  description:
    "جدول مباريات اليوم بث مباشر عبر موقع يلا شوت yallashoot. تابع بث مباشر يلا شوت بدون تقطيع وتعرف على القنوات الناقلة وتوقيت المباريات مجاناً.",
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
    canonical: "https://goolza.com/matches-today",
  },
};

export default function MatchesTodayPage() {
  return <SchedulePageV2 />;
}
