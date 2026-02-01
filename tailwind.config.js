/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 14px 28px rgba(31, 42, 68, 0.12)',
        lift: '0 18px 36px rgba(31, 42, 68, 0.18)',
      },
    },
  },
  plugins: [],
}
