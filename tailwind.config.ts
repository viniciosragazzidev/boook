import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bgImage: "url('/images/cover.jpg')",
      },
      colors: {
        cBlueDark: "#0D1544",
        cBlue: "#1D2765",
        cBlueLight: "rgb(16 25 81)",
        cWhite: "#DBE4F4",
        cGray: "#A9B3D1",
        cRed: "#E71B44",
      },
    },
  },
  plugins: [],
};
export default config;
