/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      tabletL: "768px",
      tabletP: "800px",
      lg: "1024px",
      // desktop: "1280px",
      desktop: "1366px",
      xl: "1536px",
      "2xl": "1920px",
    },
    extend: {},
  },
  plugins: [],
};
