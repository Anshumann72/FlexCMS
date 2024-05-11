/** @type {import('tailwindcss').Config} */
import reactRefresh from "@vitejs/plugin-react-refresh";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      "react-router-dom": "react-router-dom",
    },
  },
};
