"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, Phone, Bell, User, BarChart2,
  Settings, Menu, X, Sun, Moon, LogOut,
} from "lucide-react";

const SENIOR = { name: "Meera Nair", city: "Chennai", callTime: "7:30 AM" };

const NAV: { href: string; label: string; Icon: React.ElementType; badge?: number }[] = [
  { href: "/dashboard",          label: "Overview",  Icon: LayoutDashboard },
  { href: "/dashboard/calls",    label: "Calls",     Icon: Phone },
  { href: "/dashboard/alerts",   label: "Alerts",    Icon: Bell, badge: 2 },
  { href: "/dashboard/profile",  label: "Profile",   Icon: User },
  { href: "/dashboard/baseline", label: "Baseline",  Icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings",  Icon: Settings },
];

function NavLinks({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
  return (
    <nav className="px-3 space-y-0.5">
      {NAV.map(({ href, label, Icon, badge }) => {
        const active = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition-colors ${
              active ? "nav-active" : "text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321]"
            }`}
          >
            <Icon size={17} />
            {label}
            {badge ? (
              <span className="ml-auto w-5 h-5 rounded-full bg-[#e24b4a] text-white text-[10px] flex items-center justify-center">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f6f3] dark:bg-[#111210]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1c1d1b]">
        <div className="h-16 flex items-center px-5 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
          <Link href="/landing" className="text-xl text-[#1a6b55] dark:text-[#2d9574]" style={{ fontFamily: "var(--font-dm-serif)" }}>
            WellRing
          </Link>
        </div>
        <div className="m-4 p-3 rounded-[10px] bg-[#e1f5ee] dark:bg-[#1e2820]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] flex items-center justify-center text-white text-sm shrink-0">
              {SENIOR.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9] truncate">{SENIOR.name}</p>
              <p className="text-xs text-[#888884]">{SENIOR.city}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] animate-pulse-dot" />
            <span className="text-xs text-[#1a6b55] dark:text-[#2d9574]">Call at {SENIOR.callTime}</span>
          </div>
        </div>
        <div className="flex-1"><NavLinks pathname={pathname} /></div>
        <div className="p-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
          <Link href="/landing" className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321]">
            <LogOut size={17} /> Sign out
          </Link>
        </div>
      </aside>

      {/* Mobile overlay + drawer */}
      {drawer && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setDrawer(false)} />}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1c1d1b] border-r border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] md:hidden transition-transform ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center justify-between px-5 border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
          <span className="text-xl text-[#1a6b55] dark:text-[#2d9574]" style={{ fontFamily: "var(--font-dm-serif)" }}>WellRing</span>
          <button onClick={() => setDrawer(false)} className="text-[#aaa]"><X size={20} /></button>
        </div>
        <div className="pt-4"><NavLinks pathname={pathname} onClick={() => setDrawer(false)} /></div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 flex items-center justify-between px-5 bg-white dark:bg-[#1c1d1b] border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
          <button className="md:hidden p-1.5 rounded-full hover:bg-[#f7f6f3] dark:hover:bg-[#222321] text-[#555550] dark:text-[#aaa]" onClick={() => setDrawer(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full hover:bg-[#f7f6f3] dark:hover:bg-[#222321] text-[#555550] dark:text-[#aaa]">
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}
            <Link href="/dashboard/alerts" className="relative p-2 rounded-full hover:bg-[#f7f6f3] dark:hover:bg-[#222321] text-[#555550] dark:text-[#aaa]">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e24b4a]" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] flex items-center justify-center text-white text-xs ml-1">Y</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
