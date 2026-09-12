/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "rgba(22, 27, 46, 0.7)",
        accentCyan: "#00F2FE",
        accentBlue: "#4FACFE",
      },
    },
  },
  plugins: [],
};