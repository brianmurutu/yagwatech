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
          orangeLight: "#F99A50",
          orangeDark: "#D96A10",
          purple: "#8B2FC9",
          purpleLight: "#A855E8",
          purpleDark: "#6B1FA0",
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
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "slide-down": "slideDown 0.22s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "hero-pulse": "heroPulse 6s ease-in-out infinite",
      },
      keyframes: {
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        heroPulse: {
          "0%, 100%": { opacity: "0.08", transform: "scale(1)" },
          "50%": { opacity: "0.16", transform: "scale(1.08)" },
        },
      },
      maxWidth: {
        wrap: "1240px",
      },
    },
  },
  plugins: [],
};
export default config;
