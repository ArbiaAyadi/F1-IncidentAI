import('tailwindcss').Config

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mercedes': '#00D2BE',
        'ferrari': '#DC0000',
        'redbull': '#0600EF',
        'mclaren': '#FF8700',
      },
      animation: {
        'fadeInDown': 'fadeInDown 0.8s ease',
        'fadeInUp': 'fadeInUp 0.8s ease',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
