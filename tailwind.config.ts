import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          blue: "#0B3D91",
          blueLight: "#1A56C4",
          blueDark: "#07255A",
          orange: "#F47B20",
          orangeLight: "#FFA04D",
          orangeDark: "#D96A10",
        },
        ink: {
          50: "#F7F9FC",
          100: "#EEF1F7",
          400: "#5A6680",
          900: "#1A1A2E",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        wrap: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;
