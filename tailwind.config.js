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
        dark: {
          base: '#0B0D0F',
          card: '#121518',
          elevated: '#181C22',
          surface: '#1F242D',
          border: '#2A313D',
          muted: '#8E9AA8',
        },
        lime: {
          300: '#E2FF4D',
          400: '#D4FF00',
          500: '#CCFF00',
          600: '#A8D900',
          700: '#85AB00',
        },
        cyan: {
          400: '#22D3EE',
          500: '#00E5FF',
        },
        coral: {
          500: '#FF4D4D',
          600: '#E03636',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'lime-glow': '0 0 25px -5px rgba(204, 255, 0, 0.25)',
        'lime-sm': '0 0 12px -2px rgba(204, 255, 0, 0.3)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
