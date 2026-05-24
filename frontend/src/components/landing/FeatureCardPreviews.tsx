"use client";

import Image from "next/image";

const waveDelays = ["0s","0.14s","0.07s","0.21s","0.10s","0.18s","0.05s","0.15s","0.09s","0.22s","0.03s","0.17s"];

export function AlertPreview() {
  const alerts = [
    { label: "Fall mention detected", sev: "high" },
    { label: "Sleep pattern change", sev: "medium" },
    { label: "Skipped breakfast", sev: "medium" },
  ];
  return (
    <div className="rounded-xl bg-[#f7f6f3] dark:bg-[#111210] p-3 space-y-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="tracking-[0.18em] text-[9px] uppercase text-[#888884]">Live Alerts</span>
        <span className="text-[9px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded-full">3 new</span>
      </div>
      {alerts.map(({ label, sev }) => (
        <div
          key={label}
          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${sev === "high" ? "bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30" : "bg-amber-50/60 dark:bg-amber-900/10"}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sev === "high" ? "bg-red-500 animate-pulse-dot" : "bg-amber-400"}`} />
          <span className="text-[10px] text-[#555550] dark:text-[#aaa] truncate">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function CallPreview() {
  const delays = ["0s","0.08s","0.16s","0s","0.24s","0.12s","0.20s","0.04s","0.18s","0.10s"];
  return (
    <div className="rounded-xl bg-[#f7f6f3] dark:bg-[#111210] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="tracking-[0.18em] text-[9px] uppercase text-[#888884]">Today's Call</span>
        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">9:12 AM</span>
      </div>
      <div className="flex items-end gap-[3px] h-5 mb-2">
        <div className="w-5 h-5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 text-[10px]">
          📞
        </div>
        {delays.map((delay, i) => (
          <div
            key={i}
            className="animate-waveform w-[3px] rounded-sm bg-[#1a6b55] dark:bg-emerald-400"
            style={{ animationDelay: delay }}
          />
        ))}
        <span className="text-[10px] text-[#888884] ml-1 self-center">6m</span>
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/40 text-[#1a6b55] dark:text-emerald-300">
        😊 Happy and talkative
      </span>
    </div>
  );
}

export function DashboardPreview() {
  const data = [85, 70, 90, 60, 85, 75, 80];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="rounded-xl bg-[#f7f6f3] dark:bg-[#111210] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="tracking-[0.18em] text-[9px] uppercase text-[#888884]">Mood · 7 days</span>
        <span className="text-[9px] text-emerald-600 dark:text-emerald-400">↑ Improving</span>
      </div>
      <div className="flex items-end gap-1 h-9">
        {data.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
            <div
              className="w-full rounded-t-sm bg-[#1a6b55] dark:bg-emerald-500 opacity-70"
              style={{ height: `${(v / 100) * 28}px` }}
            />
            <span className="text-[8px] text-[#888884]">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VoicePreview() {
  return (
    <div className="rounded-xl bg-[#f7f6f3] dark:bg-[#111210] p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="tracking-[0.18em] text-[9px] uppercase text-[#888884]">Voice Clone</span>
        <span className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot inline-block" />
          Active
        </span>
      </div>
      <div className="flex items-end gap-[3px] h-7">
        {waveDelays.map((delay, i) => (
          <div
            key={i}
            className="animate-waveform flex-1 max-w-[5px] rounded-sm bg-[#1a6b55] dark:bg-emerald-400"
            style={{ animationDelay: delay }}
          />
        ))}
      </div>
      <p className="text-[10px] text-[#888884] mt-1.5">Priya's voice · Hindi · Cloned</p>
    </div>
  );
}

export function BaselinePreview() {
  const metrics = [
    { label: "Mood", value: 72, baseline: 70 },
    { label: "Sleep", value: 55, baseline: 75 },
    { label: "Appetite", value: 82, baseline: 70 },
  ];
  return (
    <div className="rounded-xl bg-[#f7f6f3] dark:bg-[#111210] p-3 space-y-2">
      <span className="tracking-[0.18em] text-[9px] uppercase text-[#888884] block">vs Baseline</span>
      {metrics.map(({ label, value, baseline }) => (
        <div key={label}>
          <div className="flex justify-between mb-0.5">
            <span className="text-[9px] text-[#888884]">{label}</span>
            <span className={`text-[9px] font-medium ${value >= baseline ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {value}%
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-[#e1f5ee] dark:bg-emerald-900/20">
            <div className="absolute inset-y-0 left-0 rounded-full bg-[#1a6b55] dark:bg-emerald-500" style={{ width: `${value}%` }} />
            <div className="absolute top-[-2px] bottom-[-2px] w-px bg-amber-400/90" style={{ left: `${baseline}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VideoPreview() {
  const videoWaveDelays = ["0s","0.1s","0.05s","0.15s","0.08s"];
  return (
    <div className="rounded-xl overflow-hidden relative h-[72px]">
      <Image
        src="https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400&h=200&fit=crop&q=80"
        alt="Video avatar call"
        fill
        className="object-cover"
        sizes="200px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-dot" />
        <span className="tracking-[0.2em] text-[8px] font-bold text-red-400 uppercase">Live</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between">
        <span className="text-[9px] text-white/80">Video call · 8m 12s</span>
        <div className="flex items-end gap-[2px] h-4">
          {videoWaveDelays.map((delay, i) => (
            <div
              key={i}
              className="animate-waveform w-[3px] rounded-sm"
              style={{ animationDelay: delay, background: "#34d399" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
