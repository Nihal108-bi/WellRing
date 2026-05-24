"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertPreview,
  CallPreview,
  DashboardPreview,
  VoicePreview,
  BaselinePreview,
  VideoPreview,
} from "@/components/landing/FeatureCardPreviews";

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShow(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, show };
}

const cards = [
  { tag: "Real-time", title: "Smart Alerts", desc: "Instant notifications if something sounds off. Peace of mind, always.", preview: <AlertPreview /> },
  { tag: "Every day", title: "Daily AI Calls", desc: "A warm, natural conversation every morning. Powered by your voice.", preview: <CallPreview /> },
  { tag: "Live data", title: "Family Dashboard", desc: "Live summaries, mood tracking, and alerts — all in one place.", preview: <DashboardPreview /> },
  { tag: "Personalised", title: "Voice Cloning", desc: "Your voice, cloned with care, so your senior always hears someone familiar.", preview: <VoicePreview /> },
  { tag: "Longitudinal", title: "Behavioral Baseline", desc: "Track changes over time against your senior's personal baseline.", preview: <BaselinePreview /> },
  { tag: "🎥 New", title: "AI Video Avatar", desc: "Weekly video calls where Mom sees your face — powered by your cloned avatar.", preview: <VideoPreview /> },
];

export default function LandingFeatures() {
  const { ref: headRef, show: headShow } = useFadeUp();
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setCardsVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" className="relative py-24 px-5 bg-white dark:bg-[#111210] overflow-hidden">
      {/* Ambient gradient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -right-20 w-[500px] h-[500px] rounded-full bg-emerald-50/60 dark:bg-emerald-950/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-16 w-[360px] h-[360px] rounded-full bg-teal-50/40 dark:bg-teal-950/30 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Asymmetric header: left heading, right descriptor */}
        <div
          ref={headRef}
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 transition-all duration-700 ease-out ${headShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="lg:max-w-[460px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              <span className="tracking-[0.2em] text-xs uppercase text-[#1a6b55] dark:text-emerald-400">What WellRing does</span>
            </div>
            <h2
              className="text-4xl md:text-5xl leading-[1.1] text-[#1a1a18] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-[#c5e8dd]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Everything you need,{" "}
              <span className="text-[#1a6b55] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-emerald-300 dark:to-emerald-500">
                nothing you don't.
              </span>
            </h2>
          </div>
          <div className="lg:max-w-[260px] lg:pb-1">
            <p className="text-sm text-[#555550] dark:text-[#888884] leading-relaxed mb-3">
              Designed for families caring for seniors from a distance. Simple for seniors, powerful for families.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#888884]">
              6 integrated features
            </span>
          </div>
        </div>

        {/* Feature cards grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ tag, title, desc, preview }, i) => (
            <div
              key={title}
              className={`bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)] rounded-[14px] p-5 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all duration-500 group ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{ transitionDelay: cardsVisible ? `${i * 70}ms` : "0ms" }}
            >
              <div className="mb-4 group-hover:scale-[1.01] transition-transform duration-300">
                {preview}
              </div>
              <span className="tracking-[0.18em] text-[9px] uppercase text-[#1a6b55] dark:text-emerald-400 font-medium">
                {tag}
              </span>
              <h3
                className="text-base text-[#1a1a18] dark:text-[#f0efe9] mt-0.5 mb-1.5"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-[#555550] dark:text-[#888884] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
