"use client";

import React, { useState } from "react";
import { Phone, Video, Clock, Play, ChevronRight } from "lucide-react";

type Mood = "happy" | "neutral" | "low" | "sad";
type CallType = "voice" | "video" | "missed";
type Filter = "all" | CallType;

const moodClass: Record<Mood, string> = { happy: "mood-happy", neutral: "mood-neutral", low: "mood-low", sad: "mood-sad" };
const moodLabel: Record<Mood, string> = { happy: "Happy", neutral: "Neutral", low: "Low", sad: "Sad" };

const CALLS: { id: string; date: string; type: CallType; duration: string; mood: Mood; summary: string; topics: string[]; concern: string }[] = [
  { id: "1", date: "Today, 7:30 AM",     type: "voice",  duration: "4 min 12 sec", mood: "happy",
    summary: "Meera sounded bright and cheerful. She mentioned she slept well and had idli for breakfast. She asked about your upcoming trip and is looking forward to your visit.",
    topics: ["Health", "Food", "Family"], concern: "" },
  { id: "2", date: "Yesterday, 7:31 AM", type: "voice",  duration: "3 min 48 sec", mood: "neutral",
    summary: "Meera was quieter than usual. She mentioned mild knee pain but said it's manageable. She took her medicines and watched her favourite serial.",
    topics: ["Health", "Medicines", "Routine"], concern: "Mild knee pain mentioned" },
  { id: "3", date: "Sat, 7:30 AM",       type: "video",  duration: "5 min 02 sec", mood: "happy",
    summary: "Very lively video call. Meera talked about the neighbour's granddaughter's wedding and said the food was delicious.",
    topics: ["Social", "Events", "Food"], concern: "" },
  { id: "4", date: "Fri, 7:29 AM",       type: "voice",  duration: "4 min 30 sec", mood: "low",
    summary: "Meera mentioned feeling lonely and missing having people around. She was gentle but clearly a bit down. Consider scheduling a personal call this week.",
    topics: ["Emotional", "Loneliness"], concern: "Expressed loneliness — consider a personal call this week" },
  { id: "5", date: "Thu, 7:30 AM",       type: "missed", duration: "—",            mood: "neutral",
    summary: "Call was not answered. A retry was placed at 9:00 AM and was answered.",
    topics: [], concern: "" },
];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" }, { id: "voice", label: "Voice" },
  { id: "video", label: "Video" }, { id: "missed", label: "Missed" },
];

export default function CallsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>("1");

  const visible = filter === "all" ? CALLS : CALLS.filter((c) => c.type === filter);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Call History</h1>
        <p className="text-sm text-[#888884]">Every call with Meera Nair, summarised.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === id
                ? "bg-[#1a6b55] text-white border-[#1a6b55]"
                : "border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321]"
            }`}>
            {label} <span className="opacity-50 ml-1">{id === "all" ? CALLS.length : CALLS.filter((c) => c.type === id).length}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((call) => (
          <div key={call.id} className="card-base cursor-pointer hover:shadow-card-hover transition-shadow"
            onClick={() => setExpanded(expanded === call.id ? null : call.id)}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  call.type === "missed"
                    ? "bg-[#fdeaea] dark:bg-[#2e1414] text-[#e24b4a]"
                    : "bg-[#e1f5ee] dark:bg-[#1e2820] text-[#1a6b55] dark:text-[#2d9574]"
                }`}>
                  {call.type === "video" ? <Video size={15} /> : <Phone size={15} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">{call.date}</p>
                    {call.type === "missed"
                      ? <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#fdeaea] dark:bg-[#2e1414] text-[#e24b4a]">Missed</span>
                      : <span className={`text-[11px] px-2 py-0.5 rounded-full ${moodClass[call.mood]}`}>{moodLabel[call.mood]}</span>
                    }
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f7f6f3] dark:bg-[#222321] text-[#888884] capitalize">{call.type}</span>
                  </div>
                  <p className="text-xs text-[#888884] mt-0.5 flex items-center gap-1"><Clock size={10} />{call.duration}</p>
                </div>
              </div>
              <ChevronRight size={15} className={`text-[#aaa] shrink-0 mt-1 transition-transform ${expanded === call.id ? "rotate-90" : ""}`} />
            </div>

            {expanded === call.id && (
              <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] animate-fade-in space-y-3">
                <p className="text-sm text-[#555550] dark:text-[#aaa] leading-relaxed">{call.summary}</p>
                {call.concern && (
                  <div className="alert-medium rounded-[8px] px-3 py-2 text-xs text-[#c47d10] dark:text-[#efb045]">⚠ {call.concern}</div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {call.topics.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#f7f6f3] dark:bg-[#222321] text-[#555550] dark:text-[#aaa]">{t}</span>
                  ))}
                  {call.type !== "missed" && (
                    <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321]">
                      <Play size={10} /> Play recording
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
