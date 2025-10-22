/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'avora-purple': {
          100: '#e9d8fd',
          200: '#d6bcfa',
          300: '#b794f4',
          400: '#9f7aea',
          500: '#805ad5',
          600: '#6b46c1',
          700: '#553c9a',
          800: '#44337a',
          900: '#322659',
        },
        'avora-pink': {
          100: '#fed7e2',
          200: '#fbb6ce',
          300: '#f687b3',
          400: '#ed64a6',
          500: '#d53f8c',
          600: '#b83280',
          700: '#97266d',
          800: '#702459',
          900: '#521B41',
        },
      },
      boxShadow: {
        'avora': '0 4px 14px 0 rgba(128, 90, 213, 0.25)',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'avora-gradient-start': '#6b46c1',
        'avora-gradient-end': '#d53f8c',
      }),
    },
  },
  plugins: [],
}
