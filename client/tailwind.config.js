const brandAccentScale = {
  50: '#FFF9F2',
  100: '#FFF3CC',
  200: '#FFE7A3',
  300: '#FFD36B',
  400: '#FFB900',
  500: '#F45B0B',
  600: '#D94308',
  700: '#D94308',
  800: '#B93608',
  900: '#8F2B08'
};

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
          DEFAULT: '#171717',
          dark: '#101010',
          light: '#262626'
        },
        brandRed: {
          DEFAULT: '#F45B0B',
          hover: '#D94308',
          light: '#FFF3CC'
        },
        accentOrange: {
          DEFAULT: '#F45B0B',
          hover: '#D94308',
          light: '#FFF3CC'
        },
        accentYellow: {
          DEFAULT: '#FFB900',
          dark: '#D94308',
          light: '#FFF3CC'
        },
        luxury: {
          black: '#171717',
          dark: '#171717',
          card: '#262626',
          surface: '#262626',
          border: '#3A3028',
          gray: '#FFF9F2',
          lightBorder: '#F0E7DC',
          gold: '#FFB900'
        },
        charcoal: '#171717',
        muted: '#777777',
        // Fallback backward-compatible aliases
        orange: {
          DEFAULT: '#F45B0B',
          50: '#FFF9F2',
          100: '#FFF3CC',
          200: '#FFE7A3',
          300: '#FFD36B',
          400: '#FFB900',
          500: '#F45B0B',
          600: '#D94308',
          700: '#D94308',
          800: '#B93608',
          900: '#8F2B08',
          glow: '#FFB900'
        },
        red: {
          DEFAULT: '#D94308',
          50: '#FFF9F2',
          100: '#FFF3CC',
          200: '#FFE7A3',
          300: '#FFD36B',
          400: '#FFB900',
          500: '#F45B0B',
          600: '#D94308',
          700: '#D94308',
          800: '#B93608',
          900: '#8F2B08'
        },
        amber: {
          50: '#FFF9F2',
          100: '#FFF3CC',
          200: '#FFE7A3',
          300: '#FFD36B',
          400: '#FFB900',
          500: '#FFB900',
          600: '#D94308',
          700: '#D94308',
          800: '#B93608',
          900: '#8F2B08'
        },
        green: brandAccentScale,
        emerald: brandAccentScale,
        teal: brandAccentScale,
        cyan: brandAccentScale,
        sky: brandAccentScale,
        blue: brandAccentScale,
        indigo: brandAccentScale,
        violet: brandAccentScale,
        purple: brandAccentScale,
        pink: brandAccentScale,
        rose: brandAccentScale,
        yellow: brandAccentScale,
        navy: {
          DEFAULT: '#171717',
          surface: '#171717',
          card: '#262626',
          dark: '#101010',
          light: '#302820',
          border: '#49392D'
        },
        surface: {
          DEFAULT: '#171717',
          card: '#262626',
          light: '#302820',
          dark: '#101010'
        },
        softWhite: '#FFFFFF'
      },
      maxWidth: {
        '7xl': '82.5rem'
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['0.9375rem', { lineHeight: '1.5rem' }]
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-orange': '0 0 25px -4px rgba(244, 91, 11, 0.4)',
        'glow-red': '0 0 25px -4px rgba(244, 91, 11, 0.4)',
        'glow-orange-lg': '0 0 45px -4px rgba(244, 91, 11, 0.5)',
        'glass': '0 12px 35px 0 rgba(0, 0, 0, 0.4)',
        'card-soft': '0 8px 30px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.25)'
      },
      backdropBlur: {
        glass: '20px'
      }
    },
  },
  plugins: [],
}
