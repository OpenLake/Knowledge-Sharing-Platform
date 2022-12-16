/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#018ABD',
        'primary-dark': '#004581',
        'primary-light': '#97CBDC',
        'bg-primary': '#DDE8F0'
      }
    },
  },
  plugins: [],
}
