/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(129, 140, 248, 0.45)',
        'glow-emerald': '0 0 35px rgba(16, 185, 129, 0.35)',
        card: '0 25px 60px rgba(2, 6, 23, 0.5)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.45), transparent 42%), radial-gradient(circle at 90% 0%, rgba(37, 99, 235, 0.45), transparent 40%), radial-gradient(circle at 50% 100%, rgba(6, 182, 212, 0.18), transparent 45%), linear-gradient(140deg, #020617 0%, #111827 45%, #1e1b4b 100%)',
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        fadeSlide: 'fadeSlide 0.45s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(129, 140, 248, 0.6)' },
        },
        fadeSlide: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}