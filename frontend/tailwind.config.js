/** @type {import('tailwindcss').Config} */
export default {
  // CRITICAL: Configure the content array to scan your components
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}