/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          1: "#101828",
          2: "#1E2839",
          3: "#364153",
          4: "#A4A5A6",
        },
        green: {
          1: "#05DF72",
          2: "#00C950",
        },
        orange: {
          1: "#F01000",
        },
        red: {
          1: "#FB2C36",
        },
      },
    },
  },
  plugins: [],
};
