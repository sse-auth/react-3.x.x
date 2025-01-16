import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme.js";
import {
  animations,
  components,
  palettes,
  rounded,
  grays,
  shade,
} from "@sse-ui/themer";

const config = {
  darkMode: "selector",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@sse-ui/themer/dist/components/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        ...palettes.trust,
        grey: grays.neutral,
      },
      fontFamily: {
        sans: ["Geist", "Inter", ...defaultTheme.fontFamily.sans],
        mono: ["GeistMono", "fira-code", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [animations, components, rounded, shade],
} satisfies Config;

export default config;
