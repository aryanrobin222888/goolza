"use client";

import Link from "next/link";
import { Zap, ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans" dir="rtl">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#5c2d91] flex items-center justify-center transition-transform group-hover:scale-105">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#5c2d91]">
              goolza
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-slate-500 hover:text-[#5c2d91] text-sm transition-colors font-medium">
            العودة للرئيسية
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-[#5c2d91] mb-2">اتصل بنا</h1>
          <p className="text-slate-500 text-sm mb-10">نسعد بتواصلك معنا. اختر الطريقة المناسبة لك.</p>
        </motion.div>

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
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-[#5c2d91]/20 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5c2d91]/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-[#5c2d91]" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-[#5c2d91] mb-6">أرسل لنا رسالة</h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-slate-500 text-xs font-bold mb-2 block uppercase tracking-wider">الاسم</label>
                <input
                  type="text"
                  placeholder="اسمك الكامل"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5c2d91] focus:ring-1 focus:ring-[#5c2d91] transition-all"
                />
              </div>
              <div>
                <label className="text-slate-500 text-xs font-bold mb-2 block uppercase tracking-wider">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5c2d91] focus:ring-1 focus:ring-[#5c2d91] transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-bold mb-2 block uppercase tracking-wider">الموضوع</label>
              <input
                type="text"
                placeholder="موضوع الرسالة"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5c2d91] focus:ring-1 focus:ring-[#5c2d91] transition-all"
              />
            </div>
            <div>
              <label className="text-slate-500 text-xs font-bold mb-2 block uppercase tracking-wider">الرسالة</label>
              <textarea
                rows={5}
                placeholder="اكتب رسالتك هنا..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#5c2d91] focus:ring-1 focus:ring-[#5c2d91] transition-all resize-none"
              />
            </div>
            <button
              type="button"
              className="bg-[#5c2d91] text-white font-bold text-sm px-8 py-3 rounded-xl hover:bg-[#4a2475] active:scale-95 transition-all duration-200 shadow-lg shadow-[#5c2d91]/20"
            >
              إرسال الرسالة
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
