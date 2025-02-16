import type { Props as SEOProps } from 'astro-seo'
import ogImage from '@assets/seo/og-default.png'

// Base SEO props that will be used across all pages
export const defaultSEO: SEOProps = {
  title: 'לא טכני ולא במקרה',
  titleTemplate: '%s | לא טכני ולא במקרה',
  description:
    'מפתחים תותחים ותותחיות לא רק כותבים קוד! טל מוסקוביץ׳, אדיר קנדל ואורחים עוזרים למפתחים להישאר רלוונטיים ולפתח את עצמם',
  charset: 'UTF-8',
  openGraph: {
    basic: {
      title: 'לא טכני ולא במקרה - פודקאסט למפתחים',
      type: 'website',
      image: ogImage.src,
      url: 'https://lotechni.dev',
    },
    optional: {
      locale: 'he_IL',
      siteName: 'לא טכני ולא במקרה',
      description: 'פודקאסט טכנולוגי בהנחיית אדיר קנדל וטל מושקוביץ',
    },
    image: {
      alt: 'לא טכני ולא במקרה - הפודקאסט למפתחים',
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lotechni',
    creator: '@lotechni',
    title: 'לא טכני ולא במקרה - פודקאסט למפתחים',
    image: ogImage.src,
    imageAlt: 'לא טכני ולא במקרה - הפודקאסט למפתחים',
  },
  extend: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: 'Adir Kandel, Tal Moskovich' },
    ],
  },
}

// Helper function for episode pages
export const getEpisodeSEO = (episode: {
  name: string
  description: string
  images: { url: string }[]
  release_date: string
  episode_number: number
}): Partial<SEOProps> => {
  return {
    title: episode.name,
    description: episode.description.substring(0, 155) + '...',
    openGraph: {
      basic: {
        title: episode.name,
        type: 'article',
        image: episode.images[0].url,
        url: `https://lotechni.dev/episodes/${episode.episode_number}`,
      },
      optional: {
        description: episode.description.substring(0, 155) + '...',
      },
      article: {
        publishedTime: episode.release_date,
        authors: ['Adir Kandel', 'Tal Moskovich'],
        tags: ['podcast', 'development', 'tech', 'career'],
      },
    },
    twitter: {
      card: 'summary_large_image',
      image: episode.images[0].url,
      title: episode.name,
      description: episode.description.substring(0, 155) + '...',
    },
  }
}
