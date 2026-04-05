import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121316",
        surface: "#121316",
        "surface-container-lowest": "#0d0e11",
        "surface-container-low": "#1a1b1e",
        "surface-container": "#1f1f23",
        "surface-container-high": "#292a2d",
        "surface-container-highest": "#343538",
        "primary-container": "#5865f2",
        primary: "#bec2ff",
        "on-surface": "#e3e2e6",
        "on-surface-variant": "#c6c5d7",
        "outline-variant": "#454655",
        tertiary: "#66de8c",
        error: "#ffb4ab"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
