"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Feature = { label: string; included: boolean; highlight?: boolean };

const plans: { name: string; price: string; sub: string; badge: string | null; popular: boolean; features: Feature[]; cta: string; href: string }[] = [
  {
    name: "Free Trial", price: "₹0", sub: "for 14 days, then ₹599/mo", badge: null, popular: false,
    features: [
      { label: "Daily AI call", included: true },
      { label: "Family dashboard", included: true },
      { label: "Mood summaries", included: true },
      { label: "Smart alerts", included: false },
      { label: "Voice cloning", included: false },
      { label: "Video avatar calls", included: false },
    ],
    cta: "Start Free Trial", href: "/onboarding",
  },
  {
    name: "Family", price: "₹1,499", sub: "per month", badge: "MOST POPULAR", popular: true,
    features: [
      { label: "Daily AI call", included: true },
      { label: "Family dashboard", included: true },
      { label: "Mood summaries", included: true },
      { label: "Smart alerts", included: true },
      { label: "Voice clone (1 member)", included: true },
      { label: "Weekly video avatar call", included: true },
    ],
    cta: "Choose Family", href: "/onboarding",
  },
  {
    name: "Premium", price: "₹2,999", sub: "per month", badge: null, popular: false,
    features: [
      { label: "Everything in Family", included: true },
      { label: "Multiple voices", included: true },
      { label: "Daily video + multiple avatars", included: true, highlight: true },
      { label: "Multilingual support", included: true },
      { label: "Doctor export", included: true },
      { label: "Priority support", included: true },
    ],
    cta: "Choose Premium", href: "/onboarding",
  },
];

export default function LandingPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="pricing" className="relative overflow-hidden py-20 px-5 bg-white dark:bg-[#111210]">
      <div className="pointer-events-none absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-emerald-100/50 dark:bg-emerald-950/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] rounded-full bg-orange-100/40 dark:bg-orange-950/20 blur-3xl" />

      <div className="max-w-5xl mx-auto relative">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-[#555550] dark:text-[#888884] text-sm">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-[14px] p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 ${plan.popular ? "bg-white dark:bg-[#1c1d1b] border-2 border-[#1a6b55] dark:border-[#2d9574] shadow-lg" : "bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]"} ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: show ? `${i * 100}ms` : "0ms" }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] text-white text-xs font-medium whitespace-nowrap">{plan.badge}</div>
              )}
              <div className="mb-5">
                <p className="text-sm font-medium text-[#1a6b55] dark:text-[#2d9574] mb-1">{plan.name}</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>{plan.price}</span>
                  <span className="text-xs text-[#555550] dark:text-[#888884] pb-1">{plan.sub}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map(({ label, included, highlight }) => (
                  <li key={label} className="flex items-center gap-2 text-sm">
                    <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${included ? "bg-[#e1f5ee] dark:bg-[#1e2820] text-[#1a6b55] dark:text-[#2d9574]" : "bg-[#f0eff0] dark:bg-[#2a2a2a] text-[#aaa]"}`}>
                      {included ? <Check size={10} strokeWidth={3} /> : <span className="text-[10px] leading-none">✕</span>}
                    </span>
                    <span className={included ? "text-[#1a1a18] dark:text-[#f0efe9]" : "text-[#aaa] line-through"}>
                      {label}
                      {highlight && included && (
                        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">🎥 NEW</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-full text-sm font-medium text-center transition-colors ${plan.popular ? "bg-[#d85a30] text-white hover:bg-[#c24e28]" : "border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
