import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12151A",       // near-black background
        paper: "#F7F6F3",     // panels / cards
        line: "#23262D",      // hairline borders on dark
        signal: "#4F7CFF",    // primary accent — "cold lead → signal detected" blue
        ember: "#FF6A3D",     // hot-prospect accent (high score)
        muted: "#8A8F98",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
