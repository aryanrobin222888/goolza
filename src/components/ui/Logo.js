"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="GOOLZA Logo"
        width={135}
        height={36}
        className="h-8 md:h-9 w-auto object-contain"
        priority
      />
      <span className="text-[10px] font-bold text-slate-400 bg-slate-800/60 border border-slate-700/50 px-1.5 py-0.5 rounded shrink-0">
        يلا شوت
      </span>
    </div>
  );
}
