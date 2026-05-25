"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { FacebookIcon, TelegramIcon, TikTokIcon, XIcon } from "./SocialIcons";

// ── Major league links → internal filtered pages ─────────────────────────────
const LEAGUE_LINKS = [
  { label: "دوري أبطال أوروبا", href: "/league/champions-league" },
  { label: "الدوري الإنجليزي", href: "/league/premier-league" },
  { label: "الدوري الإسباني", href: "/league/la-liga" },
  { label: "الدوري الألماني", href: "/league/bundesliga" },
  { label: "كأس العالم 2026", href: "/league/world-cup" },
  { label: "الدوري الفرنسي", href: "/league/ligue-1" },
  { label: "دوري روشن السعودي", href: "/league/saudi-pro-league" },
  { label: "الدوري المصري", href: "/league/egypt-premier-league" },
];

const TEAM_LINKS = [
  { label: "ريال مدريد", href: "/team/real-madrid/2829" },
  { label: "برشلونة", href: "/team/barcelona/2817" },
  { label: "مانشستر سيتي", href: "/team/manchester-city/17" },
  { label: "بايرن ميونخ", href: "/team/bayern-munchen/2672" },
  { label: "باريس سان جيرمان", href: "/team/paris-saint-germain/1644" },
  { label: "ليفربول", href: "/team/liverpool/44" },
];

export default function Footer() {
  return (
    <footer
      className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 transition-colors duration-300"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed">
              أسرع طريقة لمتابعة مباريات كرة القدم المفضلة لديك. تصميم نظيف
              وبسيط للتركيز.
            </p>
          </div>

          {/* ── Semantic League Navigation ── */}
          <nav aria-label="الدوريات الرئيسية" className="min-w-[200px]">
            <p className="font-semibold text-white mb-4">الدوريات</p>
            <ul className="space-y-2.5 text-sm text-slate-300 columns-2 gap-8">
              {LEAGUE_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-[#ff7a00] transition-colors duration-300 block truncate"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Teams & Company wrapper for mobile side-by-side */}
          <div className="flex gap-16 sm:gap-24 md:gap-12 w-full md:w-auto">
            {/* ── Semantic Teams Navigation ── */}
            <nav aria-label="أبرز الفرق" className="min-w-[100px]">
              <p className="font-semibold text-white mb-4">الفرق</p>
              <ul className="space-y-3 text-sm text-slate-300">
                {TEAM_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-[#ff7a00] transition-colors duration-300 block truncate"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company links */}
            <div className="min-w-[100px]">
              <p className="font-semibold text-white mb-4">الشركة</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#ff7a00] transition-colors duration-300"
                  >
                    عن التطبيق
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-[#ff7a00] transition-colors duration-300"
                  >
                    الخصوصية
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-[#ff7a00] transition-colors duration-300"
                  >
                    الشروط
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#ff7a00] transition-colors duration-300"
                  >
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-300 text-sm">
            © {new Date().getFullYear()} Yalla Shoot — يلا شوت. جميع الحقوق
            محفوظة.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://www.facebook.com/profile.php?id=61584373584701"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white hover:text-[#ff7a00] transition-colors duration-300"
              title="Facebook"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a
              href="https://t.me/+kDM7uK-Kq20wODlk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="text-white hover:text-[#ff7a00] transition-colors duration-300"
              title="Telegram"
            >
              <TelegramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@goolza.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-white hover:text-[#ff7a00] transition-colors duration-300"
              title="TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/six1398361"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-white hover:text-[#ff7a00] transition-colors duration-300"
              title="X (Twitter)"
            >
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
