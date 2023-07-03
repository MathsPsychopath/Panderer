/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#030a0c",
        background: "#ffffff",
        "primary-button": "#3663c4",
        "secondary-button": "#f8f7fd",
        accent: "#2f2074",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

