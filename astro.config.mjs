import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  site: 'https://lotechni.dev',
  integrations: [react(), tailwind()],
  adapter: vercel({
    imageService: true,
  }),
  image: {
    domains: [
      'image-cdn-ak.spotifycdn.com',
      'image-cdn-fa.spotifycdn.com',
      'd3t3ozftmdmh3i.cloudfront.net',
      'preview.mailerlite.io',
      'assets.mlcdn.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-fa.spotifycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'd3t3ozftmdmh3i.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'preview.mailerlite.io',
      },
      {
        protocol: 'https',
        hostname: 'assets.mlcdn.com',
      },
    ],
  },
  prefetch: { prefetchAll: true },
  output: 'static',
})
