import ContactForm from "./ContactForm";

export const metadata = {
  title: "تواصل معنا — جولزا يلا شوت | Goolza Yalla Shoot",
  description:
    "تواصل مع فريق جولزا يلا شوت (Goolza Yalla Shoot) لأي استفسار حول مباريات اليوم، البث المباشر، الإعلانات، أو الإبلاغ عن أي مشاكل تقنية تواجهك أثناء تصفح الموقع.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://goolza.com/contact",
  },
  openGraph: {
    title: "تواصل معنا — جولزا يلا شوت | Goolza Yalla Shoot",
    description:
      "تواصل مع فريق جولزا يلا شوت لأي استفسار حول مباريات اليوم، البث المباشر، الإعلانات، أو الإبلاغ عن أي مشاكل تقنية تواجهك أثناء تصفح الموقع.",
    url: "https://goolza.com/contact",
    images: ["/og-image.jpg"],
    type: "website",
    siteName: "جولزا يلا شوت",
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "تواصل معنا — جولزا يلا شوت | Goolza Yalla Shoot",
    description:
      "تواصل مع فريق جولزا يلا شوت لأي استفسار حول مباريات اليوم، البث المباشر، أو الإعلانات.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
