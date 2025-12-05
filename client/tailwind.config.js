/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- IMPORTANT: Enables manual toggling
  theme: {
    extend: {},
  },
  plugins: [],
}