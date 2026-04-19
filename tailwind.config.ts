import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand1: {
          50: "#f0f7ff",
          100: "#dfefff",
          500: "#2f80ed",
          600: "#2269cb",
          700: "#1e56a6"
        },
        brand: {
          orange: {
            50:  "#fff3ef",
            100: "#ffd6cc",
            500: "#F95933", // brand
            600: "#d94e2c",
            700: "#a63b22"
          },
          teal: {
            50:  "#effcfc",
            100: "#ccf2f2",
            500: "#19B6B6", // brand
            600: "#149b9b",
            700: "#0f7777"
          },
          yellow: {
            50: "#fffdf0",
            100: "#fff7cc",
            200: "#fff1a3",
            500: "#FFED6C", // brand
            600: "#e6d55f",
            700: "#b3a647"
          }
        }
      },
      boxShadow: {
        card: "0 10px 30px -15px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
