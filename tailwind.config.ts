import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': { min: '320px', max: '650px' }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    // Use `any` type for the plugin function argument
    function ({ addUtilities }: any) {
      addUtilities({
        '.hide-number-arrows': {
          // Chrome, Safari, Edge, Opera
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            'margin': '0',
          },
          // Firefox
          '&[type=number]': {
            '-moz-appearance': 'textfield',
          },
        },
        '.header-cell': {
          '@apply text-white': {},
        },
      });
    },
  ],
};

export default config;
