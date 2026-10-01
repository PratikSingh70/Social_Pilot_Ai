/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090D',
        'bg-2': '#101116',
        card: '#151720',
        'card-hover': '#171a24',
        border: '#252936',
        accent: { DEFAULT: '#8B5CF6', 2: '#6366F1' },
        cyan: { DEFAULT: '#06B6D4' },
        success: '#22C55E',
        error: '#EF4444',
        text: { 2: '#A1A1AA', 3: '#71717A' },
        'l-bg': '#F7F8FC',
        'l-text': '#0B1020',
        'l-text-2': '#5A6178',
        'l-muted': '#98A0B5',
        'l-yellow': '#FACC15',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      backgroundImage: {
        ai: 'linear-gradient(135deg,#8B5CF6 0%,#6366F1 50%,#06B6D4 100%)',
      },
      boxShadow: {
        ai: '0 6px 22px rgba(139,92,246,.35)',
        glow: '0 8px 32px rgba(0,0,0,.35)',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        blink: 'blink 1.6s infinite',
        pulse3: 'pulse3 1.2s ease-in-out infinite',
        slideIn: 'slideIn .3s',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: .35 } },
        pulse3: { '0%,100%': { opacity: .3, transform: 'scale(.7)' }, '50%': { opacity: 1, transform: 'scale(1)' } },
        slideIn: { from: { transform: 'translateX(120%)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
};