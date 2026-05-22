"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Mic,
  Upload,
  Check,
  ChevronRight,
  Play,
  Square,
  Camera,
  Phone,
  Globe,
  Clock,
  Video,
  X,
  AlertCircle,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Plan = "basic" | "family" | "family_plus" | "premium";

interface FormData {
  seniorName: string;
  phone: string;
  city: string;
  language: string;
  callTime: string;
}

// ─── PLAN CONFIG ─────────────────────────────────────────────────────────────

const PLANS: {
  id: Plan;
  name: string;
  price: string;
  badge?: string;
  features: { label: string; included: boolean }[];
}[] = [
  {
    id: "basic",
    name: "Basic",
    price: "₹599/mo",
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
    id: "family",
    name: "Family",
    price: "₹1,499/mo",
    badge: "MOST POPULAR",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Voice clone (1 member)", included: true },
      { label: "Weekly AI video", included: true },
      { label: "Family+ video avatar", included: false },
      { label: "Daily video option", included: false },
    ],
  },
  {
    id: "family_plus",
    name: "Family+",
    price: "₹1,999/mo",
    features: [
      { label: "Everything in Family", included: true },
      { label: "Video avatar clone", included: true },
      { label: "Daily video option", included: true },
      { label: "Multiple voices", included: false },
      { label: "Doctor export", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹2,999/mo",
    features: [
      { label: "Everything in Family+", included: true },
      { label: "Multiple voices", included: true },
      { label: "Daily video + Multilingual", included: true },
      { label: "Doctor export", included: true },
      { label: "Priority support", included: true },
    ],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── STEPPER ─────────────────────────────────────────────────────────────────

interface StepperProps {
  steps: string[];
  current: number;
}

function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto pb-1">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                  done
                    ? "bg-[#1a6b55] text-white"
                    : active
                    ? "bg-[#1a6b55] text-white ring-4 ring-[#e1f5ee] dark:ring-[#1e2820]"
                    : "bg-[#f0eff0] dark:bg-[#2a2a2a] text-[#aaa]"
                }`}
              >
                {done ? <Check size={13} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[10px] text-center leading-tight ${
                  active
                    ? "text-[#1a6b55] dark:text-[#2d9574] font-medium"
                    : done
                    ? "text-[#1a6b55] dark:text-[#2d9574]"
                    : "text-[#aaa]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 flex-shrink-0 mb-5 transition-colors ${
                  i < current
                    ? "bg-[#1a6b55] dark:bg-[#2d9574]"
                    : "bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── STEP 1: SENIOR INFO ──────────────────────────────────────────────────────

interface Step1Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
}

function Step1({ formData, setFormData, onNext }: Step1Props) {
  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const valid =
    formData.seniorName.trim() &&
    formData.phone.trim().length >= 10 &&
    formData.city.trim() &&
    formData.language &&
    formData.callTime;

  return (
    <div className="animate-slide-up">
      <div className="mb-7">
        <h2
          className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1.5"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Who are you caring for?
        </h2>
        <p className="text-sm text-[#555550] dark:text-[#888884]">
          Tell us a little about your senior so we can personalise every call.
        </p>
      </div>

      <div className="space-y-4">
        {/* Senior name */}
        <div>
          <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5">
            Senior's name
          </label>
          <input
            type="text"
            placeholder="e.g. Meera Nair"
            value={formData.seniorName}
            onChange={set("seniorName")}
            className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1c1d1b] text-sm text-[#1a1a18] dark:text-[#f0efe9] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5">
            Phone number
          </label>
          <div className="flex">
            <span className="px-3 flex items-center rounded-l-[10px] border border-r-0 border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-[#f7f6f3] dark:bg-[#222321] text-sm text-[#555550] dark:text-[#888884] select-none">
              +91
            </span>
            <input
              type="tel"
              placeholder="98765 43210"
              value={formData.phone}
              onChange={set("phone")}
              className="flex-1 px-4 py-2.5 rounded-r-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1c1d1b] text-sm text-[#1a1a18] dark:text-[#f0efe9] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5">
            City
          </label>
          <input
            type="text"
            placeholder="e.g. Chennai"
            value={formData.city}
            onChange={set("city")}
            className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1c1d1b] text-sm text-[#1a1a18] dark:text-[#f0efe9] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
          />
        </div>

        {/* Language + Call time (row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5 flex items-center gap-1.5">
              <Globe size={12} /> Language
            </label>
            <select
              value={formData.language}
              onChange={set("language")}
              className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1c1d1b] text-sm text-[#1a1a18] dark:text-[#f0efe9] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="hinglish">Hinglish</option>
              <option value="tamil">Tamil</option>
              <option value="telugu">Telugu</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5 flex items-center gap-1.5">
              <Clock size={12} /> Preferred call time
            </label>
            <select
              value={formData.callTime}
              onChange={set("callTime")}
              className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1c1d1b] text-sm text-[#1a1a18] dark:text-[#f0efe9] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
            >
              <option value="">Select time</option>
              <option value="06:00">6:00 AM</option>
              <option value="06:30">6:30 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="07:30">7:30 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="08:30">8:30 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="09:30">9:30 AM</option>
              <option value="10:00">10:00 AM</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className="mt-7 w-full py-3 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        Continue <ChevronRight size={15} />
      </button>
    </div>
  );
}

// ─── STEP 2: CHOOSE PLAN ──────────────────────────────────────────────────────

interface Step2Props {
  selectedPlan: Plan;
  setSelectedPlan: (p: Plan) => void;
  onNext: () => void;
  onBack: () => void;
}

function Step2({ selectedPlan, setSelectedPlan, onNext, onBack }: Step2Props) {
  return (
    <div className="animate-slide-up">
      <div className="mb-7">
        <h2
          className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1.5"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Choose your plan
        </h2>
        <p className="text-sm text-[#555550] dark:text-[#888884]">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {PLANS.map((plan) => {
          const selected = selectedPlan === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative text-left rounded-[14px] p-4 transition-all border ${
                selected
                  ? "border-[#1a6b55] dark:border-[#2d9574] bg-[#f4faf7] dark:bg-[#1e2820] ring-2 ring-[#1a6b55]/20 dark:ring-[#2d9574]/20"
                  : "border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1c1d1b] hover:border-[#1a6b55]/40 dark:hover:border-[#2d9574]/40"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#d85a30] text-white text-[9px] font-medium whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">
                    {plan.name}
                  </p>
                  <p className="text-xs text-[#1a6b55] dark:text-[#2d9574] font-medium mt-0.5">
                    {plan.price}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                    selected
                      ? "border-[#1a6b55] dark:border-[#2d9574] bg-[#1a6b55] dark:bg-[#2d9574]"
                      : "border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  {selected && (
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-1.5">
                {plan.features.map(({ label, included }) => (
                  <li key={label} className="flex items-center gap-1.5 text-xs">
                    <span
                      className={included ? "text-[#1a6b55] dark:text-[#2d9574]" : "text-[#ccc]"}
                    >
                      {included ? "✓" : "✗"}
                    </span>
                    <span
                      className={
                        included
                          ? "text-[#555550] dark:text-[#aaa]"
                          : "text-[#ccc] dark:text-[#555] line-through"
                      }
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-7">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-sm text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] transition-all flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── STEP 3: VOICE CLONE ─────────────────────────────────────────────────────

interface Step3Props {
  seniorName: string;
  onNext: () => void;
  onBack: () => void;
}

function Step3({ seniorName, onNext, onBack }: Step3Props) {
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

  const MIN_DURATION_SECS = 120; // 2 minutes

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    setAudioRecorded(false);
    timerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    if (recordingTime >= MIN_DURATION_SECS) {
      setAudioRecorded(true);
      setAudioError("");
    } else {
      setAudioError(`Recording is too short (${formatTime(recordingTime)}). Minimum 2 minutes required.`);
    }
  }, [recordingTime]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setAudioError("");
    setAudioRecorded(false);
    // Estimate duration: ~1MB per minute for typical voice audio at 128kbps
    const estimatedSecs = (file.size / (128 * 1024 / 8));
    if (estimatedSecs < MIN_DURATION_SECS) {
      setAudioError("File appears shorter than 2 minutes. Please provide a longer recording.");
    }
    setAudioFile(file);
  };

  const canContinue = consent && (audioFile !== null || audioRecorded);

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h2
          className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1.5"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Record your voice clone
        </h2>
        <p className="text-sm text-[#555550] dark:text-[#888884] leading-relaxed">
          Your voice will make every call to{" "}
          <span className="font-medium text-[#1a6b55] dark:text-[#2d9574]">
            {seniorName || "your senior"}
          </span>{" "}
          feel warm and familiar. We need at least 2 minutes of clear speech.
        </p>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 p-4 rounded-[10px] bg-[#f4faf7] dark:bg-[#1e2820] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] cursor-pointer mb-5">
        <div
          className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${
            consent
              ? "bg-[#1a6b55] dark:bg-[#2d9574] border-[#1a6b55] dark:border-[#2d9574]"
              : "border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)]"
          }`}
          onClick={() => setConsent(!consent)}
        >
          {consent && <Check size={11} strokeWidth={3} className="text-white" />}
        </div>
        <p className="text-sm text-[#555550] dark:text-[#aaa] leading-relaxed">
          I consent to my voice being cloned for daily check-in calls with{" "}
          <span className="font-medium text-[#1a1a18] dark:text-[#f0efe9]">
            {seniorName || "my senior"}
          </span>{" "}
          only, and not used for any other purpose.
        </p>
      </label>

      {/* Two panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Upload */}
        <div>
          <p className="text-xs font-medium text-[#555550] dark:text-[#aaa] mb-2 flex items-center gap-1.5">
            <Upload size={12} /> Upload audio file
          </p>
          <div
            className={`rounded-[12px] border-2 border-dashed p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
              isDragging
                ? "border-[#1a6b55] bg-[#f4faf7] dark:bg-[#1e2820]"
                : audioFile
                ? "border-[#1a6b55] bg-[#f4faf7] dark:bg-[#1e2820]"
                : "border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] hover:border-[#1a6b55]/50 dark:hover:border-[#2d9574]/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileChange(file);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,audio/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
            {audioFile ? (
              <>
                <div className="w-10 h-10 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] flex items-center justify-center">
                  <Check size={18} className="text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9] truncate max-w-[160px]">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-[#888884] mt-0.5">
                    {formatBytes(audioFile.size)} · ~
                    {Math.floor(audioFile.size / (128 * 1024 / 8) / 60)} min
                  </p>
                </div>
                <button
                  className="text-xs text-[#d85a30] hover:underline"
                  onClick={(e) => { e.stopPropagation(); setAudioFile(null); setAudioError(""); }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] flex items-center justify-center">
                  <Mic size={18} className="text-[#1a6b55] dark:text-[#2d9574]" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#555550] dark:text-[#aaa]">
                    Drop .mp3 or .wav here
                  </p>
                  <p className="text-xs text-[#bbb] mt-0.5">or click to browse</p>
                </div>
              </>
            )}
          </div>
          {audioError && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-[#d85a30]">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              {audioError}
            </div>
          )}
        </div>

        {/* Record live */}
        <div>
          <p className="text-xs font-medium text-[#555550] dark:text-[#aaa] mb-2 flex items-center gap-1.5">
            <Mic size={12} /> Record live
          </p>
          <div className="rounded-[12px] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1c1d1b] p-6 flex flex-col items-center gap-4">
            {/* Record button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={audioRecorded && !isRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : audioRecorded
                  ? "bg-[#1a6b55] dark:bg-[#2d9574]"
                  : "bg-[#f0eff0] dark:bg-[#2a2a2a] hover:bg-[#e0dfdf] dark:hover:bg-[#333]"
              }`}
            >
              {audioRecorded ? (
                <Check size={24} className="text-white" />
              ) : isRecording ? (
                <Square size={20} className="text-white" fill="white" />
              ) : (
                <Mic size={22} className="text-[#555550] dark:text-[#aaa]" />
              )}
            </button>

            {/* Waveform when recording */}
            {isRecording && (
              <div className="flex items-end gap-1 h-6">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="waveform-bar" />
                ))}
              </div>
            )}

            {/* Timer */}
            <p
              className={`text-2xl font-mono ${
                isRecording
                  ? "text-red-500"
                  : audioRecorded
                  ? "text-[#1a6b55] dark:text-[#2d9574]"
                  : "text-[#bbb]"
              }`}
            >
              {formatTime(recordingTime)}
            </p>

            {/* Status */}
            <p className="text-xs text-[#888884] text-center">
              {isRecording
                ? "Recording… tap square to stop"
                : audioRecorded
                ? "Recording saved!"
                : "Tap mic to start recording"}
            </p>

            {/* Playback controls after recording */}
            {audioRecorded && !isRecording && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors"
                >
                  <Play size={11} /> {isPlaying ? "Pause" : "Play back"}
                </button>
                <button
                  onClick={() => { setAudioRecorded(false); setRecordingTime(0); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#d85a30] hover:bg-[#fbeee9] dark:hover:bg-[#2e1a10] transition-colors"
                >
                  <X size={11} /> Redo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Script box */}
      <div className="rounded-[10px] bg-[#f7f6f3] dark:bg-[#222321] p-4 mb-5 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <p className="text-xs font-medium text-[#555550] dark:text-[#aaa] mb-2">
          Read aloud for best results:
        </p>
        <p className="text-sm text-[#555550] dark:text-[#aaa] italic leading-relaxed">
          "Good morning! I'm just calling to check in and see how you're doing
          today. I hope you slept well and had a good breakfast. I love you and
          I'm thinking of you. Tell me, how are you feeling? Did you take your
          medicines? I'll call again tomorrow — take care of yourself."
        </p>
      </div>

      {/* Quality bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-[#555550] dark:text-[#aaa]">
            Estimated voice quality
          </p>
          <p className="text-xs font-medium text-[#1a6b55] dark:text-[#2d9574]">
            85%
          </p>
        </div>
        <div className="h-2 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#1a6b55] dark:bg-[#2d9574] transition-all"
            style={{ width: audioFile || audioRecorded ? "85%" : "0%" }}
          />
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-[#888884] mb-6 flex items-center gap-1.5">
        <Clock size={11} /> Voice clone ready in approximately 2 hours after submission.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-sm text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 py-3 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── STEP 4: VIDEO AVATAR ─────────────────────────────────────────────────────

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
}

function Step4({ onNext, onBack }: Step4Props) {
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
      if (c === 0) {
        clearInterval(countdownRef.current!);
        setCountdown(null);
        beginRecording();
      } else {
        setCountdown(c);
      }
    }, 1000);
  };

  const beginRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setVideoRecorded(true);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const canContinue = consent && (videoFile !== null || videoRecorded);

  const tips = [
    { icon: "☀️", text: "Good lighting — face a window or bright lamp" },
    { icon: "👁️", text: "Look directly into the camera lens" },
    { icon: "🗣️", text: "Speak naturally at a comfortable pace" },
    { icon: "🪟", text: "Plain, uncluttered background works best" },
  ];

  return (
    <div className="animate-slide-up">
      <div className="mb-6">
        <h2
          className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1.5"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Record your video avatar
        </h2>
        <p className="text-sm text-[#555550] dark:text-[#888884] leading-relaxed">
          Your video avatar will appear in personalised video messages sent to
          your senior. We need 1–2 minutes of clear, well-lit footage.
        </p>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 p-4 rounded-[10px] bg-[#f4faf7] dark:bg-[#1e2820] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] cursor-pointer mb-5">
        <div
          className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors ${
            consent
              ? "bg-[#1a6b55] dark:bg-[#2d9574] border-[#1a6b55] dark:border-[#2d9574]"
              : "border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.2)]"
          }`}
          onClick={() => setConsent(!consent)}
        >
          {consent && <Check size={11} strokeWidth={3} className="text-white" />}
        </div>
        <p className="text-sm text-[#555550] dark:text-[#aaa] leading-relaxed">
          I consent to my likeness being used to generate an AI video avatar for
          personalised messages to my senior only.
        </p>
      </label>

      {/* Two panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Upload video */}
        <div>
          <p className="text-xs font-medium text-[#555550] dark:text-[#aaa] mb-2 flex items-center gap-1.5">
            <Upload size={12} /> Upload video file
          </p>
          <div
            className={`rounded-[12px] border-2 border-dashed p-6 flex flex-col items-center gap-3 cursor-pointer transition-colors min-h-[160px] justify-center ${
              isDragging
                ? "border-[#1a6b55] bg-[#f4faf7] dark:bg-[#1e2820]"
                : videoFile
                ? "border-[#1a6b55] bg-[#f4faf7] dark:bg-[#1e2820]"
                : "border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] hover:border-[#1a6b55]/50 dark:hover:border-[#2d9574]/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) setVideoFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mov,video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setVideoFile(file);
              }}
            />
            {videoFile ? (
              <>
                {/* Thumbnail placeholder */}
                <div className="w-full h-24 rounded-[8px] bg-[#1a1a18] dark:bg-black flex items-center justify-center">
                  <Video size={28} className="text-[#555]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9] truncate max-w-[160px]">
                    {videoFile.name}
                  </p>
                  <p className="text-xs text-[#888884] mt-0.5">
                    {formatBytes(videoFile.size)}
                  </p>
                </div>
                <button
                  className="text-xs text-[#d85a30] hover:underline"
                  onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] flex items-center justify-center">
                  <Video size={18} className="text-[#1a6b55] dark:text-[#2d9574]" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-[#555550] dark:text-[#aaa]">
                    Drop .mp4 or .mov here
                  </p>
                  <p className="text-xs text-[#bbb] mt-0.5">or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Webcam record */}
        <div>
          <p className="text-xs font-medium text-[#555550] dark:text-[#aaa] mb-2 flex items-center gap-1.5">
            <Camera size={12} /> Record with webcam
          </p>
          <div className="rounded-[12px] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1c1d1b] p-4 flex flex-col items-center gap-4 min-h-[160px] justify-center">
            {/* Camera preview placeholder */}
            <div className="w-full h-28 rounded-[8px] bg-[#f0eff0] dark:bg-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
              {isRecording ? (
                <div className="absolute inset-0 bg-[#1a1a18] flex items-center justify-center">
                  <span className="text-green-400 text-xs">● LIVE</span>
                </div>
              ) : videoRecorded ? (
                <div className="absolute inset-0 bg-[#1a1a18] flex items-center justify-center gap-2">
                  <Check size={18} className="text-[#2d9574]" />
                  <span className="text-white text-xs">Preview ready</span>
                </div>
              ) : (
                <Camera size={28} className="text-[#ccc] dark:text-[#555]" />
              )}
              {/* Red recording dot */}
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/50 rounded-full px-2 py-0.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-[10px] font-mono">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-5xl font-bold">{countdown}</span>
                </div>
              )}
            </div>

            {/* Controls */}
            {!isRecording && !videoRecorded && countdown === null && (
              <button
                onClick={startCountdown}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-white" />
                Start recording
              </button>
            )}

            {isRecording && (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#333] text-white text-xs font-medium hover:bg-[#444] transition-colors"
              >
                <Square size={11} fill="white" /> Stop
              </button>
            )}

            {videoRecorded && (
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors">
                  <Play size={11} /> Preview
                </button>
                <button
                  onClick={() => { setVideoRecorded(false); setRecordingTime(0); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-xs text-[#d85a30] hover:bg-[#fbeee9] dark:hover:bg-[#2e1a10] transition-colors"
                >
                  <X size={11} /> Redo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-[10px] bg-[#fef3e2] dark:bg-[#2e2412] border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] p-4 mb-5">
        <p className="text-xs font-medium text-[#c47d10] dark:text-[#efb045] mb-3">
          Tips for a great avatar
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tips.map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2 text-xs text-[#555550] dark:text-[#aaa]">
              <span className="flex-shrink-0">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-[#888884] mb-6 flex items-center gap-1.5">
        <Clock size={11} /> Video avatar ready in approximately 4 hours after submission.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-sm text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 py-3 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── STEP 5: ALL SET ──────────────────────────────────────────────────────────

interface Step5Props {
  formData: FormData;
  selectedPlan: Plan;
  voiceDone: boolean;
  videoDone: boolean;
}

function Step5({ formData, selectedPlan, voiceDone, videoDone }: Step5Props) {
  const planLabel =
    PLANS.find((p) => p.id === selectedPlan)?.name ?? selectedPlan;

  const firstCall = (() => {
    if (!formData.callTime) return "Tomorrow morning";
    const [h, m] = formData.callTime.split(":").map(Number);
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(h, m, 0, 0);
    return d.toLocaleString("en-IN", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  })();

  const summaryItems = [
    {
      label: "Senior",
      value: formData.seniorName || "—",
      icon: <Phone size={14} />,
    },
    {
      label: "Plan",
      value: `${planLabel} (${PLANS.find((p) => p.id === selectedPlan)?.price ?? ""})`,
      icon: <Check size={14} />,
    },
    {
      label: "Voice clone",
      value: voiceDone ? "Submitted — ready in ~2 hrs" : "Not set up",
      icon: <Mic size={14} />,
      accent: voiceDone,
    },
    {
      label: "Video avatar",
      value: videoDone ? "Submitted — ready in ~4 hrs" : "Not set up",
      icon: <Video size={14} />,
      accent: videoDone,
    },
    {
      label: "First call",
      value: firstCall,
      icon: <Clock size={14} />,
    },
  ];

  return (
    <div className="animate-slide-up text-center">
      {/* Checkmark animation */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] flex items-center justify-center animate-slide-up">
            <Check size={28} strokeWidth={2.5} className="text-white" />
          </div>
        </div>
      </div>

      <h2
        className="text-3xl text-[#1a1a18] dark:text-[#f0efe9] mb-2"
        style={{ fontFamily: "var(--font-dm-serif)" }}
      >
        You're all set!
      </h2>
      <p className="text-sm text-[#555550] dark:text-[#888884] mb-8 max-w-sm mx-auto leading-relaxed">
        WellRing will begin calling{" "}
        <span className="font-medium text-[#1a6b55] dark:text-[#2d9574]">
          {formData.seniorName || "your senior"}
        </span>{" "}
        starting tomorrow. Here's a summary of what's set up.
      </p>

      {/* Summary card */}
      <div className="text-left bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[14px] p-5 mb-7 max-w-md mx-auto">
        <ul className="space-y-3">
          {summaryItems.map(({ label, value, icon, accent }) => (
            <li
              key={label}
              className="flex items-start gap-3 text-sm"
            >
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                  accent
                    ? "bg-[#e1f5ee] dark:bg-[#1e2820] text-[#1a6b55] dark:text-[#2d9574]"
                    : "bg-[#f7f6f3] dark:bg-[#222321] text-[#888884]"
                }`}
              >
                {icon}
              </span>
              <div>
                <p className="text-xs text-[#888884] mb-0.5">{label}</p>
                <p
                  className={`font-medium ${
                    accent
                      ? "text-[#1a6b55] dark:text-[#2d9574]"
                      : "text-[#1a1a18] dark:text-[#f0efe9]"
                  }`}
                >
                  {value}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] active:scale-95 transition-all shadow-sm"
      >
        Go to Dashboard <ChevronRight size={15} />
      </Link>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [formData, setFormData] = useState<FormData>({
    seniorName: "",
    phone: "",
    city: "",
    language: "",
    callTime: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan>("family");
  const [currentStep, setCurrentStep] = useState(0);

  // Track whether voice/video were submitted (for step 5 summary)
  const [voiceSubmitted, setVoiceSubmitted] = useState(false);
  const [videoSubmitted, setVideoSubmitted] = useState(false);

  // Compute which wizard steps to show based on plan
  const needsVoice = selectedPlan !== "basic";
  const needsVideo = selectedPlan === "family_plus" || selectedPlan === "premium";

  const stepLabels = [
    "Senior Info",
    "Choose Plan",
    ...(needsVoice ? ["Voice Clone"] : []),
    ...(needsVideo ? ["Video Avatar"] : []),
    "All Set!",
  ];

  // Map wizard step index to logical step id
  const stepIds = [
    "info",
    "plan",
    ...(needsVoice ? ["voice"] : []),
    ...(needsVideo ? ["video"] : []),
    "done",
  ];

  const currentStepId = stepIds[currentStep];

  const goNext = () => {
    if (currentStepId === "voice") setVoiceSubmitted(true);
    if (currentStepId === "video") setVideoSubmitted(true);
    setCurrentStep((s) => Math.min(s + 1, stepIds.length - 1));
  };
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // When plan changes, clamp step if steps are removed
  useEffect(() => {
    setCurrentStep((s) => Math.min(s, stepIds.length - 1));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan]);

  return (
    <div className="min-h-screen bg-[#f7f6f3] dark:bg-[#111210] flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/90 dark:bg-[#1c1d1b]/90 backdrop-blur-sm border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/landing"
            className="text-xl text-[#1a6b55] dark:text-[#2d9574]"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            WellRing
          </Link>
          <span className="text-xs text-[#888884]">
            Step {currentStep + 1} of {stepIds.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-2xl">
          {/* Stepper */}
          <Stepper steps={stepLabels} current={currentStep} />

          {/* Card */}
          <div className="bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[14px] p-6 md:p-8 shadow-card">
            {currentStepId === "info" && (
              <Step1
                formData={formData}
                setFormData={setFormData}
                onNext={goNext}
              />
            )}
            {currentStepId === "plan" && (
              <Step2
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStepId === "voice" && (
              <Step3
                seniorName={formData.seniorName}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStepId === "video" && (
              <Step4
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {currentStepId === "done" && (
              <Step5
                formData={formData}
                selectedPlan={selectedPlan}
                voiceDone={voiceSubmitted}
                videoDone={videoSubmitted}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
