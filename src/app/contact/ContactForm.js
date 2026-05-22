"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function ContactForm() {
  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 font-sans transition-colors duration-300"
      dir="rtl"
    >
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
          </Link>
          <nav>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#ff7a00] text-sm transition-colors font-medium"
            >
              العودة للرئيسية
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="animate-[fadeIn_0.4s_ease_forwards]">
          <h1 className="text-3xl font-black text-[#ff7a00] mb-2">اتصل بنا</h1>
          <p className="text-slate-300 text-sm mb-10">
            نسعد بتواصلك معنا. اختر الطريقة المناسبة لك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Mail,
              title: "البريد الإلكتروني",
              value: "contact@goolza.com",
            },
            {
              icon: Phone,
              title: "الهاتف",
              value: "+212 600 000 000",
            },
            {
              icon: MapPin,
              title: "العنوان",
              value: "الدار البيضاء، المغرب",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 text-center hover:border-[#ff7a00]/30 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ff7a00]/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-[#ff7a00]" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1">
                {item.title}
              </h3>
              <p className="text-slate-300 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-bold text-[#ff7a00] mb-6">
            أرسل لنا رسالة
          </h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-slate-300 text-xs font-bold mb-2 block uppercase tracking-wider">
                  الاسم
                </label>
                <input
                  type="text"
                  placeholder="اسمك الكامل"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00] transition-all"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs font-bold mb-2 block uppercase tracking-wider">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-xs font-bold mb-2 block uppercase tracking-wider">
                الموضوع
              </label>
              <input
                type="text"
                placeholder="موضوع الرسالة"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00] transition-all"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs font-bold mb-2 block uppercase tracking-wider">
                الرسالة
              </label>
              <textarea
                rows={5}
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00] transition-all resize-none"
              />
            </div>
            <button
              type="button"
              className="bg-[#ff7a00] text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-[#e06b00] active:scale-95 transition-all duration-200 shadow-lg shadow-[#ff7a00]/20"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
