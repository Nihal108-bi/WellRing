"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { num: "01", title: "Set up in 5 minutes", desc: "Enter your senior's details, choose a plan, and optionally clone your voice." },
  { num: "02", title: "We call your senior daily", desc: "WellRing's AI places a warm, personalised call every morning at their preferred time." },
  { num: "03", title: "You get a summary", desc: "Receive a concise report of the conversation, mood indicators, and any alerts." },
];

export default function LandingHowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-20 px-5 bg-[#f7f6f3] dark:bg-[#18191a]">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} ref={ref}>
          <h2 className="text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>
            How WellRing works
          </h2>
          <p className="text-[#555550] dark:text-[#888884] text-sm">Simple to start. Meaningful every day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-7 left-[calc(16.66%+8px)] right-[calc(16.66%+8px)] h-px bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)]" />
          {steps.map(({ num, title, desc }, i) => (
            <div
              key={num}
              className={`flex flex-col items-center text-center transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: show ? `${i * 120}ms` : "0ms" }}
            >
              <div className="w-14 h-14 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] text-white flex items-center justify-center text-lg font-medium mb-4 z-10 shadow-sm">
                {i + 1}
              </div>
              <h3 className="text-base font-medium text-[#1a1a18] dark:text-[#f0efe9] mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>{title}</h3>
              <p className="text-sm text-[#555550] dark:text-[#888884] leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
