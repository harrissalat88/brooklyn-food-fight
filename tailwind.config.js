/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fight-red': '#C41E3A',
        'iron-black': '#2C2C2C',
        'herb-green': '#52B788',
        'warm-white': '#FAFAF8',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'Impact', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'punch': 'punch 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        punch: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(-5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}