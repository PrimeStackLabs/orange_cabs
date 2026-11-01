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
          DEFAULT: '#C2410C',
          hover: '#9A3412',
          light: '#FFF7ED'
        },
        accentOrange: {
          DEFAULT: '#C2410C',
          hover: '#9A3412',
          light: '#FFF7ED'
        },
        accentYellow: {
          DEFAULT: '#FBBF24',
          dark: '#A16207',
          light: '#FEF3C7'
        },
        luxury: {
          black: '#101010',
          dark: '#161616',
          card: '#1E1E1E',
          surface: '#1A1A1A',
          border: '#2E2E2E',
          gray: '#F7F7F7',
          lightBorder: '#E5E7EB',
          gold: '#FBBF24'
        },
        charcoal: '#242424',
        muted: '#777777',
        // Fallback backward-compatible aliases
        orange: {
          DEFAULT: '#C2410C',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          glow: '#FBBF24'
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
        'glow-orange': '0 0 25px -4px rgba(194, 65, 12, 0.4)',
        'glow-red': '0 0 25px -4px rgba(194, 65, 12, 0.4)',
        'glow-orange-lg': '0 0 45px -4px rgba(194, 65, 12, 0.55)',
        'glass': '0 12px 35px 0 rgba(0, 0, 0, 0.4)',
        'card-soft': '0 8px 30px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
