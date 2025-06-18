/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        trajan: ["TrajanFont", "serif"],
        pacioli: ["Pacioli", "sans-serif"],
      },
    },
  },
  plugins: [],
}
