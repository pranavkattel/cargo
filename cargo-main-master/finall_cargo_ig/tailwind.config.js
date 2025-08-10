/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-white': '#FFFFFF',
        'primary-blue': '#0096C7',
        'accent-orange': '#F9B222',
        'accent-orange-hover': '#e6a01e',
      },
      backgroundColor: {
        'primary-white': '#FFFFFF',
        'primary-blue': '#0096C7',
        'accent-orange': '#F9B222',
      },
      textColor: {
        'primary-blue': '#0096C7',
        'accent-orange': '#F9B222',
      },
      borderColor: {
        'accent-orange': '#F9B222',
      },
      ringColor: {
        'accent-orange': '#F9B222',
      },
    },
  },
  plugins: [],
}