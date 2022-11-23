/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        newGray: "#adb4b9",
        light: "#E6E8E4",
        dark: "#243351",
        laccent: "#6EB4EF",
        daccent: "#6263C0",
        main: "#3F52D3",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
