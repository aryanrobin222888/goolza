"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden">
        <Image src="/logo.png" alt="goolza logo" width={32} height={32} className="w-full h-full object-cover" unoptimized />
      </div>
      <span className="text-lg font-bold tracking-tight text-[#0aa674]">
        gool<span className="text-white">za</span>
      </span>
    </>
  );
}
