/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        prompt: ["var(--prompt)"],
        roboto_Flex: ["var(--roboto_Flex)"],
      },
    },
  },
  plugins: [],
};
