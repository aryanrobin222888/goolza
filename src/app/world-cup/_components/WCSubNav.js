"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, CalendarDays, Users, BarChart3, Newspaper } from "lucide-react";

const NAV = [
  { href: "/world-cup", label: "الرئيسية", icon: Trophy },
  { href: "/world-cup/matches", label: "المباريات", icon: CalendarDays },
  { href: "/world-cup/groups", label: "المجموعات", icon: Users },
  { href: "/world-cup/stats", label: "الإحصائيات", icon: BarChart3 },
  { href: "/world-cup/news", label: "الأخبار", icon: Newspaper },
];

export default function WCSubNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-[72px] z-[90] w-full"
         style={{
           background: "rgba(2,6,23,0.92)",
           backdropFilter: "blur(20px)",
           borderBottom: "1px solid rgba(255,255,255,0.05)",
         }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14">

          {/* WC Badge */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <span className="text-lg">🏆</span>
            <span className="text-sm font-black"
                  style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              FIFA 2026
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                  style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.2)", color: "#22d3ee" }}>
              كأس العالم
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto justify-start md:justify-end"
               style={{ scrollbarWidth: "none" }}>
            {NAV.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                      className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 shrink-0"
                      style={{
                        color: isActive ? "#22d3ee" : "rgba(148,163,184,0.8)",
                        background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
                        border: isActive ? "1px solid rgba(34,211,238,0.2)" : "1px solid transparent",
                        boxShadow: isActive ? "0 0 15px rgba(34,211,238,0.08)" : "none",
                      }}>
                  <Icon size={13} style={{ opacity: isActive ? 1 : 0.6 }} />
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                          style={{ background: "linear-gradient(90deg, #34d399, #22d3ee)" }} />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
