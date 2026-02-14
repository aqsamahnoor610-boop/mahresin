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
          dark: '#0F4A3A',
          deeper: '#0B3F33',
        },
        card: '#0E3B34',
        accent: {
          yellow: '#F4B400',
          gold: '#C89B0E',
          teal: '#1E7F5C',
        },
        text: {
          light: '#D1FAE5',
          muted: '#9CA3AF',
        }
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(to right, #0F4A3A, #0B3F33)',
        'gradient-button': 'linear-gradient(to right, #C89B0E, #1E7F5C)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(244, 180, 0, 0.3)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
