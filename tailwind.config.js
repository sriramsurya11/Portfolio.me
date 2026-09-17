/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080808",
        surface: "#101012",
        "surface-border": "#222226",
        accent: "var(--accent-color, #ff3366)",
        "accent-secondary": "var(--accent-secondary, #ff6b8b)",
        "accent-glow": "var(--accent-glow, rgba(255, 51, 102, 0.35))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { filter: "drop-shadow(0 0 8px var(--accent-glow))" },
          "100%": { filter: "drop-shadow(0 0 20px var(--accent-glow))" },
        },
      },
    },
  },
  plugins: [],
};
