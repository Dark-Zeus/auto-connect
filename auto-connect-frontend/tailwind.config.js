/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#DFF2EB", // Your lightest green
          200: "#B9E5E8", // Your light blue-green
          300: "#7AB2D3", // Your medium blue
          400: "#4A628A", // Your darkest blue
          500: "#3d5374", // Slightly darker variation
          600: "#2f4360", // Darker variation
          700: "#223248", // Even darker
          800: "#1a2938", // Very dark
          900: "#131e29", // Darkest
        },
      },
      fontFamily: {
        sans: ["Poppins", "Roboto", "system-ui", "sans-serif"],
      },
    },
  },
};
