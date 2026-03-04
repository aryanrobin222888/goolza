"use client";
import Link from "next/link";
import { Zap } from "lucide-react";
import { FacebookIcon, TelegramIcon, TikTokIcon, XIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 transition-colors duration-300" dir="rtl">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#0aa674] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#0aa674]">
                gool<span className="text-white">za</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              أسرع طريقة لمتابعة مباريات كرة القدم المفضلة لديك. تصميم نظيف وبسيط للتركيز.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">الشركة</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-[#0aa674] transition-colors duration-300">عن التطبيق</Link></li>
              <li><Link href="/privacy" className="hover:text-[#0aa674] transition-colors duration-300">الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-[#0aa674] transition-colors duration-300">الشروط</Link></li>
              <li><Link href="/contact" className="hover:text-[#0aa674] transition-colors duration-300">اتصل بنا</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-300 text-sm">
            © {new Date().getFullYear()} goolza. جميع الحقوق محفوظة.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-white hover:text-[#0aa674] transition-colors duration-300" title="Facebook">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-[#0aa674] transition-colors duration-300" title="Telegram">
              <TelegramIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-[#0aa674] transition-colors duration-300" title="TikTok">
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-white hover:text-[#0aa674] transition-colors duration-300" title="X (Twitter)">
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
