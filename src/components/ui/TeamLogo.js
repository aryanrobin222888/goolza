"use client";

import { useState } from "react";

export default function TeamLogo({ src, alt, size = 80, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center text-2xl ${className}`}>
        ⚽
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Team Logo"}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
