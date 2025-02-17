import type { Props as SEOProps } from 'astro-seo'
import ogImage from '@assets/logos/logo.svg'
import type { Episode } from '@data/types/spotifyEpisodes'

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
      description:
        'מפתחים תותחים ותותחיות לא רק כותבים קוד! טל מוסקוביץ׳, אדיר קנדל ואורחים עוזרים למפתחים להישאר רלוונטיים ולפתח את עצמם',
    },
    image: {
      alt: 'לא טכני ולא במקרה - פודקאסט למפתחים ולמפתחות',
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lotechni',
    creator: '@lotechni',
    title: 'לא טכני ולא במקרה - פודקאסט למפתחים ולמפתחות',
    image: ogImage.src,
    imageAlt: 'לא טכני ולא במקרה - פודקאסט למפתחים ולמפתחות',
  },
  extend: {
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: 'Adir Kandel, Tal Moskovich' },
    ],
  },
}

// Helper function for episode pages
export const getEpisodeSEO = (episode: Episode): Partial<SEOProps> => {
  return {
    title: episode.name,
    description: episode.description.substring(0, 155) + '...',
    openGraph: {
      basic: {
        title: episode.name,
        type: 'article',
        image: episode.thumbnail_url,
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
      image: episode.thumbnail_url,
      title: episode.name,
      description: episode.description.substring(0, 155) + '...',
    },
  }
}
