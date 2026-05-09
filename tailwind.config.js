/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./(tabs)/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        "ink-soft": "#1a1a1a",
        "ink-muted": "#3d3d3d",
        paper: "#ffffff",
        "paper-soft": "#f5f5f5",
        "paper-mid": "#e8e8e8",
        "paper-dark": "#d0d0d0",
        "text-dim": "#8a8a8a",
        "text-faint": "#b0b0b0",
      },
    },
  },
  plugins: [],
};
