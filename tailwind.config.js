/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/react-tailwindcss-select/dist/index.esm.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0b759d',
                'primary-light': '#1fbabf',
                secondary: '#9cee8c',
                'secondary-light': '#60d3aa',
                'bg-primary': '#DDE8F0',
            },
        },
    },
    plugins: [],
}
