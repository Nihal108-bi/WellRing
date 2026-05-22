"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mic, Video, Clock, Play, ChevronRight, CheckCircle2, TrendingUp, AlertTriangle, Info } from "lucide-react";

type MoodLevel = "happy" | "neutral" | "low" | "sad";
type AlertSeverity = "high" | "medium" | "info";

const SENIOR = { name: "Meera Nair", streak: 14, callTime: "7:30 AM", voiceClone: true, videoAvatar: false };

const MOOD_WEEK = [
  { day: "Mon", mood: "happy" as MoodLevel, score: 90 },
  { day: "Tue", mood: "happy" as MoodLevel, score: 85 },
  { day: "Wed", mood: "neutral" as MoodLevel, score: 65 },
  { day: "Thu", mood: "low" as MoodLevel, score: 45 },
  { day: "Fri", mood: "happy" as MoodLevel, score: 88 },
  { day: "Sat", mood: "happy" as MoodLevel, score: 92 },
  { day: "Sun", mood: "neutral" as MoodLevel, score: 70 },
];

const LATEST_CALL = {
  date: "Today, 7:30 AM", duration: "4 min 12 sec", mood: "happy" as MoodLevel,
  summary: "Meera sounded bright and cheerful. She mentioned she slept well and had idli for breakfast. She asked about your upcoming trip and is looking forward to your visit.",
  topics: ["Health", "Food", "Family"],
};

const UNREAD_ALERTS = [
  { id: "a1", severity: "high" as AlertSeverity, title: "Missed call", detail: "Meera did not pick up today's call at 7:30 AM. Retrying at 9:00 AM.", time: "Today, 7:31 AM" },
  { id: "a2", severity: "medium" as AlertSeverity, title: "Mood dip detected", detail: "Thursday's call showed signs of low mood. Consider reaching out personally.", time: "Thu, 7:35 AM" },
];

const moodLabel: Record<MoodLevel, string> = { happy: "Happy", neutral: "Neutral", low: "Low", sad: "Sad" };
const moodClass: Record<MoodLevel, string> = { happy: "mood-happy", neutral: "mood-neutral", low: "mood-low", sad: "mood-sad" };
const moodBar:   Record<MoodLevel, string> = { happy: "bg-[#1a6b55]", neutral: "bg-[#888884]", low: "bg-[#ef9f27]", sad: "bg-[#e24b4a]" };
const alertBorder: Record<AlertSeverity, string> = { high: "alert-high", medium: "alert-medium", info: "alert-info" };

function AlertIcon({ s }: { s: AlertSeverity }) {
  if (s === "high")   return <AlertTriangle size={15} className="text-[#e24b4a] shrink-0" />;
  if (s === "medium") return <AlertTriangle size={15} className="text-[#ef9f27] shrink-0" />;
  return <Info size={15} className="text-[#3b82f6] shrink-0" />;
}

