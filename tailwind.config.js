/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5D33F6',
          50: '#F2EEFF',
          100: '#E4DDFF',
          200: '#C9BAFF',
          300: '#AD97FF',
          400: '#9275FF',
          500: '#7752FF',
          600: '#5D33F6',
          700: '#4924D9',
          800: '#3619B3',
          900: '#28128C',
        },
        accent: {
          DEFAULT: '#19CB7D',
          50: '#E7F9F1',
          100: '#D0F3E3',
          200: '#A1E8C7',
          300: '#73DCAB',
          400: '#44D08F',
          500: '#19CB7D',
          600: '#16B36F',
          700: '#129A5F',
          800: '#0F824F',
          900: '#0C693F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};