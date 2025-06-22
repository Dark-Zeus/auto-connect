/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Use a prefix to avoid conflicts with existing styles
  prefix: 'tw-',
  theme: {
    extend: {},
  },
  plugins: [],
  // Disable preflight to avoid resetting existing styles
  corePlugins: {
    preflight: false,
  }
}