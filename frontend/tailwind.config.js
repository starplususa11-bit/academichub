/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          dark: '#1E40AF'
        },
        secondary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#EEF2FF'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
          card: '#FFFFFF',
          subtle: '#F8FAFC'
        },
        academic: {
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
