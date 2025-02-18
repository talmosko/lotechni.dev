import type { APIRoute } from 'astro'

const getRobotsTxt = (baseUrl: string) => `
User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('No site URL configured', { status: 500 })
  }

  return new Response(getRobotsTxt(site.toString()), {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
