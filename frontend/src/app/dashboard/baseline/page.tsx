"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Mood = "happy" | "neutral" | "low" | "sad";

const moodBar: Record<Mood, string> = {
  happy: "bg-[#1a6b55]", neutral: "bg-[#888884]", low: "bg-[#ef9f27]", sad: "bg-[#e24b4a]",
};

const METRICS = [
  { label: "Mood score",               today: 82, baseline: 75 },
  { label: "Call engagement",          today: 71, baseline: 80 },
  { label: "Response length",          today: 65, baseline: 70 },
  { label: "Medication adherence",     today: 90, baseline: 85 },
  { label: "Sleep quality (inferred)", today: 78, baseline: 72 },
];

const MOODS: Mood[] = ["happy","happy","neutral","happy","low","happy","neutral","happy","happy","happy",
                        "neutral","happy","happy","low","neutral","happy","happy","happy","neutral","low",
                        "happy","happy","neutral","happy","happy","happy","happy","neutral","happy","happy"];
const SCORES = [88,82,65,90,45,85,70,88,92,80,68,86,90,44,65,87,82,90,72,48,85,90,68,88,82,90,85,72,88,92];
const THIRTY_DAY = MOODS.map((mood, i) => ({ day: i + 1, mood, score: SCORES[i] }));

function Delta({ today, baseline }: { today: number; baseline: number }) {
  const d = today - baseline;
  if (Math.abs(d) < 2) return <span className="flex items-center gap-0.5 text-[#888884]"><Minus size={11} /> No change</span>;
  if (d > 0) return <span className="flex items-center gap-0.5 text-[#1a6b55] dark:text-[#2d9574]"><TrendingUp size={11} /> +{d}%</span>;
  return <span className="flex items-center gap-0.5 text-[#e24b4a]"><TrendingDown size={11} /> {d}%</span>;
}

export default function BaselinePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Behavioural Baseline</h1>
        <p className="text-sm text-[#888884]">Today's metrics compared to Meera's 30-day personal baseline.</p>
      </div>

      <div className="card-base space-y-5">
        <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Today vs baseline</h2>
        {METRICS.map(({ label, today, baseline }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#555550] dark:text-[#aaa]">{label}</span>
              <span className="text-xs font-medium"><Delta today={today} baseline={baseline} /></span>
            </div>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#aaa]">Baseline</span>
                  <span className="text-[10px] text-[#aaa]">{baseline}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#f0eff0] dark:bg-[#2a2a2a]">
                  <div className="h-full rounded-full bg-[#c8e6de] dark:bg-[#2d4a40]" style={{ width: `${baseline}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-[#1a6b55] dark:text-[#2d9574]">Today</span>
                  <span className="text-[10px] text-[#1a6b55] dark:text-[#2d9574]">{today}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#f0eff0] dark:bg-[#2a2a2a]">
                  <div className={`h-full rounded-full ${today >= baseline ? "bg-[#1a6b55] dark:bg-[#2d9574]" : "bg-[#ef9f27]"}`} style={{ width: `${today}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-base">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>30-day mood trend</h2>
          <TrendingUp size={14} className="text-[#1a6b55] dark:text-[#2d9574]" />
        </div>
        <div className="flex items-end gap-1 h-24 overflow-x-auto pb-1">
          {THIRTY_DAY.map(({ day, mood, score }) => (
            <div key={day} className="flex flex-col items-center gap-1 min-w-[16px] flex-1">
              <div className="w-full flex flex-col justify-end" style={{ height: "64px" }}>
                <div className={`w-full rounded-t-[2px] ${moodBar[mood]}`} style={{ height: `${score * 0.64}px` }} title={`Day ${day}: ${score}%`} />
              </div>
              {day % 5 === 0 && <span className="text-[9px] text-[#ccc]">{day}</span>}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {(["bg-[#1a6b55]","bg-[#888884]","bg-[#ef9f27]","bg-[#e24b4a]"] as const).map((color, i) => (
            <div key={color} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
              <span className="text-[11px] text-[#888884]">{["Happy","Neutral","Low","Sad"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
