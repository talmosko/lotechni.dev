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
          DEFAULT: 'oklch(77.94% 0.127 196.83)', // Previous #5ECCD1
          light: 'oklch(85.93% 0.063 195.95)', // Previous #ABDBDD
          dark: 'oklch(61.44% 0.099 196.83)', // Previous #3A9CA1
          // (as previously defined)
          // DEFAULT: "rgb(94, 204, 209)",
          // light: "rgb(171, 219, 221)",
          // dark: "rgb(58, 156, 161)",
        },
        surface: {
          DEFAULT: 'oklch(17.95% 0.012 255.31)', // Previous #23262D
          dark: 'oklch(11.55% 0.009 255.31)', // Previous #13151A
          // (as previously defined)
          // DEFAULT: '#23262D',
          // dark: '#13151A',
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
          'linear-gradient(45deg, oklch(61.44% 0.099 196.83), oklch(85.93% 0.063 195.95) 30%, white 60%)',
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
            '--tw-prose-links': 'oklch(77.94% 0.127 196.83)', // accent color
            '--tw-prose-bold': 'white',
            '--tw-prose-counters': 'rgb(156 163 175)',
            '--tw-prose-bullets': 'rgb(107 114 128)',
            '--tw-prose-hr': 'rgb(75 85 99)',
            '--tw-prose-quotes': 'rgb(243 244 246)',
            '--tw-prose-quote-borders': 'oklch(77.94% 0.127 196.83)', // accent color
            '--tw-prose-captions': 'rgb(156 163 175)',
            '--tw-prose-code': 'white',
            '--tw-prose-pre-code': 'rgb(209 213 219)',
            '--tw-prose-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-th-borders': 'rgb(75 85 99)',
            '--tw-prose-td-borders': 'rgb(55 65 81)',
            'a:hover': {
              color: 'oklch(85.93% 0.063 195.95)', // accent-light color
            },
            'p, ul, ol': {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
          },
        },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-up': {
          from: { transform: 'scale(0.95)' },
          to: { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
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
