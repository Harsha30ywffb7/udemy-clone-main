/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}", // Adjust based on your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
        mono: [
          "source-code-pro",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
