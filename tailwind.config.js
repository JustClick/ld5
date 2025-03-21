/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF0000',
          dark: '#CC0000',
          light: '#FF3333',
        },
        background: {
          DEFAULT: '#F5F5F5',
          dark: '#E5E5E5',
        }
      }
    },
  },
  plugins: [],
}