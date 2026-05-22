"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, show };
}

function AlertMockup() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-xs text-red-700 dark:text-red-300 font-medium self-start">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
        ⚠ Fall mention detected
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="text-[11px] text-[#888884] ml-1">Medium severity</span>
      </div>
    </div>
  );
}

function CallMockup() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/40 flex items-center justify-center">
          <Phone size={12} className="text-[#1a6b55] dark:text-emerald-400" />
        </div>
        <div className="flex items-end gap-0.5 h-5">
          {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
            <div key={i} className="w-1 rounded-full bg-[#1a6b55] dark:bg-emerald-400 animate-bounce" style={{ height: `${h * 3}px`, animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <span className="text-xs text-[#888884]">6m 42s</span>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/40 text-[#1a6b55] dark:text-emerald-300 self-start">😊 Happy</span>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="rounded-lg bg-[#f7f6f3] dark:bg-zinc-700/40 px-3 py-2 text-xs text-[#555550] dark:text-[#aaa] leading-relaxed">
        "Spoke about the grandkids. Mentioned back pain..."
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {["grandson", "temple", "back pain"].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/30 text-[#1a6b55] dark:text-emerald-400 text-[11px]">{t}</span>
        ))}
      </div>
    </div>
  );
}

function VoiceMockup() {
  return (
    <div className="mt-4 flex items-end gap-1 h-8">
      {[14, 22, 18, 28, 20, 32, 24, 16].map((h, i) => (
        <div key={i} className="w-2 rounded-sm bg-[#1a6b55] dark:bg-emerald-400 opacity-80" style={{ height: `${h}px` }} />
      ))}
    </div>
  );
}

function BaselineMockup() {
  return (
    <div className="mt-4 flex flex-col gap-1.5 relative">
      {[65, 80, 50, 90, 70].map((w, i) => (
        <div key={i} className="h-2 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/30 overflow-hidden">
          <div className="h-full rounded-full bg-[#1a6b55] dark:bg-emerald-400" style={{ width: `${w}%` }} />
        </div>
      ))}
      <div className="absolute top-0 bottom-0 left-[72%] w-px bg-amber-400 opacity-80" />
      <span className="text-[10px] text-amber-600 dark:text-amber-400 absolute right-0 top-0">baseline</span>
    </div>
  );
}

function VideoMockup() {
  return (
    <div className="mt-4 relative rounded-lg overflow-hidden h-24">
      <Image src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400&h=200&fit=crop&q=80" alt="Video call" fill className="object-cover" sizes="200px" />
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-bold tracking-widest text-red-400">LIVE</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 bg-black/50 backdrop-blur-sm">
        <span className="text-[10px] text-white">Video call · 8m 12s</span>
        <div className="flex items-end gap-0.5 h-4">
          {[3, 5, 4, 6, 3].map((h, i) => (
            <div key={i} className="w-1 rounded-full bg-emerald-400 animate-bounce" style={{ height: `${h * 2.5}px`, animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const cards = [
  { emoji: "🔔", title: "Smart Alerts", desc: "Instant notifications if something sounds off. Peace of mind, always.", mockup: <AlertMockup /> },
  { emoji: "📞", title: "Daily AI Calls", desc: "A warm, natural conversation every morning. Powered by your voice.", mockup: <CallMockup /> },
  { emoji: "📊", title: "Family Dashboard", desc: "Live summaries, mood tracking, and alerts — all in one place.", mockup: <DashboardMockup /> },
  { emoji: "🎙️", title: "Voice Cloning", desc: "Your voice, cloned with care, so your senior always hears someone familiar.", mockup: <VoiceMockup /> },
  { emoji: "📈", title: "Behavioral Baseline", desc: "Track changes over time against your senior's personal baseline.", mockup: <BaselineMockup /> },
  { emoji: "🎥", title: "AI Video Avatar", desc: "Weekly video calls where Mom sees your face — powered by your cloned avatar.", mockup: <VideoMockup /> },
];

export default function LandingFeatures() {
  const { ref: headRef, show: headShow } = useFadeUp();
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCardsVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 px-5 bg-white dark:bg-[#111210]">
      <div className="max-w-5xl mx-auto">
        <div
          ref={headRef}
          className={`text-center mb-12 transition-all duration-700 ease-out ${headShow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Everything you need, nothing you don't
          </h2>
          <p className="text-[#555550] dark:text-[#888884] text-sm max-w-md mx-auto">
            Designed specifically for families caring for seniors from a distance.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ emoji, title, desc, mockup }, i) => (
            <div
              key={title}
              className={`bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[14px] p-6 hover:shadow-lg transition-all duration-700 ease-out group ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: cardsVisible ? `${i * 80}ms` : "0ms" }}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform ${title === "AI Video Avatar" ? "bg-teal-100 dark:bg-teal-900/40" : "bg-[#e1f5ee] dark:bg-[#1e2820]"}`}>{emoji}</div>
              <h3 className="text-base text-[#1a1a18] dark:text-[#f0efe9] mb-1.5" style={{ fontFamily: "var(--font-dm-serif)" }}>{title}</h3>
              <p className="text-sm text-[#555550] dark:text-[#888884] leading-relaxed">{desc}</p>
              {mockup}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
