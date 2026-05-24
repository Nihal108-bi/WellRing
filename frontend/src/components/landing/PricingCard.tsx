"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export interface PlanData {
  id: string;
  name: string;
  monthly: string;
  annual: string | null;
  annualSavings: string | null;
  sub: string;
  badge: string | null;
  popular: boolean;
  ctaStyle: "coral" | "outline";
  cta: string;
  href: string;
  trialNote?: string;
  features: { label: string; included: boolean }[];
}

export default function PricingCard({
  plan, annual, index, show,
}: {
  plan: PlanData; annual: boolean; index: number; show: boolean;
}) {
  const price = annual && plan.annual ? plan.annual : plan.monthly;
  const sub = annual && plan.annual ? "per year" : plan.sub;

  return (
    <div
      className={`relative rounded-[14px] p-5 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 ${
        plan.popular
          ? "bg-white dark:bg-[#1c1d1b] border-2 border-[#1a6b55] dark:border-[#2d9574] shadow-lg"
          : "bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]"
      } ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: show ? `${index * 80}ms` : "0ms" }}
    >
      {plan.badge === "MOST POPULAR" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] text-white text-[10px] font-medium whitespace-nowrap">
          MOST POPULAR
        </div>
      )}
      {plan.badge === "NEW" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d85a30] text-white text-[10px] font-medium">
          NEW
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs font-medium text-[#1a6b55] dark:text-[#2d9574] mb-1">{plan.name}</p>
        <div className="flex items-end gap-1.5 flex-wrap">
          <span className="text-2xl text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>
            {price}
          </span>
          <span className="text-[11px] text-[#555550] dark:text-[#888884] pb-0.5 leading-tight">{sub}</span>
        </div>
        {annual && plan.annualSavings && (
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Saves {plan.annualSavings}</p>
        )}
        {plan.trialNote && (
          <p className="text-[10px] text-[#888884] mt-0.5">{plan.trialNote}</p>
        )}
      </div>

      <ul className="space-y-2 mb-5 flex-1">
        {plan.features.map(({ label, included }) => (
          <li key={label} className="flex items-center gap-1.5 text-xs">
            <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
              included
                ? "bg-[#e1f5ee] dark:bg-[#1e2820] text-[#1a6b55] dark:text-[#2d9574]"
                : "bg-[#f0eff0] dark:bg-[#2a2a2a] text-[#aaa]"
            }`}>
              {included ? <Check size={8} strokeWidth={3} /> : <span className="text-[8px] leading-none">✕</span>}
            </span>
            <span className={included ? "text-[#1a1a18] dark:text-[#f0efe9]" : "text-[#aaa] line-through"}>
              {label}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`w-full py-2 rounded-full text-xs font-medium text-center transition-colors ${
          plan.ctaStyle === "coral"
            ? "bg-[#d85a30] text-white hover:bg-[#c24e28]"
            : "border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}
