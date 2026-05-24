"use client";

import { useEffect, useRef, useState } from "react";
import PricingCard, { type PlanData } from "./PricingCard";

const plans: PlanData[] = [
  {
    id: "trial_family", name: "Free Trial", monthly: "₹0", annual: null, annualSavings: null,
    sub: "14 days, then ₹1,499/mo (Family tier)", badge: null, popular: false,
    ctaStyle: "outline", cta: "Start Free Trial", href: "/onboarding?plan=trial",
    trialNote: "Card required on day 7",
    features: [
      { label: "Daily AI call", included: true },
      { label: "Family dashboard", included: true },
      { label: "Mood summaries", included: true },
      { label: "Smart alerts", included: true },
      { label: "Voice clone (1 member)", included: true },
      { label: "Video avatar calls", included: false },
    ],
  },
  {
    id: "basic", name: "Basic", monthly: "₹599", annual: "₹5,966/yr", annualSavings: "₹1,222",
    sub: "per month", badge: null, popular: false,
    ctaStyle: "outline", cta: "Choose Basic", href: "/onboarding?plan=basic",
    features: [
      { label: "Daily AI call", included: true },
      { label: "Family dashboard", included: true },
      { label: "Mood summaries", included: true },
      { label: "Smart alerts", included: true },
      { label: "Voice cloning", included: false },
      { label: "Video avatar calls", included: false },
    ],
  },
  {
    id: "family", name: "Family", monthly: "₹1,499", annual: "₹14,930/yr", annualSavings: "₹3,058",
    sub: "per month", badge: "MOST POPULAR", popular: true,
    ctaStyle: "coral", cta: "Choose Family", href: "/onboarding?plan=family",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Voice clone (1 member)", included: true },
      { label: "Video avatar calls", included: false },
    ],
  },
  {
    id: "family_plus", name: "Family+", monthly: "₹1,999", annual: "₹19,910/yr", annualSavings: "₹4,078",
    sub: "per month", badge: "NEW", popular: false,
    ctaStyle: "outline", cta: "Choose Family+", href: "/onboarding?plan=family_plus",
    features: [
      { label: "Everything in Family", included: true },
      { label: "Weekly video avatar call", included: true },
    ],
  },
  {
    id: "premium", name: "Premium", monthly: "₹2,999", annual: "₹29,870/yr", annualSavings: "₹6,118",
    sub: "per month", badge: null, popular: false,
    ctaStyle: "outline", cta: "Choose Premium", href: "/onboarding?plan=premium",
    features: [
      { label: "Everything in Family+", included: true },
      { label: "Multiple voice clones", included: true },
      { label: "Daily video calls", included: true },
      { label: "Multilingual support", included: true },
      { label: "Doctor export", included: true },
      { label: "Priority support", included: true },
    ],
  },
];

export default function LandingPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [annual, setAnnual] = useState(false);

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

      <div className="max-w-6xl mx-auto relative">
        <div
          ref={ref}
          className={`text-center mb-8 transition-all duration-700 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-3" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Simple, transparent pricing
          </h2>
          <p className="text-[#555550] dark:text-[#888884] text-sm mb-6">No hidden fees. Cancel anytime.</p>

          <div className="inline-flex items-center gap-1 bg-[#f5f5f0] dark:bg-[#1c1d1b] rounded-full px-1.5 py-1 border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!annual ? "bg-white dark:bg-[#2a2b29] text-[#1a1a18] dark:text-[#f0efe9] shadow-sm" : "text-[#888884]"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${annual ? "bg-white dark:bg-[#2a2b29] text-[#1a1a18] dark:text-[#f0efe9] shadow-sm" : "text-[#888884]"}`}
            >
              Annual
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#1a6b55] dark:text-emerald-400 font-semibold">
                17% off
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} annual={annual} index={i} show={show} />
          ))}
        </div>
      </div>
    </section>
  );
}
