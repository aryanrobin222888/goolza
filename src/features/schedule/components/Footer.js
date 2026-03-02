"use client";
import Link from "next/link";
import { Zap } from "lucide-react";
import { FacebookIcon, TelegramIcon, TikTokIcon, XIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#5c2d91] rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[#5c2d91]">
                gool<span className="text-slate-400">za</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              أسرع طريقة لمتابعة مباريات كرة القدم المفضلة لديك. تصميم نظيف وبسيط للتركيز.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">الشركة</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-slate-900 transition-colors">عن التطبيق</Link></li>
              <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900 transition-colors">الشروط</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900 transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} goolza. جميع الحقوق محفوظة.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-[#1877F2] transition-colors" title="Facebook">
              <FacebookIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-[#229ED9] transition-colors" title="Telegram">
              <TelegramIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-[#000000] transition-colors" title="TikTok">
              <TikTokIcon className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-[#000000] transition-colors" title="X (Twitter)">
              <XIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
