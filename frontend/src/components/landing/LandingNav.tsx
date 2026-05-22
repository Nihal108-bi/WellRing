"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun } from "lucide-react";

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-[#111210]/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/landing"
          className="text-3xl font-bold tracking-tight text-[#1a6b55] dark:text-[#2d9574]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          WellRing
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {["Features", "How it Works", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-sm text-[#555550] dark:text-[#aaa] hover:text-[#1a6b55] dark:hover:text-[#2d9574] transition-colors">{item}</a>
          ))}
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820] transition-colors text-[#555550] dark:text-[#aaa]" aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <Link href="/login" className="text-sm px-4 py-2 rounded-full border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820] transition-colors">Login</Link>
          <Link href="/onboarding" className="text-sm px-5 py-2 rounded-full bg-[#d85a30] text-white hover:bg-[#c24e28] transition-colors font-medium">Get Started</Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820] transition-colors text-[#555550] dark:text-[#aaa]" aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820] transition-colors text-[#1a6b55] dark:text-[#2d9574]" aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1c1d1b] border-b border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] px-5 pb-4 flex flex-col gap-3 animate-fade-in">
          {["Features", "How it Works", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} className="text-sm py-2 text-[#555550] dark:text-[#aaa] hover:text-[#1a6b55] transition-colors">{item}</a>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm py-2 text-[#1a6b55] dark:text-[#2d9574] font-medium">Login</Link>
          <Link href="/onboarding" onClick={() => setMenuOpen(false)} className="text-sm px-5 py-2.5 rounded-full bg-[#d85a30] text-white text-center font-medium hover:bg-[#c24e28] transition-colors">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
