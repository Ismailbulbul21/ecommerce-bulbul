/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-candy': 'linear-gradient(113.3deg, rgb(134, 209, 228) -1.8%, rgb(255, 181, 255) 86.4%)',
        'gradient-royal': 'linear-gradient(to right, #141e30, #243b55)',
        'gradient-cosmic': 'linear-gradient(to right, #00b4db, #0083b0)',
        'gradient-sunset': 'linear-gradient(to right, #ff512f, #dd2476)',
        'gradient-mojave': 'linear-gradient(to right, #1a2a6c, #b21f1f, #fdbb2d)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}