"use client";

import React, { useState } from "react";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

type Severity = "high" | "medium" | "info";
type Filter = "all" | Severity | "resolved";

const ALERTS: { id: string; severity: Severity; title: string; detail: string; time: string }[] = [
  { id: "a1", severity: "high",   title: "Missed call",          detail: "Meera did not pick up today's call at 7:30 AM. Retry placed at 9:00 AM.",                             time: "Today, 7:31 AM" },
  { id: "a2", severity: "medium", title: "Mood dip detected",    detail: "Thursday's call showed signs of low mood. Meera mentioned feeling lonely. Consider reaching out.",    time: "Thu, 7:35 AM" },
  { id: "a3", severity: "medium", title: "Medication concern",   detail: "Meera mentioned she forgot her evening tablet on Wednesday. Consider setting up a reminder.",         time: "Wed, 8:00 AM" },
  { id: "a4", severity: "info",   title: "Voice clone ready",    detail: "Meera's personalised voice clone has been successfully generated and is now active.",                 time: "12 days ago" },
  { id: "a5", severity: "info",   title: "Streak milestone",     detail: "Meera has completed 14 consecutive days of check-in calls.",                                         time: "2 days ago" },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" }, { id: "high", label: "High" },
  { id: "medium", label: "Medium" }, { id: "info", label: "Info" }, { id: "resolved", label: "Resolved" },
];

const borderClass: Record<Severity, string> = { high: "alert-high", medium: "alert-medium", info: "alert-info" };

function SeverityIcon({ s }: { s: Severity }) {
  if (s === "high")   return <AlertTriangle size={15} className="text-[#e24b4a] shrink-0 mt-0.5" />;
  if (s === "medium") return <AlertTriangle size={15} className="text-[#ef9f27] shrink-0 mt-0.5" />;
  return <Info size={15} className="text-[#3b82f6] shrink-0 mt-0.5" />;
}

export default function AlertsPage() {
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Filter>("all");

  const toggle = (id: string) =>
    setResolved((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const visible = ALERTS.filter((a) => {
    if (filter === "resolved") return resolved.has(a.id);
    if (filter === "all")      return !resolved.has(a.id);
    return a.severity === filter && !resolved.has(a.id);
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Alerts</h1>
        <p className="text-sm text-[#888884]">Important notifications about Meera Nair's wellbeing.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === id
                ? "bg-[#1a6b55] text-white border-[#1a6b55]"
                : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321]"
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <div className="card-base text-center py-10">
            <CheckCircle2 size={28} className="text-[#1a6b55] dark:text-[#2d9574] mx-auto mb-2" />
            <p className="text-sm text-[#888884]">All clear — no alerts in this category.</p>
          </div>
        )}
        {visible.map((a) => (
          <div key={a.id} className={`${resolved.has(a.id) ? "card-base opacity-50" : `${borderClass[a.severity]} rounded-[8px] px-4 py-4`} flex items-start gap-3`}>
            {resolved.has(a.id)
              ? <CheckCircle2 size={15} className="text-[#1a6b55] dark:text-[#2d9574] shrink-0 mt-0.5" />
              : <SeverityIcon s={a.severity} />
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">{a.title}</p>
                <button onClick={() => toggle(a.id)}
                  className={`text-[11px] shrink-0 px-2.5 py-1 rounded-full border transition-colors ${
                    resolved.has(a.id)
                      ? "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-[#888884] hover:text-[#e24b4a]"
                      : "border-[#1a6b55] text-[#1a6b55] dark:border-[#2d9574] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]"
                  }`}>
                  {resolved.has(a.id) ? "Undo" : "Mark resolved"}
                </button>
              </div>
              <p className="text-xs text-[#555550] dark:text-[#aaa] leading-relaxed mt-0.5">{a.detail}</p>
              <p className="text-[11px] text-[#aaa] mt-1.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
