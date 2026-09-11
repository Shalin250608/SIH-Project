/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f2942',
          blue: '#1a56db',
          light: '#f0f5ff',
          saffron: '#ff9933',
          green: '#138808',
          gold: '#d97706',
        }
      }
    },
  },
  plugins: [],
}