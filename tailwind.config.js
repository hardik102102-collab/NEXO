/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b', // Very dark grey, almost black
        surface: '#18181b',    // Slightly lighter
        surfaceHighlight: '#27272a',
        border: '#27272a',
        primary: '#e4e4e7',    // Light grey text
        secondary: '#a1a1aa',  // Muted grey text
        accent: '#52525b',     // Accent grey
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
