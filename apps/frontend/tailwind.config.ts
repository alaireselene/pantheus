import type { Config } from "tailwindcss";
import { colors } from "./utils/colorScheme";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ancient: {
          // Light theme colors
          background: colors.light.background,
          surface: colors.light.surface,
          border: colors.light.border,
          text: colors.light.text.primary,
          'text-secondary': colors.light.text.secondary,
          gold: colors.light.accent.primary,
          azure: colors.light.accent.secondary,
          yellow: colors.light.accent.tertiary,
          // Dark theme colors
          'dark-bg': colors.dark.background,
          'dark-surface': colors.dark.surface,
          'dark-border': colors.dark.border,
          'dark-text': colors.dark.text.primary,
          'dark-text-secondary': colors.dark.text.secondary,
          'dark-gold': colors.dark.accent.primary,
          'dark-azure': colors.dark.accent.secondary,
          'dark-yellow': colors.dark.accent.tertiary,
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
