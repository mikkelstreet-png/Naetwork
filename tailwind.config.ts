import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBFBFA",       // page background, near-white
        sage: "#F3F3F1",        // alternating light section
        line: "#E6E6E3",        // hairlines / borders on light
        ink: "#0A0A0A",         // primary text, black
        muted: "#6B6B66",       // secondary text, gray
        pine: "#121212",        // dark cards / bands / primary button
        "pine-deep": "#0A0A0A", // darkest band (hero / footer)
        "pine-line": "#262626", // borders on dark
        sageText: "#ABABA6",    // muted text on dark
        amber: "#121212",       // emphasis accent on light = black
        "amber-soft": "#C7C7C2",// muted accent on dark
      },
      fontFamily: {
        display: ["Bodoni Moda", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.035em" },
      maxWidth: { wrap: "78rem", prose: "42rem" },
      borderRadius: { card: "0.375rem" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
