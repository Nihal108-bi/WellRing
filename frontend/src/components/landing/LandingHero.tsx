"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

const trustAvatars = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
];

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 px-5 bg-[#e1f5ee] dark:bg-[#111210]">
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-emerald-100/60 dark:bg-emerald-950/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-50px] w-[300px] h-[300px] rounded-full bg-orange-100/40 dark:bg-orange-950/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-[250px] h-[250px] rounded-full bg-teal-100/30 dark:bg-teal-950/20 blur-3xl" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: text */}
        <div className="flex flex-col items-start">
          {/* New animated video avatar badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 ring-1 ring-emerald-400/50 animate-pulse text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            ✨ New: Live AI Video Avatar Check-ins 🎥
          </div>

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-sm text-[#1a6b55] dark:text-[#2d9574] mb-7 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] animate-pulse-dot inline-block" />
            AI Elder Care · Trusted by 2,000+ families
          </div>

          <h1 className="text-4xl md:text-5xl text-[#1a1a18] dark:text-[#f0efe9] leading-[1.15] mb-5" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Mom hears your voice.{" "}
            <span className="text-[#1a6b55] dark:text-[#2d9574]">Every single morning.</span>
          </h1>

          <p className="text-base md:text-lg text-[#555550] dark:text-[#888884] leading-relaxed mb-8 max-w-md">
            WellRing's AI places a warm daily check-in call to your senior — using a voice clone of you, in their language, at their time.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
            <Link href="/onboarding" className="px-8 py-3.5 rounded-full bg-[#d85a30] text-white font-medium text-sm hover:bg-[#c24e28] active:scale-95 transition-all shadow-sm">
              Start Free Trial
            </Link>
            <a href="#how-it-works" className="px-6 py-3.5 rounded-full border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.15)] text-sm text-[#1a6b55] dark:text-[#2d9574] hover:bg-white dark:hover:bg-[#1c1d1b] transition-colors inline-flex items-center gap-1.5">
              Watch how it works <ChevronRight size={15} />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {trustAvatars.map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111210] overflow-hidden relative">
                  <Image src={src} alt="family member" fill className="object-cover" sizes="32px" />
                </div>
              ))}
            </div>
            <p className="text-sm text-[#555550] dark:text-[#888884]">
              <span className="font-semibold text-[#1a1a18] dark:text-[#f0efe9]">Join 2,000+</span> families across India
            </p>
          </div>
        </div>

        {/* Right: image with floating overlays */}
        <div className="relative flex items-center justify-center">
          <div className="pointer-events-none absolute top-0 left-0 w-48 h-48 rounded-full bg-emerald-200/40 dark:bg-emerald-900/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 w-40 h-40 rounded-full bg-orange-100/30 dark:bg-orange-900/20 blur-3xl" />

          <div className="relative w-full max-w-sm">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
              <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Senior on a video call" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" priority />
            </div>

            {/* Bottom-left floating call card */}
            <div className="absolute bottom-4 left-[-16px] md:left-[-32px] z-10 animate-[float_3s_ease-in-out_infinite] bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-2.5 shadow-lg flex flex-col gap-1.5 min-w-[180px]">
              <div className="flex items-center gap-1.5 text-xs text-[#555550] dark:text-[#aaa]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot inline-block" />
                Call completed · 9:12 AM
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/40 text-[#1a6b55] dark:text-emerald-300 font-medium self-start">
                😊 Feeling great today
              </span>
            </div>

            {/* Top-right alert badge */}
            <div className="absolute top-3 right-[-12px] md:right-[-24px] z-10 animate-[float_3.5s_ease-in-out_infinite_0.5s] bg-amber-50 dark:bg-amber-900/60 border border-amber-200 dark:border-amber-700 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
              🔔 Sleep pattern flagged
            </div>

            {/* Second floating card — Savitri, bottom-right, rotated */}
            <div className="absolute bottom-[-20px] right-[-12px] md:right-[-28px] z-10 rotate-2 animate-[float_4s_ease-in-out_infinite_1s] bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] rounded-xl p-2 shadow-lg flex items-center gap-2">
              <div className="relative w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden flex-shrink-0">
                <Image src="https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=150&h=150&fit=crop&q=80" alt="Savitri" fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#1a1a18] dark:text-[#f0efe9]">Savitri, 74</p>
                <p className="text-[10px] text-[#888884]">Lucknow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
