/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "text-primary": "var(--text-primary)",
        "--accent": "var(--accent)",
        "--accent-dark": "var(--accent-dark)",
        "--black": "var(--black)",
        "--gray": "96, 115, 159",
        "--gray-light": "var(--gray-light)",
        "--text-primary": "var(--text-primary)",
        "--text-white": "var(--text-white)",
        "--gray-dark": "34, 41, 57",
        "--gray-gradient": "rgba(var(--gray-light), 50%), #fff",
        "--box-shadow":
          "0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.blue.400"),
              "&:hover": {
                color: theme("colors.blue.700"),
                textDecoration: "underline",
              },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(
      function ({ addVariant }) {
        addVariant("glow", ".glow-capture .glow-overlay &");
      },
      {
        theme: {
          extend: {
            colors: {
              glow: "color-mix(in srgb, var(--glow-color) calc(<alpha-value> * 100%), transparent)",
            },
          },
        },
      }
    ),
  ],
};
