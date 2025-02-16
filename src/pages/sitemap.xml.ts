import type { APIRoute } from 'astro'
import { fetchShowData } from '@utils/spotify'

function formatDate(date: string) {
  return new Date(date).toISOString()
}

function formatUrl(baseUrl: string, path: string = '') {
  const cleanBase = baseUrl.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase
}

async function generateSitemapXml(baseUrl: string) {
  const showData = await fetchShowData()

  if (!showData) {
    throw new Error('Failed to fetch show data')
  }

  // Define static pages for better maintainability
  const staticPages = [
    { path: '', changefreq: 'daily', priority: 1.0 },
    { path: 'our-story', changefreq: 'monthly', priority: 0.6 },
    { path: 'episodes', changefreq: 'weekly', priority: 0.8 },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${formatUrl(baseUrl, page.path)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n')}

  <!-- Dynamic Episode Pages -->
  ${showData.episodes.items
    .map(
      (episode) => `
  <url>
    <loc>${formatUrl(baseUrl, `episodes/${episode.episode_number}`)}</loc>
    <lastmod>${formatDate(episode.release_date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n')}
</urlset>`

  return xml.trim()
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('No site URL configured', { status: 500 })
  }

  try {
    const sitemap = await generateSitemapXml(site.toString())

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
