import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hOA-W1ToLQ-HmkA.woff2",
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#020617",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Cairo"',
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "#10b981",
          display: "flex",
        }}
      />
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          border: "4px solid #10b981",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#10b981",
            display: "flex",
          }}
        />
      </div>
      <div
        style={{
          fontSize: "96px",
          fontWeight: "700",
          color: "#ffffff",
          display: "flex",
          letterSpacing: "-2px",
        }}
      >
        يلا شوت
      </div>
      <div
        style={{
          fontSize: "32px",
          fontWeight: "400",
          color: "#10b981",
          marginTop: "16px",
          display: "flex",
        }}
      >
        جدول مباريات اليوم بث مباشر
      </div>
      <div
        style={{
          fontSize: "20px",
          color: "#475569",
          marginTop: "24px",
          display: "flex",
        }}
      >
        goolza.com
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "#10b981",
          opacity: 0.4,
          display: "flex",
        }}
      />
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Cairo",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
