import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#dfefff",
          500: "#2f80ed",
          600: "#2269cb",
          700: "#1e56a6"
        }
      },
      boxShadow: {
        card: "0 10px 30px -15px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
