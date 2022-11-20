/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#F5F1F0",
        dark: "#181D3E",
        laccent: "#3F52D3",
        daccent: "#5C5086",
        main: "#3480C5",
      },
    },
  },
  plugins: [],
};
