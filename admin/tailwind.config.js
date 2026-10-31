/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#101010',
          dark: '#080808',
          light: '#1A1A1A'
        },
        brandRed: {
          DEFAULT: '#D92332',
          hover: '#C01A28',
          light: '#FDECEE'
        },
        accentOrange: {
          DEFAULT: '#FF6B35',
          hover: '#E85822',
          light: '#FFF0EA'
        },
        luxury: {
          black: '#101010',
          dark: '#161616',
          card: '#1E1E1E',
          surface: '#1A1A1A',
          border: '#2E2E2E',
          gray: '#F7F7F7',
          lightBorder: '#E5E7EB',
          gold: '#D4AF37'
        },
        charcoal: '#242424',
        muted: '#777777',
        // Fallback backward-compatible aliases
        orange: {
          DEFAULT: '#FF6B35',
          50: '#FFF5F0',
          100: '#FFE6DC',
          200: '#FFCEB9',
          300: '#FFAF8F',
          400: '#FF8D65',
          500: '#FF6B35',
          600: '#E85822',
          700: '#C74112',
          800: '#A4320C',
          900: '#842609',
          glow: '#FFAF8F'
        },
        red: {
          DEFAULT: '#D92332',
          50: '#FDECEE',
          100: '#FBD4D8',
          200: '#F8ADB4',
          300: '#F37D89',
          400: '#ED4E5F',
          500: '#D92332',
          600: '#C01A28',
          700: '#9E121E',
          800: '#7E111A',
          900: '#5F0C13'
        },
        navy: {
          DEFAULT: '#101010',
          surface: '#161616',
          card: '#1E1E1E',
          dark: '#0A0A0A',
          light: '#242424',
          border: '#2E2E2E'
        },
        surface: {
          DEFAULT: '#101010',
          card: '#181818',
          light: '#222222',
          dark: '#0A0A0A'
        },
        softWhite: '#FFFFFF'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-orange': '0 0 25px -4px rgba(255, 107, 53, 0.4)',
        'glow-red': '0 0 25px -4px rgba(217, 35, 50, 0.4)',
        'glow-orange-lg': '0 0 45px -4px rgba(255, 107, 53, 0.55)',
        'glass': '0 12px 35px 0 rgba(0, 0, 0, 0.4)',
        'card-soft': '0 8px 30px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
