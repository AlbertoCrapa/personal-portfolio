/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "DM Sans", "sans-serif"],
      },
      colors: {
        // Base colors — Radix Colors "gray" dark, steps 1 / 3 / 4 / 5.
        // Keep in sync with src/styles/theme.css.
        bg: "#111111",
        surface: "#222222",
        "surface-hover": "#2a2a2a",
        border: "#313131",

        // Text colors
        "text-primary": "#ffffff",
        "text-secondary": "#a0a0a0",
        "text-muted": "#6b6b6b",

        // Accent colors
        "accent-blue": "#4285f4",
        "accent-orange": "#ff9800",
        "accent-green": "#4caf50",
        "accent-purple": "#9b84e7",

        // Platform accent colors
        github: "#b39af8",
        "github-dim": "#9176d4",
        "github-bg": "#161124",
        "github-border": "#33245f",

        spotify: "#1db954",
        "spotify-dim": "#57d984",
        "spotify-bg": "#081f11",
        "spotify-border": "#1f5432",

        leetcode: "#ffa116",
        "leetcode-dim": "#ffcf87",
        "leetcode-bg": "#251c0d",
        "leetcode-border": "#4f3a15",

        // Callout backgrounds
        "info-bg": "#142f53",
        "info-border": "#4285f4",
        "warning-bg": "#332400",
        "warning-border": "#ff9800",
      },
      spacing: {
        sidebar: "320px",
        "sidebar-max": "400px",
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["2rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "1.1" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      maxWidth: {
        content: "900px",
        sidebar: "400px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
