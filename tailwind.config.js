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
        poddy: {
          bg: '#080808',
          surface: '#121212',
          'surface-hover': '#1A1A1A',
          border: '#222222',
          accent: '#7C3AED',
          'accent-soft': '#2A1A4A',
          'text-primary': '#EEEEEE',
          'text-secondary': '#888888',
          'text-muted': '#555555',
        },
      },
    },
  },
  plugins: [],
};
