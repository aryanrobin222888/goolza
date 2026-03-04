import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm",
});

export const metadata = {
  metadataBase: new URL("https://goolza.com"), // Replace with actual domain when deployed
  title: {
    default: "goolza - جدول مباريات اليوم وبث مباشر",
    template: "%s | goolza",
  },
  description:
    "تابع أحدث نتائج مباريات كرة القدم، البث المباشر، وجداول المباريات للدوريات العالمية والمحلية في goolza.",
  keywords: [
    "مباريات اليوم",
    "كورة",
    "بث مباشر",
    "كرة القدم",
    "الدوري الانجليزي",
    "الدوري الاسباني",
    "دوري روشن",
    "Live Football",
    "Match Schedule",
    "goolza",
  ],
  authors: [{ name: "goolza Team" }],
  creator: "goolza",
  publisher: "goolza",
  openGraph: {
    title: "goolza - جدول مباريات اليوم وبث مباشر",
    description:
      "تابع أحدث نتائج مباريات كرة القدم، البث المباشر، وجداول المباريات للدوريات العالمية والمحلية.",
    url: "https://goolza.com",
    siteName: "goolza",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or is added later
        width: 1200,
        height: 630,
        alt: "goolza - Live Matches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "goolza - جدول مباريات اليوم",
    description: "تابع نتائج المباريات وجداول البطولات العالمية والمحلية.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlexSansArabic.variable}`} suppressHydrationWarning>
      <head>
      </head>
      <body style={{ backgroundColor: "#020617", color: "#f8fafc" }} suppressHydrationWarning>
          <QueryProvider>
            {/* Content */}
            <div className="relative z-10">{children}</div>

            {/* Toast */}
            <Toaster
              position="bottom-left"
              richColors
              closeButton
            />
          </QueryProvider>
      </body>
    </html>
  );
}
