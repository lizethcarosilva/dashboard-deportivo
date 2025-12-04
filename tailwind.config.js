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
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        sport: {
          soccer: '#10b981',
          basketball: '#f59e0b',
          tennis: '#ef4444',
          swimming: '#0ea5e9',
          athletics: '#8b5cf6',
        }
      }
    },
  },
  plugins: [],
}

