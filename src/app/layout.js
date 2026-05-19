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
  alternates: {
    canonical: "https://goolza.com",
  },
  verification: {
    google: "a_BdI3p-yHYsUxcVQ_4PdB9iVR98xbnTf0aHEhhe47w", // Replace with your actual Google Search Console verification code
  },
  openGraph: {
    title: "goolza - جدول مباريات اليوم وبث مباشر",
    description:
      "تابع أحدث نتائج مباريات كرة القدم، البث المباشر، وجداول المباريات للدوريات العالمية والمحلية.",
    url: "https://goolza.com",
    siteName: "جولزا",
    locale: "ar_AR",
    type: "website",
    images: [
      {
        url: "/og-image-generator",
        width: 1200,
        height: 630,
        alt: "جولزا — مباريات اليوم بث مباشر",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "goolza - جدول مباريات اليوم",
    description: "تابع نتائج المباريات وجداول البطولات العالمية والمحلية.",
    site: "@goolza",
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
  name: "جولزا",
  alternateName: "goolza",
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
  name: "جولزا",
  alternateName: "goolza",
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlexSansArabic.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-55DW9Z86');`
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body style={{ backgroundColor: "#020617", color: "#f8fafc" }} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-55DW9Z86"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
