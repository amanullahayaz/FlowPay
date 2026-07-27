/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0a0d14',
          card: '#121824',
          accent: '#3b82f6',
          emerald: '#10b981',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          gold: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
