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
        // Single source of truth is src/styles/theme.css: every token reads the
        // bare RGB channels stored there, so `bg-surface/60` still composes an
        // alpha and a `data-theme` swap repaints the whole site for free.
        bg: "rgb(var(--rgb-bg) / <alpha-value>)",
        surface: "rgb(var(--rgb-surface) / <alpha-value>)",
        "surface-hover": "rgb(var(--rgb-surface-hover) / <alpha-value>)",
        border: "rgb(var(--rgb-border) / <alpha-value>)",
        "border-strong": "rgb(var(--rgb-border-strong) / <alpha-value>)",

        // Text colors
        "text-primary": "rgb(var(--rgb-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--rgb-text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--rgb-text-muted) / <alpha-value>)",

        // Accent colors
        "accent-blue": "rgb(var(--rgb-accent-blue) / <alpha-value>)",
        "accent-orange": "rgb(var(--rgb-accent-orange) / <alpha-value>)",
        "accent-green": "rgb(var(--rgb-accent-green) / <alpha-value>)",
        "accent-purple": "rgb(var(--rgb-accent-purple) / <alpha-value>)",

        // Platform accent colors
        github: "rgb(var(--rgb-github) / <alpha-value>)",
        "github-dim": "rgb(var(--rgb-github-dim) / <alpha-value>)",
        "github-bg": "rgb(var(--rgb-github-bg) / <alpha-value>)",
        "github-border": "rgb(var(--rgb-github-border) / <alpha-value>)",

        spotify: "rgb(var(--rgb-spotify) / <alpha-value>)",
        "spotify-dim": "rgb(var(--rgb-spotify-dim) / <alpha-value>)",
        "spotify-bg": "rgb(var(--rgb-spotify-bg) / <alpha-value>)",
        "spotify-border": "rgb(var(--rgb-spotify-border) / <alpha-value>)",

        leetcode: "rgb(var(--rgb-leetcode) / <alpha-value>)",
        "leetcode-dim": "rgb(var(--rgb-leetcode-dim) / <alpha-value>)",
        "leetcode-bg": "rgb(var(--rgb-leetcode-bg) / <alpha-value>)",
        "leetcode-border": "rgb(var(--rgb-leetcode-border) / <alpha-value>)",

        // Callout backgrounds
        "info-bg": "rgb(var(--rgb-info-bg) / <alpha-value>)",
        "info-border": "rgb(var(--rgb-info-border) / <alpha-value>)",
        "warning-bg": "rgb(var(--rgb-warning-bg) / <alpha-value>)",
        "warning-border": "rgb(var(--rgb-warning-border) / <alpha-value>)",
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
