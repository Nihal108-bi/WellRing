"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowUpRight } from "lucide-react";

const trustAvatars = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
];

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-24 px-5 bg-white dark:bg-[#111210]">
      {/* Ambient gradient mesh — multi-layer depth */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-28 w-[580px] h-[580px] rounded-full bg-emerald-100/50 dark:bg-emerald-950/60 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[340px] h-[340px] rounded-full bg-teal-50/40 dark:bg-teal-950/40 blur-3xl" />
        <div className="absolute -bottom-10 -right-20 w-[420px] h-[420px] rounded-full bg-orange-50/50 dark:bg-orange-950/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] rounded-full bg-emerald-50/30 dark:bg-emerald-900/15 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Asymmetric 58/42 split — text density tightly controlled */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-center">

          {/* Text column */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="tracking-[0.2em] text-xs uppercase font-medium text-[#1a6b55] dark:text-emerald-400">
                AI Elder Care · 2,000+ Families
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium mb-7">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              New: Live AI Video Avatar Check-ins
            </div>

            <h1
              className="text-5xl md:text-[56px] leading-[1.1] mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              <span className="text-[#1a1a18] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-[#c5e8dd]">
                Mom hears your voice.
              </span>
              <br />
              <span className="text-[#1a6b55] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-emerald-300 dark:to-emerald-600">
                Every single morning.
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#555550] dark:text-[#888884] leading-relaxed mb-9 max-w-[430px]">
              WellRing places a warm daily check-in call to your senior — using a voice clone of you, in their language, at their time.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-9">
              <Link
                href="/onboarding"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#d85a30] text-white font-medium text-sm hover:bg-[#c24e28] active:scale-95 transition-all shadow-md shadow-orange-100 dark:shadow-none"
              >
                Start Free Trial
                <ArrowUpRight
                  size={15}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] text-sm text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#f4faf7] dark:hover:bg-[#1c1d1b] transition-colors"
              >
                Watch how it works <ChevronRight size={15} />
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {trustAvatars.map((src, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111210] overflow-hidden relative shadow-sm">
                    <Image src={src} alt="family member" fill className="object-cover" sizes="32px" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#555550] dark:text-[#888884]">
                <span className="font-semibold text-[#1a1a18] dark:text-[#f0efe9]">Join 2,000+</span> families across India
              </p>
            </div>
          </div>

          {/* Visual column — compact floating UI cluster */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[290px]">
              <div className="relative rounded-[22px] overflow-hidden shadow-2xl aspect-[3/4]">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Senior on a video call"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 310px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Call completed — bottom left */}
              <div className="absolute bottom-6 -left-5 md:-left-9 z-10 animate-[float_3s_ease-in-out_infinite] bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.1)] rounded-2xl px-3 py-2.5 shadow-xl flex flex-col gap-1.5 min-w-[168px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                  <span className="tracking-[0.15em] text-[9px] uppercase text-[#888884]">Call done · 9:12 AM</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/40 text-[#1a6b55] dark:text-emerald-300 font-medium self-start">
                  😊 Feeling great today
                </span>
              </div>

              {/* Alert badge — top right */}
              <div className="absolute top-4 -right-3 md:-right-6 z-10 animate-[float_3.5s_ease-in-out_infinite_0.5s] bg-amber-50 dark:bg-amber-900/60 border border-amber-200 dark:border-amber-700 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                🔔 Sleep pattern flagged
              </div>

              {/* Savitri card — bottom right */}
              <div className="absolute -bottom-5 -right-3 md:-right-7 z-10 rotate-2 animate-[float_4s_ease-in-out_infinite_1s] bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.1)] rounded-2xl p-2 shadow-xl flex items-center gap-2">
                <div className="relative w-11 h-11 rounded-full border-2 border-white shadow overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=150&h=150&fit=crop&q=80"
                    alt="Savitri"
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1a1a18] dark:text-[#f0efe9]">Savitri, 74</p>
                  <p className="text-[10px] text-[#888884]">Lucknow</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
