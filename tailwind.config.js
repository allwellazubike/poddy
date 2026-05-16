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
      fontFamily: {
        sans: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
        extrabold: ['Inter_800ExtraBold'],
        black: ['Inter_900Black'],
      },
      colors: {
        poddy: {
          bg: '#000000',
          surface: '#121212',
          'surface-hover': '#18181B',
          'surface-low': '#09090B',
          border: '#27272A',
          accent: '#FFFFFF',
          'accent-dark': '#A1A1AA',
          'accent-soft': '#27272A',
          'text-primary': '#FFFFFF',
          'text-secondary': '#A1A1AA',
          'text-muted': '#52525B',
        },
      },
    },
  },
  plugins: [],
};
