"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Moon, Sun, AlertCircle } from "lucide-react";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const valid =
    email.trim().includes("@") &&
    password.length >= 6 &&
    (mode === "login" || name.trim().length >= 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setError("");
    setLoading(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      setLoading(false);
      if (mode === "login" && password === "wrong") {
        setError("Invalid email or password. Please try again.");
      } else {
        window.location.href = "/dashboard";
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] dark:bg-[#111210] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href="/landing"
          className="text-2xl text-[#1a6b55] dark:text-[#2d9574]"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          WellRing
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-[#e1f5ee] dark:hover:bg-[#1e2820] transition-colors text-[#555550] dark:text-[#aaa]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        )}
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-[#1c1d1b] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[14px] p-7 shadow-card">
            {/* Heading */}
            <div className="mb-7 text-center">
              <h1
                className="text-2xl text-[#1a1a18] dark:text-[#f0efe9] mb-1"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-[#888884]">
                {mode === "login"
                  ? "Sign in to see your senior's daily updates."
                  : "Set up WellRing in under 5 minutes."}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-full bg-[#f7f6f3] dark:bg-[#222321] p-1 mb-6">
              {(["login", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-2 rounded-full text-xs font-medium transition-all ${
                    mode === m
                      ? "bg-white dark:bg-[#1c1d1b] text-[#1a1a18] dark:text-[#f0efe9] shadow-card"
                      : "text-[#888884] hover:text-[#555550] dark:hover:text-[#aaa]"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (signup only) */}
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#222321] text-sm text-[#1a1a18] dark:text-[#f0efe9] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#222321] text-sm text-[#1a1a18] dark:text-[#f0efe9] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#555550] dark:text-[#aaa]">
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs text-[#1a6b55] dark:text-[#2d9574] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "login" ? "Your password" : "Min. 6 characters"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 rounded-[10px] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#222321] text-sm text-[#1a1a18] dark:text-[#f0efe9] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a6b55]/30 dark:focus:ring-[#2d9574]/30 transition"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555550] dark:hover:text-[#ddd] transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-xs text-[#e24b4a] bg-[#fdeaea] dark:bg-[#2e1414] px-3 py-2.5 rounded-[8px]">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!valid || loading}
                className="w-full py-3 rounded-full bg-[#1a6b55] text-white text-sm font-medium hover:bg-[#134d3d] disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1"
              >
                {loading
                  ? "Please wait…"
                  : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)]" />
              <span className="text-xs text-[#aaa]">or</span>
              <div className="flex-1 h-px bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)]" />
            </div>

            {/* Google SSO placeholder */}
            <button
              type="button"
              className="w-full py-2.5 rounded-full border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] text-sm text-[#555550] dark:text-[#aaa] hover:bg-[#f7f6f3] dark:hover:bg-[#222321] transition-colors flex items-center justify-center gap-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Fine print */}
            {mode === "signup" && (
              <p className="mt-5 text-xs text-[#aaa] text-center leading-relaxed">
                By creating an account you agree to our{" "}
                <a href="#" className="text-[#1a6b55] dark:text-[#2d9574] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#1a6b55] dark:text-[#2d9574] hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            )}
          </div>

          {/* Switch mode link */}
          <p className="text-center text-sm text-[#888884] mt-5">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="text-[#1a6b55] dark:text-[#2d9574] font-medium hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
