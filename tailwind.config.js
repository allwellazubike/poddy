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
          bg: '#F6F6F9',
          surface: '#FFFFFF',
          'surface-hover': '#F0F0F4',
          border: '#E4E4E9',
          accent: '#0D9488',
          'accent-soft': '#CCFBF1',
          'text-primary': '#1A1A2E',
          'text-secondary': '#6B7280',
          'text-muted': '#9CA3AF',
        },
      },
    },
  },
  plugins: [],
};
