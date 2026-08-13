/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        signal: '#FF1F1F',
        action: '#E31B23',
        carbon: '#0B0B0D',
        cloud: '#F4F4F6',
        steel: '#B9BDC7',
        slate2: '#2B2F36',
        'soft-red': '#FFF1F1',
        // Diagnostic score-status colours — always paired with text/numeric labels, never colour alone.
        'score-critical': '#B42318',
        'score-constrained': '#B76E00',
        'score-conditional': '#9A6700',
        'score-ready': '#168554',
        'score-high': '#0F6B47',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
