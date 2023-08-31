/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Black: ["Black"],
        Bold: ["Bold"],
        ExtraBold: ["ExtraBold"],
        Light: ["Light"],
        Medium: ["Medium"],
        Regular: ["Regular"],
        SemiBold: ["SemiBold"],
      },
      colors: {
        primary: "#D8126A",
      },
    },
  },
  plugins: [],
};