export default function DashboardPage() {
  const avgMood = Math.round(MOOD_WEEK.reduce((s, d) => s + d.score, 0) / MOOD_WEEK.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Good morning</h1>
        <p className="text-sm text-[#888884]">Here's how {SENIOR.name} is doing this week.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Day streak",      value: `${SENIOR.streak} days`, sub: "consecutive calls",  color: "text-[#1a6b55] dark:text-[#2d9574]", bg: "bg-[#e1f5ee] dark:bg-[#1e2820]" },
          { label: "Mood this week",  value: `${avgMood}%`,           sub: "average wellbeing",  color: "text-[#1a6b55] dark:text-[#2d9574]", bg: "bg-[#e1f5ee] dark:bg-[#1e2820]" },
          { label: "Open alerts",     value: `${UNREAD_ALERTS.length}`, sub: "need attention",   color: "text-[#e24b4a]",                       bg: "bg-[#fdeaea] dark:bg-[#2e1414]" },
          { label: "Next call",       value: SENIOR.callTime,         sub: "tomorrow morning",   color: "text-[#1a1a18] dark:text-[#f0efe9]",   bg: "bg-[#f7f6f3] dark:bg-[#222321]" },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className={`card-base ${bg}`}>
            <p className="text-xs text-[#888884] mb-1">{label}</p>
            <p className={`text-2xl font-medium mb-0.5 ${color}`} style={{ fontFamily: "var(--font-dm-serif)" }}>{value}</p>
            <p className="text-xs text-[#aaa]">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 card-base">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Mood this week</h2>
            <TrendingUp size={14} className="text-[#1a6b55] dark:text-[#2d9574]" />
          </div>
          <div className="flex items-end gap-2 h-28">
            {MOOD_WEEK.map(({ day, mood, score }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                  <div className={`w-full rounded-t-[4px] ${moodBar[mood]}`} style={{ height: `${score * 0.8}px` }} />
                </div>
                <span className="text-[10px] text-[#aaa]">{day}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {(["happy","neutral","low","sad"] as MoodLevel[]).map((m) => (
              <span key={m} className={`text-[10px] px-2 py-0.5 rounded-full ${moodClass[m]}`}>{moodLabel[m]}</span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 card-base flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Today's call</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full ${moodClass[LATEST_CALL.mood]}`}>{moodLabel[LATEST_CALL.mood]}</span>
          </div>
          <div className="flex gap-3 text-xs text-[#888884] mb-3">
            <span className="flex items-center gap-1"><Clock size={11} />{LATEST_CALL.date}</span>
            <span className="flex items-center gap-1"><Phone size={11} />{LATEST_CALL.duration}</span>
          </div>
          <p className="text-sm text-[#555550] dark:text-[#aaa] leading-relaxed flex-1 mb-4">{LATEST_CALL.summary}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {LATEST_CALL.topics.map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#f7f6f3] dark:bg-[#222321] text-[#555550] dark:text-[#aaa]">{t}</span>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321]">
              <Play size={11} /> Play recording
            </button>
            <Link href="/dashboard/calls" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#1a6b55] dark:text-[#2d9574] hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820]">
              View all <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Alerts requiring attention</h2>
          <Link href="/dashboard/alerts" className="text-xs text-[#1a6b55] dark:text-[#2d9574] hover:underline flex items-center gap-1">See all <ChevronRight size={11} /></Link>
        </div>
        <div className="space-y-3">
          {UNREAD_ALERTS.map((a) => (
            <div key={a.id} className={`${alertBorder[a.severity]} rounded-[8px] px-4 py-3 flex items-start gap-3`}>
              <AlertIcon s={a.severity} />
              <div>
                <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9] mb-0.5">{a.title}</p>
                <p className="text-xs text-[#555550] dark:text-[#aaa] leading-relaxed">{a.detail}</p>
                <p className="text-[11px] text-[#aaa] mt-1">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-base">
        <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9] mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Features active</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Phone size={15} />, label: "Daily AI call", ok: true },
            { icon: <Mic size={15} />,   label: "Voice clone",   ok: SENIOR.voiceClone },
            { icon: <Video size={15} />, label: "Video avatar",  ok: SENIOR.videoAvatar },
          ].map(({ icon, label, ok }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-[10px] bg-[#f7f6f3] dark:bg-[#222321]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-[#e1f5ee] dark:bg-[#1e2820] text-[#1a6b55] dark:text-[#2d9574]" : "bg-[#f0eff0] dark:bg-[#2a2a2a] text-[#aaa]"}`}>{icon}</div>
              <div>
                <p className="text-sm text-[#1a1a18] dark:text-[#f0efe9]">{label}</p>
                <p className={`text-xs flex items-center gap-1 ${ok ? "text-[#1a6b55] dark:text-[#2d9574]" : "text-[#aaa]"}`}>
                  {ok ? <><CheckCircle2 size={10} /> Active</> : "Not set up"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
