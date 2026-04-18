/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(129, 140, 248, 0.45)',
        card: '0 20px 45px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 10% 20%, rgba(147, 51, 234, 0.45), transparent 42%), radial-gradient(circle at 90% 0%, rgba(37, 99, 235, 0.5), transparent 40%), linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e1b4b 100%)',
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(129, 140, 248, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
