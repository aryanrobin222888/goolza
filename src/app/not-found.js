import Link from "next/link";

export const metadata = {
  title: "الصفحة غير موجودة — جولزا",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#f8fafc",
        fontFamily: "var(--font-cairo), var(--font-ibm), Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Decorative emerald circle */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(16,185,129,0.1)",
          border: "2px solid rgba(16,185,129,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          fontSize: 36,
        }}
      >
        ⚽
      </div>

      <h1
        style={{
          fontSize: "5rem",
          fontWeight: 900,
          color: "#10b981",
          margin: "0 0 0.5rem 0",
          lineHeight: 1,
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#f8fafc",
          margin: "0 0 1rem 0",
        }}
      >
        الصفحة غير موجودة
      </h2>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "0.9rem",
          maxWidth: "28rem",
          lineHeight: 1.8,
          marginBottom: "2rem",
        }}
      >
        الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الصفحة
        الرئيسية لمتابعة جدول مباريات اليوم بث مباشر.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          backgroundColor: "#10b981",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: "0.875rem",
          padding: "0.75rem 2rem",
          borderRadius: "0.75rem",
          textDecoration: "none",
          boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
        }}
      >
        العودة إلى جدول مباريات اليوم
      </Link>
    </div>
  );
}
