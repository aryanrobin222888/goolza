import ContactForm from "./ContactForm";

export const metadata = {
  title: "تواصل معنا — جولزا",
  description:
    "تواصل مع فريق جولزا لأي استفسار حول مباريات اليوم أو البث المباشر.",
  alternates: {
    canonical: "https://goolza.com/contact",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
