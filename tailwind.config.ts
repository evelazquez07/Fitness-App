import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefcf3",
          100: "#d6f8e1",
          400: "#34d391",
          500: "#16b876",
          600: "#0f965f",
          900: "#0a3d29",
        },
        surface: {
          DEFAULT: "#0b0f14",
          card: "#12181f",
          border: "#1f2830",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
