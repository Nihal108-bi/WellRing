import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#1a6b55",
          light: "#e1f5ee",
          dark: "#134d3d",
        },
        coral: {
          DEFAULT: "#d85a30",
          light: "#fbeee9",
        },
        success: "#1d9e75",
        warning: "#ef9f27",
        danger: "#e24b4a",
        gray: {
          text: "#555550",
        },
      },
      fontFamily: {
        heading: ["var(--font-dm-serif)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        metric: "10px",
        DEFAULT: "8px",
      },
      fontSize: {
        "h1": ["32px", { lineHeight: "1.2", fontWeight: "400" }],
        "h2": ["24px", { lineHeight: "1.3", fontWeight: "400" }],
        "h3": ["18px", { lineHeight: "1.4", fontWeight: "500" }],
        "body": ["14px", { lineHeight: "1.6" }],
        "small": ["12px", { lineHeight: "1.5" }],
        "tiny": ["11px", { lineHeight: "1.4" }],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-dot": "pulseDot 1.5s ease-in-out infinite",
        "waveform": "waveform 0.8s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        waveform: {
          "0%": { height: "4px" },
          "100%": { height: "20px" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
