import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ancient: {
          brown: '#372B1B',
          beaver: '#9D8C71',
          sage: '#BBB093',
          gold: '#AA633F',
          yellow: '#C8A55F',
          azure: '#4D89B0'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#3b82f6',
              textDecoration: 'underline',
              '&:hover': {
                color: '#2563eb',
              },
            },
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '0.75em',
              borderRadius: '0.375rem',
              overflow: 'auto',
            },
            code: {
              color: '#e2e8f0',
              backgroundColor: '#1e293b',
              paddingLeft: '0.25em',
              paddingRight: '0.25em',
              borderRadius: '0.25em',
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'ul > li::marker': {
              color: '#AA633F', // ancient-gold
            },
            'ol > li::marker': {
              color: '#AA633F', // ancient-gold
            },
            'ul > li': {
              paddingLeft: '0.5em',
            },
            'ol > li': {
              paddingLeft: '0.5em',
            },
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-david-libre)"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
