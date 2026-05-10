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
        base: "#0D0C0A",
        surface: "#1C1A16",
        "surface-2": "#252320",
        rim: "#2E2C28",
        gold: "#F4A535",
        "gold-dim": "#1E1A08",
        cream: "#F2EDE6",
        "cream-dim": "#9A9288",
        "cream-faint": "#6A6258",
      },
    },
  },
  plugins: [],
};
