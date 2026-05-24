"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Mic, Upload, Check, ChevronRight, Play, Square,
  Camera, Phone, Globe, Clock, Video, X, AlertCircle,
} from "lucide-react";

type Plan = "basic" | "family" | "family_plus" | "premium";

interface FormData {
  seniorName: string;
  phone: string;
  city: string;
  language: string;
  callTime: string;
}

const PLANS: {
  id: Plan; name: string; price: string; badge?: string;
  features: { label: string; included: boolean }[];
}[] = [
  {
    id: "basic", name: "Basic", price: "₹599/mo",
    features: [
      { label: "Daily AI call", included: true },
      { label: "Dashboard", included: true },
      { label: "Mood summaries", included: true },
      { label: "Smart alerts", included: true },
      { label: "Voice clone", included: false },
      { label: "Video avatar", included: false },
    ],
  },
  {
    id: "family", name: "Family", price: "₹1,499/mo", badge: "MOST POPULAR",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Voice clone (1 member)", included: true },
      { label: "Weekly AI video", included: true },
      { label: "Family+ video avatar", included: false },
      { label: "Daily video option", included: false },
    ],
  },
  {
    id: "family_plus", name: "Family+", price: "₹1,999/mo",
    features: [
      { label: "Everything in Family", included: true },
      { label: "Video avatar clone", included: true },
      { label: "Daily video option", included: true },
      { label: "Multiple voices", included: false },
      { label: "Doctor export", included: false },
    ],
  },
  {
    id: "premium", name: "Premium", price: "₹2,999/mo",
    features: [
      { label: "Everything in Family+", included: true },
      { label: "Multiple voices", included: true },
      { label: "Daily video + Multilingual", included: true },
      { label: "Doctor export", included: true },
      { label: "Priority support", included: true },
    ],
  },
];

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── shared styles ────────────────────────────────────────────────────────────

