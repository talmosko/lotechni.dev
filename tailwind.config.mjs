/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme'
import { addDynamicIconSelectors } from '@iconify/tailwind'
import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Rubik Variable', ...fontFamily.sans],
      mono: ['Menlo', 'Monaco', 'Lucida Console', ...fontFamily.mono],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: 'oklch(75% 0.12 190)', // Teal — lotechni brand (greener than cyan)
          light: 'oklch(83% 0.06 190)',
          dark: 'oklch(59% 0.10 190)',
        },
        surface: {
          DEFAULT: 'oklch(17.95% 0.012 255.31)',
          dark: 'oklch(11.55% 0.009 255.31)',
        },
        social: {
          spotify: 'oklch(70% 0.26 150)',
          apple: 'oklch(64.12% 0.158 326.32)',
          youtube: 'oklch(60% 0.28 20)',
          linkedin: 'oklch(70% 0.25 220)',
          whatsapp: 'oklch(70% 0.4 140)',
        },
      },
      backgroundImage: {
        'gradient-accent':
          'linear-gradient(45deg, oklch(59% 0.10 190), oklch(83% 0.06 190) 30%, white 60%)',
      },
      backgroundSize: {
        'gradient-lg': '400%',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'white',
            '--tw-prose-headings': 'white',
            '--tw-prose-lead': 'rgb(209 213 219)',
            '--tw-prose-links': 'oklch(75% 0.12 190)',
            '--tw-prose-bold': 'white',
            '--tw-prose-counters': 'rgb(156 163 175)',
            '--tw-prose-bullets': 'rgb(107 114 128)',
            '--tw-prose-hr': 'rgb(75 85 99)',
            '--tw-prose-quotes': 'rgb(243 244 246)',
            '--tw-prose-quote-borders': 'oklch(75% 0.12 190)',
            '--tw-prose-captions': 'rgb(156 163 175)',
            '--tw-prose-code': 'white',
            '--tw-prose-pre-code': 'rgb(209 213 219)',
            '--tw-prose-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-th-borders': 'rgb(75 85 99)',
            '--tw-prose-td-borders': 'rgb(55 65 81)',
            'a:hover': {
              color: 'oklch(83% 0.06 190)',
            },
            'p, ul, ol': {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
          },
        },
      },
    },
  },
  plugins: [
    addDynamicIconSelectors({
      collections: ['tabler'],
    }),
    typography(),
  ],
}
