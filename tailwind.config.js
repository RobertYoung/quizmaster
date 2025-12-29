/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'question': 'clamp(1.5rem, 4vw, 3rem)',
        'answer': 'clamp(1.25rem, 3vw, 2.5rem)',
        'option': 'clamp(1rem, 2.5vw, 1.75rem)',
      },
    },
  },
  plugins: [],
}
