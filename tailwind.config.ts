import type { Config } from "tailwindcss";
import { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    function ({ addBase, theme }: PluginAPI) {
      addBase({
        ':root': {
          '--text-color': theme('colors.textColor'),
          '--secondary-color': theme('colors.secondary'),
          '--screens-sm': theme('screens.sm'),
        },
      });
    },
  ],
  theme: {
    colors: {
      textColor: '#BCC8D0', // Example custom color
    },
  },
};
export default config;
