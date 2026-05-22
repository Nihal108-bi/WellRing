"use client";

import React, { useState } from "react";
import { Phone, Globe, Clock, MapPin, Mic, Video, Check } from "lucide-react";

const S = {
  name: "Meera Nair", initials: "MN", phone: "+91 98765 43210",
  city: "Chennai", language: "Tamil", callTime: "7:30 AM", plan: "Family",
  voiceClone: { active: true, by: "Rohan Nair", date: "9 May 2025" },
  videoAvatar: { active: false },
  personality: [
    { label: "Likes talking about", value: "Family, cooking, her garden, Tamil serials" },
    { label: "Avoid mentioning",    value: "News headlines, financial matters, health anxieties" },
    { label: "Best time to engage", value: "Bright and chatty before 9 AM" },
    { label: "Known concerns",      value: "Mild knee arthritis, occasional loneliness on weekends" },
  ],
  timeline: [
    { date: "Today",         event: "14-day streak milestone reached" },
    { date: "9 May 2025",    event: "Voice clone activated" },
    { date: "9 May 2025",    event: "Onboarding completed — Family plan" },
    { date: "7 May 2025",    event: "Account created" },
  ],
};

export default function ProfilePage() {
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState("Meera loves hearing about the grandchildren. Always ask about her garden — she's growing tomatoes this season.");

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1" style={{ fontFamily: "var(--font-dm-serif)" }}>Senior Profile</h1>
        <p className="text-sm text-[#888884]">Everything WellRing knows about Meera.</p>
      </div>

      {/* Identity */}
      <div className="card-base flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#1a6b55] dark:bg-[#2d9574] flex items-center justify-center text-white text-xl shrink-0" style={{ fontFamily: "var(--font-dm-serif)" }}>
          {S.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h2 className="text-xl text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>{S.name}</h2>
            <span className="px-2.5 py-1 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] text-xs text-[#1a6b55] dark:text-[#2d9574] font-medium shrink-0">{S.plan}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Phone size={12} />, value: S.phone },
              { icon: <MapPin size={12} />, value: S.city },
              { icon: <Globe size={12} />, value: S.language },
              { icon: <Clock size={12} />, value: `Calls at ${S.callTime}` },
            ].map(({ icon, value }) => (
              <div key={value} className="flex items-center gap-1.5 text-xs text-[#555550] dark:text-[#aaa]">
                <span className="text-[#1a6b55] dark:text-[#2d9574] shrink-0">{icon}</span>{value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personality notes */}
      <div className="card-base">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9]" style={{ fontFamily: "var(--font-dm-serif)" }}>Personality notes</h2>
          <button onClick={() => setEditNotes(!editNotes)} className="text-xs text-[#1a6b55] dark:text-[#2d9574] hover:underline">
            {editNotes ? "Save" : "Edit"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {S.personality.map(({ label, value }) => (
            <div key={label} className="p-3 rounded-[10px] bg-[#f7f6f3] dark:bg-[#222321]">
              <p className="text-[11px] text-[#888884] mb-1">{label}</p>
              <p className="text-xs text-[#555550] dark:text-[#aaa]">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#888884] mb-1.5">Additional family notes</p>
        {editNotes
          ? <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#222321] text-sm text-[#1a1a18] dark:text-[#f0efe9] resize-none focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30" />
          : <p className="text-sm text-[#555550] dark:text-[#aaa] leading-relaxed">{notes}</p>
        }
      </div>

      {/* Voice + Video */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-base">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] flex items-center justify-center text-[#1a6b55] dark:text-[#2d9574]"><Mic size={16} /></div>
            <div>
              <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">Voice clone</p>
              <p className="text-xs text-[#1a6b55] dark:text-[#2d9574] flex items-center gap-1"><Check size={10} /> Active</p>
            </div>
          </div>
          <p className="text-xs text-[#888884]">Recorded by <span className="text-[#555550] dark:text-[#aaa]">{S.voiceClone.by}</span> · {S.voiceClone.date}</p>
          <button className="mt-3 text-xs text-[#d85a30] hover:underline">Re-record voice</button>
        </div>
        <div className="card-base">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-[#f0eff0] dark:bg-[#2a2a2a] flex items-center justify-center text-[#aaa]"><Video size={16} /></div>
            <div>
              <p className="text-sm font-medium text-[#1a1a18] dark:text-[#f0efe9]">Video avatar</p>
              <p className="text-xs text-[#aaa]">Not set up</p>
            </div>
          </div>
          <p className="text-xs text-[#888884]">Available on Family+ and Premium plans.</p>
          <button className="mt-3 text-xs text-[#1a6b55] dark:text-[#2d9574] hover:underline">Upgrade to enable</button>
        </div>
      </div>

      {/* Timeline */}
      <div className="card-base">
        <h2 className="text-base text-[#1a1a18] dark:text-[#f0efe9] mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Timeline</h2>
        <ol className="relative border-l border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] space-y-4 pl-5">
          {S.timeline.map(({ date, event }, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#e1f5ee] dark:bg-[#1e2820] border-2 border-[#1a6b55] dark:border-[#2d9574]" />
              <p className="text-[11px] text-[#888884]">{date}</p>
              <p className="text-sm text-[#555550] dark:text-[#aaa]">{event}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
