import type { Config } from "tailwindcss";
import { colors } from "./utils/colorScheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Use semantic naming for better maintainability
        primary: colors.light.accent.primary,
        secondary: colors.light.accent.secondary,
        accent: colors.light.accent.tertiary,

        // Light mode
        light: {
          bg: colors.light.background,
          surface: colors.light.surface,
          border: colors.light.border,
          text: {
            primary: colors.light.text.primary,
            secondary: colors.light.text.secondary,
          },
        },

        // Dark mode
        dark: {
          bg: colors.dark.background,
          surface: colors.dark.surface,
          border: colors.dark.border,
          text: {
            primary: colors.dark.text.primary,
            secondary: colors.dark.text.secondary,
          },
        }
      },
      fontFamily: {
        sans: ["var(--font-david-libre)", "system-ui", "sans-serif"],
      },
      height: {
        screen: '100dvh',
      },
      maxWidth: {
        prose: '65ch',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'prose',
      target: 'modern',
      dark: true,
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Typography configuration as a separate object for better organization
  typography: ({ theme }: { theme: (path: string) => string }) => ({
    DEFAULT: {
      css: {
        '--tw-prose-body': theme('colors.gray.900'),
        '--tw-prose-headings': theme('colors.gray.900'),
        '--tw-prose-links': theme('colors.blue.600'),
        '--tw-prose-bold': theme('colors.gray.900'),
        '--tw-prose-bullets': theme('colors.gray.700'),
        '--tw-prose-quotes': theme('colors.gray.900'),
        '--tw-prose-code': theme('colors.gray.900'),
        maxWidth: 'none',
        a: {
          textDecoration: 'none',
          '&:hover': {
            color: theme('colors.blue.700'),
          },
        },
        p: {
          marginTop: theme('spacing.4'),
          marginBottom: theme('spacing.4'),
        },
      },
    },
    invert: {
      css: {
        '--tw-prose-body': theme('colors.gray.100'),
        '--tw-prose-headings': theme('colors.gray.100'),
        '--tw-prose-links': theme('colors.blue.400'),
        '--tw-prose-bold': theme('colors.gray.100'),
        '--tw-prose-bullets': theme('colors.gray.300'),
        '--tw-prose-quotes': theme('colors.gray.100'),
        '--tw-prose-code': theme('colors.gray.100'),
        a: {
          '&:hover': {
            color: theme('colors.blue.300'),
          },
        },
      },
    },
  }),
};

export default config;
