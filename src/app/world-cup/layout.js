import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Footer from "@/features/schedule/components/Footer";
import WCSubNav from "./_components/WCSubNav";

export const metadata = {
  title: "كأس العالم 2026 | يلا شوت",
  description: "تغطية حصرية وشاملة لبطولة كأس العالم 2026 على يلا شوت. تابع جدول المباريات، ترتيب المجموعات، إحصائيات اللاعبين، وآخر أخبار المونديال لحظة بلحظة وبث مباشر للمباريات.",
};

export default function WorldCupLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col" style={{ fontFamily: "var(--font-cairo)" }}>

      {/* ═══ Global Site Header ═══ */}
      <header className="sticky top-0 z-[100] w-full"
              style={{
                background: "rgba(2,6,23,0.95)",
                backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                boxShadow: "0 4px 30px rgba(0,0,0,0.4)"
              }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">

          {/* Right: Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Logo />
          </Link>

          {/* Center: NAV links (desktop) */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-200">
              الرئيسية
            </Link>
            <Link href="/world-cup" className="text-sm font-bold"
                  style={{ color: "#34d399", textShadow: "0 0 15px rgba(52,211,153,0.4)" }}>
              كأس العالم 2026
            </Link>
            <Link href="/world-cup/news" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
              الأخبار
            </Link>
          </nav>

          {/* Left: Social icons + Live pill */}
          <div className="flex items-center gap-2 shrink-0">
            <a href="https://t.me/+kDM7uK-Kq20wODlk" target="_blank" rel="noopener noreferrer"
               className="hidden md:flex p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/5 transition-all duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8.01c-.12.56-.46.7-.94.43l-2.58-1.9-1.24 1.2c-.14.14-.25.25-.52.25l.19-2.64 4.83-4.36c.21-.19-.05-.29-.32-.1L7.24 15.17l-2.52-.79c-.55-.17-.56-.55.12-.81l9.86-3.8c.45-.17.85.11.7.81l-.76.22z"/></svg>
            </a>
            <div className="hidden md:block w-px h-4 bg-white/10 mx-1" />

            {/* Live pill */}
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    color: "#34d399",
                  }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"/>
              </span>
              مباشر الآن
            </Link>
          </div>

        </div>
      </header>

      {/* ═══ WC Sub Navigation ═══ */}
      <WCSubNav />

      {/* ═══ Page Content ═══ */}
      <main className="flex-1">
        {children}
      </main>

      {/* ═══ Footer ═══ */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Footer />
      </div>

    </div>
  );
}
