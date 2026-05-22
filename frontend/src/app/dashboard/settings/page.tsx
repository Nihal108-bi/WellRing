"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Mic, CheckCircle2, Check } from "lucide-react";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TIMES = ["06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00"];

const CONSENTS: { key: "voice" | "video" | "retention" | "family"; label: string; desc: string }[] = [
  { key: "voice",     label: "Voice cloning",              desc: "Use my voice recording to generate a personalised AI voice for Meera's calls" },
  { key: "video",     label: "Video avatar",               desc: "Use my video recording to generate an AI video avatar for personalised messages" },
  { key: "retention", label: "Data retention (12 months)", desc: "Store call recordings and summaries for up to 12 months" },
  { key: "family",    label: "Family member sharing",      desc: "Allow other members added to this account to view call summaries and alerts" },
];

export default function SettingsPage() {
  const [callTime, setCallTime] = useState("07:30");
  const [activeDays, setActiveDays] = useState(new Set(DAYS));
  const [consents, setConsents] = useState<Record<string, boolean>>({ voice: true, video: false, retention: true, family: true });
  const [saved, setSaved] = useState(false);

  const toggleDay = (d: string) =>
    setActiveDays((prev) => { const s = new Set(prev); s.has(d) ? s.delete(d) : s.add(d); return s; });

  const toggleConsent = (k: string) =>
    setConsents((prev) => ({ ...prev, [k]: !prev[k] }));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Settings</h1>
        <p className="text-sm text-[#888884]">Manage Meera's call preferences and your account.</p>
      </div>

      {/* Call schedule */}
      <div className="card-base space-y-4">
        <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Call schedule</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5 flex items-center gap-1.5"><Clock size={12} />Daily call time</label>
            <select value={callTime} onChange={(e) => setCallTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#222321] text-sm text-[#1a1a18] dark:text-[#f0efe9] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30">
              {TIMES.map((t) => <option key={t} value={t}>{t} {parseInt(t) < 12 ? "AM" : "PM"}</option>)}
            </select>
          </div>
          <div>
            <p className="text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5">Active days</p>
            <div className="flex gap-1.5">
              {DAYS.map((d) => (
                <button key={d} onClick={() => toggleDay(d)}
                  className={`w-9 h-9 rounded-full text-xs font-medium transition-colors ${
                    activeDays.has(d)
                      ? "bg-[#1a6b55] text-white dark:bg-[#2d9574]"
                      : "bg-[#f7f6f3] dark:bg-[#222321] text-[#888884] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]"
                  }`}>
                  {d[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Voice clone */}
      <div className="card-base">
        <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9] mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Voice clone</h2>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] flex items-center justify-center text-[#1a6b55] dark:text-[#2d9574]">
            <Mic size={18} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">Voice clone active</p>
            <p className="text-xs text-[#888884]">Recorded by Rohan Nair · 9 May 2025</p>
          </div>
          <Link href="/onboarding" className="text-xs px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]">
            Re-record
          </Link>
        </div>
      </div>

      {/* Consent vault */}
      <div className="card-base">
        <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Consent vault</h2>
        <p className="text-xs text-[#888884] mb-4">Authorisations you've granted to WellRing.</p>
        <div className="space-y-2">
          {CONSENTS.map(({ key, label, desc }) => (
            <label key={key} onClick={() => toggleConsent(key)}
              className="flex items-start gap-3 cursor-pointer p-3 rounded-[10px] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors">
              <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${
                consents[key]
                  ? "bg-[#1a6b55] dark:bg-[#2d9574] border-[#1a6b55] dark:border-[#2d9574]"
                  : "border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)]"
              }`}>
                {consents[key] && <Check size={11} strokeWidth={3} className="text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">{label}</p>
                <p className="text-xs text-[#888884] leading-relaxed">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Plan & billing */}
      <div className="card-base">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Plan & billing</h2>
            <p className="text-xs text-[#888884] mt-0.5">Family plan · ₹1,499/month</p>
          </div>
          <Link href="/landing#pricing" className="text-xs px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]">
            Upgrade
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888884] p-3 rounded-[10px] bg-[#f7f6f3] dark:bg-[#222321]">
          <CheckCircle2 size={13} className="text-[#1a6b55] dark:text-[#2d9574]" />
          Next billing on <span className="font-medium text-[#555550] dark:text-[#aaa] ml-1">21 June 2025</span>
        </div>
        <button className="mt-3 text-xs text-[#e24b4a] hover:underline">Cancel subscription</button>
      </div>

      <button onClick={save} className="px-6 py-2.5 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] transition-all flex items-center gap-2">
        {saved ? <><CheckCircle2 size={14} /> Saved!</> : "Save changes"}
      </button>
    </div>
  );
}
