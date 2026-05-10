/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f4c81',
        'primary-dark': '#0a3560',
        'primary-light': '#1a6bb5',
        secondary: '#e8f4fd',
        accent: '#00b4d8',
        'accent-dark': '#0096b7',
        success: '#2ecc71',
        'warm-white': '#fafbff',
        'text-primary': '#1a2744',
        'text-secondary': '#5a6a85',
        'emergency-red': '#e74c3c',
        'border-light': '#d4e6f5',
      },
      fontFamily: {
        merriweather: ['Merriweather', 'Georgia', 'serif'],
        sourcesans: ['"Source Sans Pro"', 'sans-serif'],
        dmsans: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(15, 76, 129, 0.08)',
        'card-hover': '0 8px 40px rgba(15, 76, 129, 0.16)',
        nav: '0 2px 0 #0f4c81',
      },
      backgroundImage: {
        'medical-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f4c81' fill-opacity='0.03'%3E%3Cpath d='M26 0h8v12h12v8H34v12h-8V20H14v-8h12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delay': 'float 3s ease-in-out 1s infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
