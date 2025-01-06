import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  adapter: vercel(),
  // adapter: vercel({
  //   imageService: true,
  //   imagesConfig: {
  //     sizes: [64, 96, 128, 256, 384, 512, 640, 750, 828, 1080],
  //     domains: [],
  //     formats: ['image/webp'],
  //   },
  // }),
  image: {
    domains: [],
    remotePatterns: [{ protocol: 'https' }],
  },
  output: 'server',
})
