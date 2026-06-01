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
  metadataBase: new URL("https://goolza.com"),
  title: {
    default: "yallashoot | يلا شوت | بث مباشر مباريات اليوم لايف | Yalla Shoot",
    template: "%s | yallashoot | يلا شوت",
  },
  description:
    "موقع يلا شوت yallashoot لمشاهدة بث مباشر مباريات اليوم بدون تقطيع. تابع أهم مباريات اليوم لايف بجودة عالية HD عبر يلا شوت لايف yalla live و yalla shoot الجديد.",
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
    "كورة",
    "كرة القدم",
    "Live Football",
  ],
  authors: [{ name: "Yalla Shoot Team" }],
  creator: "Yalla Shoot",
  publisher: "Yalla Shoot",
  alternates: {
    canonical: "https://goolza.com",
  },
  verification: {
    google: "a_BdI3p-yHYsUxcVQ_4PdB9iVR98xbnTf0aHEhhe47w",
  },
  openGraph: {
    title: "yallashoot | يلا شوت | بث مباشر مباريات اليوم لايف | Yalla Shoot",
    description:
      "تابع أهم مباريات اليوم بث مباشر عبر يلا شوت الجديد (yallashoot). تغطية حصرية ومباشرة لنتائج المباريات، أخبار الدوريات العالمية والمحلية، وتفاصيل البطولات الكبرى بدون تقطيع.",
    url: "https://goolza.com",
    siteName: "يلا شوت | yallashoot",
    locale: "ar_AR",
    type: "website",
    images: [
      {
        url: "/og-image-generator",
        width: 1200,
        height: 630,
        alt: "يلا شوت — بث مباشر مباريات اليوم بدون تقطيع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "yallashoot | يلا شوت | بث مباشر مباريات اليوم لايف | Yalla Shoot",
    description:
      "تابع نتائج المباريات وجداول البطولات العالمية والمحلية وتغطية حصرية لأهم الأحداث الرياضية والبث المباشر عبر يلا شوت yallashoot.",
    site: "@YallaShoot",
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
  name: "يلا شوت | yallashoot",
  alternateName: "Yalla Shoot",
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
  name: "يلا شوت | yallashoot",
  alternateName: "Yalla Shoot",
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
          {/* Content Wrapper */}
          <div className="relative z-10 min-h-screen flex flex-col">
            <main className="flex-1 w-full">{children}</main>
          </div>

          {/* Toast */}
          <Toaster position="bottom-left" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
