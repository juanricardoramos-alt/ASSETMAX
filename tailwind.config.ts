import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F2F5FA",
          100: "#E4EAF3",
          200: "#C5D2E4",
          300: "#9CB2CF",
          400: "#6C8AB3",
          500: "#4A6997",
          600: "#35517C",
          700: "#273E63",
          800: "#1B2D4C",
          900: "#122039",
          950: "#0A1426",
        },
        gold: {
          50: "#FBF7EB",
          100: "#F5ECCF",
          200: "#EBD99E",
          300: "#DFC26A",
          400: "#D2AC42",
          500: "#C09A2F",
          600: "#A17E25",
          700: "#7F621F",
          800: "#664F1D",
          900: "#55421C",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10, 20, 38, 0.06), 0 4px 16px rgba(10, 20, 38, 0.08)",
        "card-hover":
          "0 2px 4px rgba(10, 20, 38, 0.08), 0 12px 32px rgba(10, 20, 38, 0.14)",
      },
      keyframes: {
        "pin-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.9" },
          "70%": { transform: "scale(2.6)", opacity: "0" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pin-pulse": "pin-pulse 2.4s ease-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
