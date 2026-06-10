import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy (keep for compat)
        paper: "#FBFBFA",
        sage: "#F3F3F1",
        line: "#E6E6E3",
        ink: "#0A0A0A",
        muted: "#6B6B66",
        pine: "#121212",
        "pine-deep": "#050810",
        "pine-line": "#1a1f2e",
        sageText: "#8892a4",
        amber: "#3B82F6",
        "amber-soft": "#60a5fa",
        // New premium palette
        navy: {
          950: "#020408",
          900: "#050810",
          800: "#0a0e1a",
          700: "#0f1525",
          600: "#151c2e",
          500: "#1a2338",
        },
        blue: {
          400: "#60a5fa",
          500: "#3B82F6",
          600: "#2563EB",
        },
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
        tight: "-0.02em",
      },
      maxWidth: { wrap: "78rem", prose: "44rem" },
      borderRadius: { card: "0.75rem", xl: "1rem", "2xl": "1.25rem" },
      backgroundImage: {
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.25) 0%, transparent 70%)",
        "blue-glow": "radial-gradient(circle at center, rgba(59,130,246,0.4) 0%, transparent 70%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "border-gradient": "linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(99,102,241,0.5) 100%)",
        "text-gradient": "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #a78bfa 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-left": {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        "border-spin": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        "scale-up": "scale-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-left": "slide-left 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-right": "slide-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "border-spin": "border-spin 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
