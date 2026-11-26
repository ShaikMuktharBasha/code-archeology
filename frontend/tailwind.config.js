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
          950: '#040508',
          900: '#07080d',
          850: '#0b0d15',
          800: '#10131e',
          750: '#161a28',
          700: '#1e2436',
          600: '#2d3650',
        },
        border: {
          subtle: '#1a2032',
          focus: '#2e3856',
          highlight: '#43517a',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        cyber: {
          cyan: '#22d3ee',
          blue: '#38bdf8',
          indigo: '#818cf8',
          violet: '#a78bfa',
          emerald: '#34d399',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.6)',
        'panel': '0 10px 35px -5px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'glow': '0 0 28px -4px rgba(99, 102, 241, 0.28)',
        'glow-cyan': '0 0 25px -4px rgba(34, 211, 238, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
};
