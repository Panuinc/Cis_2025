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
        dark: "#171A1B",
        default: "#F5F5F5",
        primary: "#967BDE",
        success: "#76D755",
        warning: "#FFAE2B",
        danger: "#FF0000",
        secondary: "#00D3F3",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        prompt: ["var(--prompt)"],
        sulphur_Point: ["var(--sulphur_Point)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
