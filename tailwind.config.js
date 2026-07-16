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
