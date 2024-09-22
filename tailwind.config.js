// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [  "Clash Grotesk",  "Inter var", "system-ui"],
      },
    },
  },
  plugins: [],
};
