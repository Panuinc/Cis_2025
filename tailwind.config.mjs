import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        dark: "#000000",
        default: "#F5F5F5",
        success: "#93D50A",
        warning: "#FCDA01",
        danger: "#FC637D",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        prompt: ["var(--prompt)"],
        sulphur_Point: ["var(--sulphur_Point)"],
        sans: ["Sarabun", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
