"use client";

import React from "react";

export default function AdsterraBanner({ id, width, height, style = {} }) {
  // We use srcDoc to render the script in an isolated iframe.
  // This is the absolute most reliable way to load third-party ad scripts (like Adsterra)
  // in React/Next.js because:
  // 1. It completely isolates the window scope, preventing variable clashes (atOptions).
  // 2. It supports document.write which is used by many ad networks' invoke.js scripts.
  // 3. It prevents horizontal/vertical scrollbars by using scrolling="no" and overflow: hidden.
  const srcDocHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
            background: transparent !important;
          }
          iframe {
            max-width: 100% !important;
            max-height: 100% !important;
            border: none !important;
            overflow: hidden !important;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          var atOptions = {
            'key' : '${id}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${id}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={srcDocHtml}
      width={width}
      height={height}
      scrolling="no"
      frameBorder="0"
      style={{
        border: "none",
        overflow: "hidden",
        display: "block",
        margin: "0 auto",
        background: "transparent",
        ...style,
      }}
      title={`Adsterra Advertisement ${width}x${height}`}
    />
  );
}
