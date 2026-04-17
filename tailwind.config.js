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
          50: '#fef7fb',
          100: '#fdeef6',
          200: '#faddec',
          300: '#f6c9dd',
          400: '#f0a3c2',
          500: '#E02787',
          600: '#c92279',
          700: '#b11d6b',
          800: '#99185d',
          900: '#81134f',
        },
        secondary: {
          50: '#f7fef7',
          100: '#f0fdf0',
          200: '#e4fbe4',
          300: '#d1f8d1',
          400: '#aef4ae',
          500: '#08CC0A',
          600: '#07b809',
          700: '#06a408',
          800: '#059007',
          900: '#047c06',
        },
        black: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#cccccc',
          400: '#999999',
          500: '#666666',
          600: '#4d4d4d',
          700: '#333333',
          800: '#1a1a1a',
          900: '#000000',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
