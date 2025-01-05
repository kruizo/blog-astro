/** @type {import('tailwindcss').Config} */
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
    },
  },
  plugins: [],
};
