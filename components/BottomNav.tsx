"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, BarChartIcon, SparklesIcon, CameraIcon, AlertIcon } from "./Icons"

export default function BottomNav() {
  const pathname = usePathname() ?? ""

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const navItem = (active: boolean) =>
    `flex flex-col items-center gap-1 cursor-pointer no-underline min-w-[52px] px-1.5 py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
      active ? "opacity-100 text-[var(--accent)]" : "opacity-40 text-[var(--text-muted)] hover:opacity-70"
    }`

  const alertsItem = (active: boolean) =>
    `flex flex-col items-center gap-1 cursor-pointer no-underline min-w-[52px] px-1.5 py-1 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
      active ? "opacity-100 text-[var(--danger)]" : "opacity-40 text-[var(--text-muted)] hover:opacity-70"
    }`

  return (
    <nav
      className="bottom-nav-wrap shrink-0 flex items-center justify-around pt-[10px] pb-[18px]"
      style={{
        background: "var(--nav-bg)",
        borderTop: "1px solid var(--border-subtle)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
      aria-label="Bottom navigation"
    >
      <Link href="/home" className={navItem(isActive("/home"))} aria-current={isActive("/home") ? "page" : undefined}>
        <HomeIcon size={22} color="currentColor" />
        <span className="text-[10px] font-semibold tracking-wider">Home</span>
      </Link>

      <Link
        href="/analytics"
        className={navItem(isActive("/analytics"))}
        aria-current={isActive("/analytics") ? "page" : undefined}
      >
        <BarChartIcon size={22} color="currentColor" />
        <span className="text-[10px] font-semibold tracking-wider">Stats</span>
      </Link>

      {/* Centre AI button */}
      <Link href="/ai-session" className="no-underline -mt-[22px] shrink-0" aria-label="AI session">
        <div
          className="w-[58px] h-[58px] rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
            boxShadow: "0 4px 20px var(--accent-glow), 0 0 0 4px var(--accent-subtle)",
          }}
          role="presentation"
        >
          <SparklesIcon size={24} color="#fff" />
        </div>
      </Link>

      <Link
        href="/food-scanner"
        className={navItem(isActive("/food-scanner") || isActive("/food-analysis"))}
        aria-current={isActive("/food-scanner") || isActive("/food-analysis") ? "page" : undefined}
      >
        <CameraIcon size={22} color="currentColor" />
        <span className="text-[10px] font-semibold tracking-wider">Scan</span>
      </Link>

      <Link
        href="/alerts"
        className={alertsItem(isActive("/alerts"))}
        aria-current={isActive("/alerts") ? "page" : undefined}
      >
        <AlertIcon size={22} color="currentColor" />
        <span className="text-[10px] font-semibold tracking-wider">Alerts</span>
      </Link>
    </nav>
  )
}