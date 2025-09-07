import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111827',
          50: '#f6f7f9',
          100: '#e7eaf1',
          200: '#cdd4e2',
          300: '#a7b2cc',
          400: '#7989b1',
          500: '#566a98',
          600: '#41527e',
          700: '#354364',
          800: '#2f3a52',
          900: '#293243',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
