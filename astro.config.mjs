import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'

// https://astro.build/config
export default defineConfig({
  site: 'https://lotechni-dev.vercel.app', // Development
  // site: 'https://lotechni.dev', // Production - TODO - Uncomment and delete the line above when we will go live
  integrations: [react(), tailwind()],
  adapter: vercel({
    imageService: true,
  }),
  prefetch: { prefetchAll: true },
  output: 'server',
})
