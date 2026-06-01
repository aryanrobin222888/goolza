"use client";

import React from "react";

// Smartlink for goolza.com — renders as an invisible click trap overlay
// or as a styled CTA button depending on usage
const SMARTLINK = "https://www.effectivecpmnetwork.com/br3qwyryif?key=daa862878f1d5b891c1c8abe479c2906";

export default function GoolzaSmartlink({ children, className = "" }) {
  return (
    <a
      href={SMARTLINK}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

export { SMARTLINK };
