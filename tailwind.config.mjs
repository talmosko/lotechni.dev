/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: "oklch(77.94% 0.127 196.83)", // Previous #5ECCD1
          light: "oklch(85.93% 0.063 195.95)", // Previous #ABDBDD
          dark: "oklch(61.44% 0.099 196.83)", // Previous #3A9CA1
        },
        surface: {
          DEFAULT: "oklch(17.95% 0.012 255.31)", // Previous #23262D
          dark: "oklch(11.55% 0.009 255.31)", // Previous #13151A
        },
      },
      fontFamily: {
        sans: ["Rubik Variable", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
