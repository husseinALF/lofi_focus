/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          bg: '#2d3e30',
          primary: '#4a6741',
          accent: '#8fbc8f',
        },
        cafe: {
          bg: '#3e2d20',
          primary: '#8b4513',
          accent: '#d2691e',
        },
        bedroom: {
          bg: '#1a1a2e',
          primary: '#16213e',
          accent: '#0f3460',
        },
      },
    },
  },
  plugins: [],
}
