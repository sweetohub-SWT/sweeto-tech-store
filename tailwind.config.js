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
          50: 'rgba(var(--primary-rgb), 0.05)',
          100: 'rgba(var(--primary-rgb), 0.1)',
          200: 'rgba(var(--primary-rgb), 0.2)',
          300: 'rgba(var(--primary-rgb), 0.3)',
          400: 'rgba(var(--primary-rgb), 0.4)',
          500: 'var(--primary-color)',
          600: 'var(--primary-color)',
          700: 'var(--primary-color)',
          800: 'rgba(var(--primary-rgb), 0.8)',
          900: 'rgba(var(--primary-rgb), 0.9)',
          950: 'rgba(var(--primary-rgb), 0.95)',
        },
        slate: {
          800: '#121212',
          900: '#0a0a0a',
          950: '#000000',
        },
        gray: {
          800: '#121212',
          900: '#0a0a0a',
          950: '#000000',
        }

      }
    },
  },
  plugins: [],
}
