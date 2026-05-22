import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/providers/QueryProvider";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import LeftSidebarAds from "@/components/LeftSidebarAds";
import RightSidebarAds from "@/components/RightSidebarAds";
import BottomBannerAd from "@/components/BottomBannerAd";

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
  metadataBase: new URL("https://goolza.com"),
  title: {
    default: "جولزا يلا شوت | بث مباشر مباريات اليوم لايف | Goolza Yalla Shoot",
    template: "%s | جولزا يلا شوت - Goolza",
  },
  description:
    "موقع جولزا يلا شوت (Goolza) لمشاهدة بث مباشر مباريات اليوم بدون تقطيع. تابع أهم مباريات اليوم لايف بجودة عالية HD، ملخصات وأهداف اللقاءات، وجدول ترتيب الدوريات والهدافين عبر يلا شوت الجديد yallashoot.",
  keywords: [
    "جولزا",
    "goolza",
    "جولزا يلا شوت",
    "goolza yalla shoot",
    "yalla shoot",
    "يلا شوت",
    "yallashoot",
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
    "مباريات اليوم",
    "بث مباشر لايف",
    "كورة",
    "كرة القدم",
    "Live Football",
    "koraonline-yallashoot",
  ],
  authors: [{ name: "Goolza Yalla Shoot Team" }],
  creator: "Goolza Yalla Shoot",
  publisher: "Goolza Yalla Shoot",
  alternates: {
    canonical: "https://goolza.com",
  },
  verification: {
    google: "a_BdI3p-yHYsUxcVQ_4PdB9iVR98xbnTf0aHEhhe47w", // Replace with your actual Google Search Console verification code
  },
  openGraph: {
    title: "جولزا يلا شوت | بث مباشر مباريات اليوم لايف | Goolza Yalla Shoot",
    description:
      "تابع أهم مباريات اليوم بث مباشر عبر جولزا يلا شوت الجديد (goolza.com). تغطية حصرية ومباشرة لنتائج المباريات، أخبار الدوريات العالمية والمحلية، وتفاصيل البطولات الكبرى بدون تقطيع.",
    url: "https://goolza.com",
    siteName: "جولزا يلا شوت",
    locale: "ar_AR",
    type: "website",
    images: [
      {
        url: "/og-image-generator",
        width: 1200,
        height: 630,
        alt: "جولزا يلا شوت — بث مباشر مباريات اليوم بدون تقطيع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جولزا يلا شوت | بث مباشر مباريات اليوم لايف | Goolza Yalla Shoot",
    description:
      "تابع نتائج المباريات وجداول البطولات العالمية والمحلية وتغطية حصرية لأهم الأحداث الرياضية والبث المباشر عبر جولزا يلا شوت.",
    site: "@GoolzaYallaShoot",
    images: ["/og-image-generator"],
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

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "جولزا يلا شوت",
  alternateName: "Goolza Yalla Shoot",
  url: "https://goolza.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://goolza.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "جولزا يلا شوت",
  alternateName: "Goolza Yalla Shoot",
  url: "https://goolza.com",
  logo: "https://goolza.com/logo.png",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61584373584701",
    "https://t.me/+kDM7uK-Kq20wODlk",
    "https://www.tiktok.com/@goolza.com",
    "https://x.com/six1398361",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${ibmPlexSansArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J0CR319JR3"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-J0CR319JR3');
            `,
          }}
        />
        {/* ── Preconnect hints for critical origins (reduce latency) ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.sofascore.com" />
        <link rel="dns-prefetch" href="https://img.sofascore.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        style={{ backgroundColor: "#030712", color: "#f8fafc" }}
        suppressHydrationWarning
      >
        <QueryProvider>
          {/* Content and Sidebar Wrapper */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 flex gap-6 relative">
              {/* Sticky Left Sidebar Ads Column */}
              <LeftSidebarAds />

              {/* Main Content Column */}
              <div className="flex-1 min-w-0">{children}</div>

              {/* Sticky Right Sidebar Ads Column */}
              <RightSidebarAds />
            </div>
          </div>

          {/* Sticky Bottom Banner Ad (1xBet) */}
          <BottomBannerAd />

          {/* Toast */}
          <Toaster position="bottom-left" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
