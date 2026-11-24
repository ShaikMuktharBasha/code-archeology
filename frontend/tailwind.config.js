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
        charcoal: {
          950: '#06070a',
          900: '#090a0f',
          850: '#0d0f17',
          800: '#121520',
          750: '#171b29',
          700: '#1d2334',
          600: '#2b334a',
        },
        border: {
          subtle: '#1b2030',
          focus: '#2e3752',
          highlight: '#3b4566',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'glow': '0 0 25px -5px rgba(99, 102, 241, 0.15)',
      }
    },
  },
  plugins: [],
};