const btnCoral =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm transition-all duration-200 px-8 py-3.5 bg-[#d85a30] text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/40 hover:bg-[#c24e28] active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm transition-all duration-200 px-5 py-3 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/5 hover:-translate-y-0.5 active:translate-y-0";
const inputCls =
  "w-full px-4 py-2.5 rounded-[10px] bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition";
const selectCls = `${inputCls} appearance-none`;
const labelCls = "text-[10px] tracking-[0.12em] uppercase font-medium text-white/40 block mb-1.5";

// ── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ steps, current }: { steps: string[]; current: number }) {
  const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 100;
  return (
    <div className="mb-10">
      <div className="relative h-[2px] bg-white/10 rounded-full mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15)] transition-all duration-500 ease-out"
          style={{ left: `${Math.min(pct, 98)}%` }}
        />
      </div>
      <div className="flex justify-between">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`text-[9px] tracking-[0.15em] uppercase font-medium transition-colors duration-300 ${
              i === current ? "text-emerald-400" : i < current ? "text-emerald-700" : "text-white/20"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Step 1: Senior Info ──────────────────────────────────────────────────────

function Step1({
  formData, setFormData, onNext,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
}) {
  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFormData((p) => ({ ...p, [k]: e.target.value }));

  const valid =
    formData.seniorName.trim() &&
    formData.phone.trim().length >= 10 &&
    formData.city.trim() &&
    formData.language &&
    formData.callTime;

  return (
    <div className="animate-slide-up">
      <div className="mb-7">
        <span className="tracking-[0.2em] text-[9px] uppercase text-emerald-400 font-medium block mb-3">Step 1 of setup</span>
        <h2 className="text-2xl text-white mb-1.5" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Who are you caring for?
        </h2>
        <p className="text-sm text-white/45 leading-relaxed">
          Tell us about your senior — every call is personalised around these details.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Senior's name</label>
          <input type="text" placeholder="e.g. Meera Nair" value={formData.seniorName} onChange={set("seniorName")} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone number</label>
          <div className="flex">
            <span className="px-3 flex items-center rounded-l-[10px] border border-r-0 border-white/10 bg-white/5 text-sm text-white/30 select-none">+91</span>
            <input type="tel" placeholder="98765 43210" value={formData.phone} onChange={set("phone")}
              className="flex-1 px-4 py-2.5 rounded-r-[10px] bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition" />
          </div>
        </div>
        <div>
          <label className={labelCls}>City</label>
          <input type="text" placeholder="e.g. Chennai" value={formData.city} onChange={set("city")} className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`flex items-center gap-1 ${labelCls}`}><Globe size={9} /> Language</label>
            <select value={formData.language} onChange={set("language")} className={selectCls}>
              <option value="" style={{ background: "#111210" }}>Select language</option>
              {["English","Hindi","Hinglish","Tamil","Telugu","Other"].map((l) => (
                <option key={l} value={l.toLowerCase()} style={{ background: "#111210" }}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={`flex items-center gap-1 ${labelCls}`}><Clock size={9} /> Preferred call time</label>
            <select value={formData.callTime} onChange={set("callTime")} className={selectCls}>
              <option value="" style={{ background: "#111210" }}>Select time</option>
              {[["06:00","6:00 AM"],["06:30","6:30 AM"],["07:00","7:00 AM"],["07:30","7:30 AM"],
                ["08:00","8:00 AM"],["08:30","8:30 AM"],["09:00","9:00 AM"],["09:30","9:30 AM"],["10:00","10:00 AM"]
              ].map(([v, l]) => (
                <option key={v} value={v} style={{ background: "#111210" }}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button onClick={onNext} disabled={!valid} className={`${btnCoral} w-full mt-7`}>
        Continue <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ── Step 2: Choose Plan ──────────────────────────────────────────────────────

function Step2({
  selectedPlan, setSelectedPlan, onNext, onBack,
}: {
  selectedPlan: Plan;
  setSelectedPlan: (p: Plan) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-slide-up">
      <div className="mb-7">
        <span className="tracking-[0.2em] text-[9px] uppercase text-emerald-400 font-medium block mb-3">Step 2 of setup</span>
        <h2 className="text-2xl text-white mb-1.5" style={{ fontFamily: "var(--font-dm-serif)" }}>Choose your plan</h2>
        <p className="text-sm text-white/45">All plans include a 14-day free trial. No credit card required.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {PLANS.map((plan) => {
          const sel = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative text-left rounded-[14px] p-4 transition-all border ${
                sel
                  ? "border-emerald-500/50 bg-emerald-950/40 ring-1 ring-emerald-500/20"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#d85a30] text-white text-[9px] tracking-wide font-medium whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-white">{plan.name}</p>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{plan.price}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${sel ? "border-emerald-400 bg-emerald-400" : "border-white/20"}`}>
                  {sel && <div className="w-1.5 h-1.5 rounded-full bg-[#0d1510]" />}
                </div>
              </div>
              <ul className="space-y-1.5">
                {plan.features.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-1.5 text-xs">
                    <span className={included ? "text-emerald-400" : "text-white/20"}>{included ? "✓" : "–"}</span>
                    <span className={included ? "text-white/65" : "text-white/20 line-through"}>{label}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-7">
        <button onClick={onBack} className={btnGhost}>Back</button>
        <button onClick={onNext} className={`${btnCoral} flex-1`}>Continue <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

// ── Step 3: Voice Clone ──────────────────────────────────────────────────────

function Step3({ seniorName, onNext, onBack }: { seniorName: string; onNext: () => void; onBack: () => void }) {
  const [consent, setConsent] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioError, setAudioError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MIN_SECS = 120;

  const startRecording = useCallback(() => {
    setIsRecording(true); setRecordingTime(0); setAudioRecorded(false);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    if (recordingTime >= MIN_SECS) { setAudioRecorded(true); setAudioError(""); }
    else setAudioError(`Too short (${formatTime(recordingTime)}). Minimum 2 minutes required.`);
  }, [recordingTime]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setAudioError(""); setAudioRecorded(false);
    if (file.size / (128 * 1024 / 8) < MIN_SECS)
      setAudioError("File appears shorter than 2 minutes. Please provide a longer recording.");
    setAudioFile(file);
  };

  const canContinue = consent && (audioFile !== null || audioRecorded);
  const staticWave = [8, 14, 10, 20, 16, 24, 12, 18, 22, 14, 10, 16, 8, 20, 14, 10];

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <span className="tracking-[0.2em] text-[9px] uppercase text-emerald-400 font-medium block mb-3">Voice AI Setup</span>
        <h2 className="text-2xl text-white mb-1.5" style={{ fontFamily: "var(--font-dm-serif)" }}>Record your voice clone</h2>
        <p className="text-sm text-white/45 leading-relaxed">
          Your voice will make every call to{" "}
          <span className="text-emerald-400 font-medium">{seniorName || "your senior"}</span>{" "}
          feel warm and familiar. We need at least 2 minutes of clear speech.
        </p>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-[10px] bg-emerald-950/30 border border-emerald-900/40 cursor-pointer mb-5">
        <div
          className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${consent ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}
          onClick={() => setConsent(!consent)}
        >
          {consent && <Check size={11} strokeWidth={3} className="text-white" />}
        </div>
        <p className="text-sm text-white/50 leading-relaxed">
          I consent to my voice being cloned for daily check-in calls with{" "}
          <span className="font-medium text-white">{seniorName || "my senior"}</span> only.
        </p>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Upload panel */}
        <div>
          <p className={`flex items-center gap-1.5 ${labelCls}`}><Upload size={10} /> Upload audio</p>
          <div
            className={`rounded-[14px] border-2 border-dashed p-5 flex flex-col items-center gap-3 cursor-pointer transition-all min-h-[148px] justify-center ${
              isDragging || audioFile
                ? "border-emerald-500/50 bg-emerald-950/30"
                : "border-white/10 hover:border-emerald-500/30 hover:bg-emerald-950/20"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".mp3,.wav,audio/*" className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            {audioFile ? (
              <>
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Check size={16} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-white truncate max-w-[140px]">{audioFile.name}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{formatBytes(audioFile.size)}</p>
                </div>
                <button className="text-[10px] text-[#d85a30] hover:underline"
                  onClick={(e) => { e.stopPropagation(); setAudioFile(null); setAudioError(""); }}>
                  Remove
                </button>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mic size={16} className="text-white/30" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/50">Drop .mp3 or .wav</p>
                  <p className="text-[10px] text-white/25 mt-0.5">or click to browse</p>
                </div>
              </>
            )}
          </div>
          {audioError && (
            <div className="mt-2 flex items-start gap-1.5 text-[10px] text-[#d85a30]">
              <AlertCircle size={11} className="flex-shrink-0 mt-0.5" />{audioError}
            </div>
          )}
        </div>

        {/* Premium audio-studio recording panel */}
        <div>
          <p className={`flex items-center gap-1.5 ${labelCls}`}><Mic size={10} /> Record live</p>
          <div className="relative rounded-[14px] overflow-hidden bg-[#060c09] border border-emerald-900/30 p-4 min-h-[148px] flex flex-col justify-between">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-transparent to-transparent" />
            {/* Status bar */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-500 animate-pulse-dot" : "bg-emerald-800"}`} />
                <span className={`tracking-[0.2em] text-[8px] font-bold uppercase ${isRecording ? "text-red-400" : audioRecorded ? "text-emerald-600" : "text-white/25"}`}>
                  {isRecording ? "Recording" : audioRecorded ? "Captured" : "Standby"}
                </span>
              </div>
              <span className={`text-[11px] font-mono ${isRecording ? "text-red-400" : audioRecorded ? "text-emerald-400" : "text-white/20"}`}>
                {formatTime(recordingTime)}
              </span>
            </div>
            {/* Waveform visualiser */}
            <div className="flex items-end justify-center gap-[3px] h-10 relative z-10 my-1">
              {isRecording
                ? [...Array(16)].map((_, i) => (
                    <div key={i} className="animate-waveform w-[3px] rounded-sm bg-emerald-400" style={{ animationDelay: `${i * 0.05}s` }} />
                  ))
                : staticWave.map((h, i) => (
                    <div
                      key={i}
                      className={`w-[3px] rounded-sm transition-all duration-500 ${audioRecorded ? "bg-emerald-700" : "bg-white/10"}`}
                      style={{ height: `${audioRecorded ? h : Math.max(4, Math.round(h * 0.3))}px` }}
                    />
                  ))
              }
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-3 relative z-10">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={audioRecorded && !isRecording}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/50"
                    : audioRecorded
                    ? "bg-emerald-900/60 border border-emerald-700/40"
                    : "bg-white/10 border border-white/15 hover:bg-white/15"
                }`}
              >
                {audioRecorded
                  ? <Check size={16} className="text-emerald-400" />
                  : isRecording
                  ? <Square size={12} fill="white" className="text-white" />
                  : <Mic size={15} className="text-white/50" />}
              </button>
              {audioRecorded && !isRecording && (
                <>
                  <button onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-white/50 hover:bg-white/5 transition">
                    <Play size={10} /> {isPlaying ? "Pause" : "Play"}
                  </button>
                  <button onClick={() => { setAudioRecorded(false); setRecordingTime(0); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-[#d85a30] hover:bg-[#d85a30]/10 transition">
                    <X size={10} /> Redo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Script */}
      <div className="rounded-[10px] bg-white/5 border border-white/10 p-4 mb-4">
        <p className={labelCls}>Read aloud for best results</p>
        <p className="text-sm text-white/45 italic leading-relaxed">
          "Good morning! I'm just calling to check in and see how you're doing today. I hope you slept well and had a good breakfast. I love you and I'm thinking of you. Tell me, how are you feeling? Did you take your medicines? I'll call again tomorrow — take care of yourself."
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className={labelCls}>Estimated voice quality</p>
          <p className="text-xs font-medium text-emerald-400">85%</p>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700"
            style={{ width: audioFile || audioRecorded ? "85%" : "0%" }} />
        </div>
      </div>

      <p className="text-[10px] text-white/30 mb-6 flex items-center gap-1.5"><Clock size={10} /> Voice clone ready in approximately 2 hours after submission.</p>

      <div className="flex gap-3">
        <button onClick={onBack} className={btnGhost}>Back</button>
        <button onClick={onNext} disabled={!canContinue} className={`${btnCoral} flex-1`}>Continue <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

// ── Step 4: Video Avatar ─────────────────────────────────────────────────────

function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [consent, setConsent] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoRecorded, setVideoRecorded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCountdown = () => {
    setCountdown(3);
    let c = 3;
    countdownRef.current = setInterval(() => {
      c -= 1;
      if (c === 0) { clearInterval(countdownRef.current!); setCountdown(null); beginRecording(); }
      else setCountdown(c);
    }, 1000);
  };

  const beginRecording = () => {
    setIsRecording(true); setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false); setVideoRecorded(true);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const canContinue = consent && (videoFile !== null || videoRecorded);
  const tips = [
    { icon: "☀️", text: "Face a window or bright lamp" },
    { icon: "👁️", text: "Look directly into the camera lens" },
    { icon: "🗣️", text: "Speak at a natural, comfortable pace" },
    { icon: "🪟", text: "Plain, uncluttered background" },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <span className="tracking-[0.2em] text-[9px] uppercase text-emerald-400 font-medium block mb-3">Video AI Setup</span>
        <h2 className="text-2xl text-white mb-1.5" style={{ fontFamily: "var(--font-dm-serif)" }}>Record your video avatar</h2>
        <p className="text-sm text-white/45 leading-relaxed">
          Your video avatar appears in personalised video messages sent to your senior. We need 1–2 minutes of clear, well-lit footage.
        </p>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-[10px] bg-emerald-950/30 border border-emerald-900/40 cursor-pointer mb-5">
        <div
          className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${consent ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}
          onClick={() => setConsent(!consent)}
        >
          {consent && <Check size={11} strokeWidth={3} className="text-white" />}
        </div>
        <p className="text-sm text-white/50 leading-relaxed">
          I consent to my likeness being used to generate an AI video avatar for personalised messages to my senior only.
        </p>
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Upload video */}
        <div>
          <p className={`flex items-center gap-1.5 ${labelCls}`}><Upload size={10} /> Upload video</p>
          <div
            className={`rounded-[14px] border-2 border-dashed p-5 flex flex-col items-center gap-3 cursor-pointer transition-all min-h-[168px] justify-center ${
              isDragging || videoFile
                ? "border-emerald-500/50 bg-emerald-950/30"
                : "border-white/10 hover:border-emerald-500/30 hover:bg-emerald-950/20"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setVideoFile(f); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".mp4,.mov,video/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setVideoFile(f); }} />
            {videoFile ? (
              <>
                <div className="w-full h-20 rounded-[8px] bg-white/5 border border-white/10 flex items-center justify-center">
                  <Video size={22} className="text-white/20" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-white truncate max-w-[140px]">{videoFile.name}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{formatBytes(videoFile.size)}</p>
                </div>
                <button className="text-[10px] text-[#d85a30] hover:underline"
                  onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}>Remove</button>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Video size={16} className="text-white/30" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/50">Drop .mp4 or .mov</p>
                  <p className="text-[10px] text-white/25 mt-0.5">or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cinematic webcam viewfinder */}
        <div>
          <p className={`flex items-center gap-1.5 ${labelCls}`}><Camera size={10} /> Record with webcam</p>
          <div className="relative rounded-[14px] overflow-hidden bg-[#060810] border border-white/10 min-h-[168px] flex flex-col items-center justify-center gap-3 p-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal-950/50 via-transparent to-blue-950/30" />
            {/* Viewfinder corner brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-white/25 pointer-events-none" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-white/25 pointer-events-none" />
            <div className="absolute bottom-[52px] left-3 w-5 h-5 border-b-2 border-l-2 border-white/25 pointer-events-none" />
            <div className="absolute bottom-[52px] right-3 w-5 h-5 border-b-2 border-r-2 border-white/25 pointer-events-none" />
            {/* LIVE VIDEO STREAM badge — always present, signals capability */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/20 z-10">
              <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-500 animate-pulse-dot" : "bg-red-900/60"}`} />
              <span className="tracking-[0.2em] text-[8px] font-bold text-red-400/80 uppercase">Live Video Stream</span>
            </div>
            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center gap-2 mt-3">
              {isRecording ? (
                <div className="w-12 h-12 rounded-full border-2 border-red-500/40 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-red-500/25 animate-pulse" />
                </div>
              ) : videoRecorded ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <Check size={18} className="text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-white/40">Preview ready</span>
                </>
              ) : (
                <>
                  <Camera size={22} className="text-white/15" />
                  <span className="text-[10px] text-white/25">Camera preview</span>
                </>
              )}
            </div>
            {/* Controls */}
            <div className="relative z-10 flex items-center gap-2">
              {!isRecording && !videoRecorded && countdown === null && (
                <button onClick={startCountdown}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-[11px] font-medium hover:-translate-y-0.5 active:translate-y-0 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" /> Start recording
                </button>
              )}
              {isRecording && (
                <button onClick={stopRecording}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-[11px] hover:bg-white/15 transition">
                  <Square size={10} fill="white" /> Stop
                </button>
              )}
              {videoRecorded && (
                <>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-white/50 hover:bg-white/5 transition">
                    <Play size={10} /> Preview
                  </button>
                  <button onClick={() => { setVideoRecorded(false); setRecordingTime(0); }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-[#d85a30] hover:bg-[#d85a30]/10 transition">
                    <X size={10} /> Redo
                  </button>
                </>
              )}
            </div>
            {isRecording && (
              <div className="absolute bottom-3 right-3 bg-black/60 rounded-full px-2 py-0.5 z-10">
                <span className="text-[10px] font-mono text-white/70">{formatTime(recordingTime)}</span>
              </div>
            )}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                <span className="text-white text-6xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>{countdown}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[10px] bg-amber-950/20 border border-amber-900/30 p-4 mb-4">
        <p className={`${labelCls} text-amber-400/70`}>Tips for a great avatar</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tips.map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-xs text-white/45">
              <span className="flex-shrink-0">{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-white/30 mb-6 flex items-center gap-1.5"><Clock size={10} /> Video avatar ready in approximately 4 hours after submission.</p>

      <div className="flex gap-3">
        <button onClick={onBack} className={btnGhost}>Back</button>
        <button onClick={onNext} disabled={!canContinue} className={`${btnCoral} flex-1`}>Continue <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

// ── Step 5: All Set ──────────────────────────────────────────────────────────

function Step5({ formData, selectedPlan, voiceDone, videoDone }: {
  formData: FormData; selectedPlan: Plan; voiceDone: boolean; videoDone: boolean;
}) {
  const planLabel = PLANS.find((p) => p.id === selectedPlan)?.name ?? selectedPlan;
  const firstCall = (() => {
    if (!formData.callTime) return "Tomorrow morning";
    const [h, m] = formData.callTime.split(":").map(Number);
    const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(h, m, 0, 0);
    return d.toLocaleString("en-IN", { weekday: "long", hour: "2-digit", minute: "2-digit", hour12: true });
  })();

  const items = [
    { label: "Senior", value: formData.seniorName || "—", icon: <Phone size={13} />, accent: false },
    { label: "Plan", value: `${planLabel} · ${PLANS.find((p) => p.id === selectedPlan)?.price ?? ""}`, icon: <Check size={13} />, accent: false },
    { label: "Voice clone", value: voiceDone ? "Submitted — ready in ~2 hrs" : "Not set up", icon: <Mic size={13} />, accent: voiceDone },
    { label: "Video avatar", value: videoDone ? "Submitted — ready in ~4 hrs" : "Not set up", icon: <Video size={13} />, accent: videoDone },
    { label: "First call", value: firstCall, icon: <Clock size={13} />, accent: false },
  ];

  return (
    <div className="animate-slide-up text-center">
      <div className="flex justify-center mb-7">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse" />
          <div className="absolute inset-0 rounded-full scale-125 bg-emerald-500/5 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="relative w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center z-10">
            <Check size={28} strokeWidth={2} className="text-emerald-400" />
          </div>
        </div>
      </div>
      <h2 className="text-3xl text-white mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>You're all set!</h2>
      <p className="text-sm text-white/45 mb-8 max-w-sm mx-auto leading-relaxed">
        WellRing will begin calling{" "}
        <span className="text-emerald-400 font-medium">{formData.seniorName || "your senior"}</span>{" "}
        starting tomorrow. Here's what's ready.
      </p>
      <div className="text-left bg-white/5 border border-white/10 rounded-[14px] p-5 mb-7 max-w-md mx-auto">
        <ul className="space-y-3">
          {items.map(({ label, value, icon, accent }) => (
            <li key={label} className="flex items-start gap-3 text-sm">
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${accent ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50" : "bg-white/5 text-white/30 border border-white/10"}`}>
                {icon}
              </span>
              <div>
                <p className={`${labelCls} mb-0.5`}>{label}</p>
                <p className={`text-sm font-medium ${accent ? "text-emerald-400" : "text-white/75"}`}>{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Link href="/dashboard" className={`${btnCoral} mx-auto`}>
        Go to Dashboard <ChevronRight size={15} />
      </Link>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [formData, setFormData] = useState<FormData>({ seniorName: "", phone: "", city: "", language: "", callTime: "" });
  const [selectedPlan, setSelectedPlan] = useState<Plan>("family");
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceSubmitted, setVoiceSubmitted] = useState(false);
  const [videoSubmitted, setVideoSubmitted] = useState(false);

  const needsVoice = selectedPlan !== "basic";
  const needsVideo = selectedPlan === "family_plus" || selectedPlan === "premium";

  const stepLabels = ["Senior Info", "Choose Plan", ...(needsVoice ? ["Voice Clone"] : []), ...(needsVideo ? ["Video Avatar"] : []), "All Set!"];
  const stepIds    = ["info", "plan",    ...(needsVoice ? ["voice"]      : []), ...(needsVideo ? ["video"]       : []), "done"];
  const currentStepId = stepIds[currentStep];

  const goNext = () => {
    if (currentStepId === "voice") setVoiceSubmitted(true);
    if (currentStepId === "video") setVideoSubmitted(true);
    setCurrentStep((s) => Math.min(s + 1, stepIds.length - 1));
  };
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    setCurrentStep((s) => Math.min(s, stepIds.length - 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-[#0d1510] flex flex-col relative overflow-hidden">
      {/* Ambient mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full bg-emerald-950/80 blur-3xl" />
        <div className="absolute -bottom-10 -right-16 w-[400px] h-[400px] rounded-full bg-teal-950/60 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-emerald-900/20 blur-3xl" />
      </div>

      {/* Top nav */}
      <div className="relative z-40 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/landing" className="text-xl text-emerald-400" style={{ fontFamily: "var(--font-dm-serif)" }}>
            WellRing
          </Link>
          <span className="tracking-[0.15em] text-[9px] uppercase text-white/25">
            Step {currentStep + 1} of {stepIds.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          <Stepper steps={stepLabels} current={currentStep} />
          {/* Glassmorphism card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[20px] p-6 md:p-8 shadow-2xl shadow-black/50">
            {currentStepId === "info"  && <Step1 formData={formData} setFormData={setFormData} onNext={goNext} />}
            {currentStepId === "plan"  && <Step2 selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onNext={goNext} onBack={goBack} />}
            {currentStepId === "voice" && <Step3 seniorName={formData.seniorName} onNext={goNext} onBack={goBack} />}
            {currentStepId === "video" && <Step4 onNext={goNext} onBack={goBack} />}
            {currentStepId === "done"  && <Step5 formData={formData} selectedPlan={selectedPlan} voiceDone={voiceSubmitted} videoDone={videoSubmitted} />}
          </div>
        </div>
      </div>
    </div>
  );
}
