/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
      colors: {
        poddy: {
          bg: "#F5F5F5",
          card: "#FFFFFF",
          border: "#E0E0E0",
          text: "#111111",
          muted: "#888888",
          accent: "#1A1A1A",
          // legacy aliases
          surface: "#FFFFFF",
          "surface-hover": "#F0F0F0",
          "surface-low": "#F5F5F5",
          "accent-soft": "#EFEFEF",
          "text-primary": "#111111",
          "text-secondary": "#888888",
          "text-muted": "#AAAAAA",
        },
      },
    },
  },
  plugins: [],
};
