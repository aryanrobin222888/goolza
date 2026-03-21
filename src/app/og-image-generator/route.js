import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#020617",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Football icon */}
        <div
          style={{
            display: "flex",
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "#10b981",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            fontSize: 44,
            boxShadow: "0 0 60px rgba(16,185,129,0.4)",
          }}
        >
          ⚽
        </div>
        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            marginBottom: 16,
          }}
        >
          جولزا
        </div>
        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#10b981",
            fontWeight: 600,
          }}
        >
          جدول مباريات اليوم بث مباشر
        </div>
        {/* Domain */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "rgba(148,163,184,0.5)",
            marginTop: 24,
          }}
        >
          goolza.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
