/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0b0e14',
        panel: '#0e131d',
        card: '#161d2b',
        line: '#1a2232',
        up: '#00c974',
        uphover: '#00b368',
        down: '#f24949',
        accent: '#0073e6',
        muted: '#7b8b9a',
        pill: '#16212e',
        withdraw: '#1c2638',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
