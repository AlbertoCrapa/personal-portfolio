/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Clash Grotesk", "Inter var", "system-ui"],
        crazy: ["MiniMochi", "Inter var", "system-ui"],
        script: ["Kalam", "Inter var", "system-ui"]
      },
      colors: {
        primary: {
          DEFAULT: "#1E40AF", // Default primary color
          light: "#3B82F6",   // Lighter shade
          dark: "#1E3A8A",    // Darker shade
        },
        secondary: {
          DEFAULT: "#9333EA",
          light: "#C084FC",
          dark: "#7E22CE",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FCD34D",
          dark: "#B45309",
        },
        neutral: {
          light: "#F3F4F6",
          DEFAULT: "#D1D5DB",
          dark: "#6B7280",
        },
      },
      animation: {
        squiggly: 'squiggly-anim .34s linear infinite;',
      },
    },
  },
  plugins: [],
};
