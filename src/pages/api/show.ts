import type { APIRoute } from 'astro'
import { getShowData } from '@stores/episodes'

// Helper function to strip HTML tags and decode entities
function cleanText(text: string): string {
  if (!text) return ''
  // Remove HTML tags
  let cleaned = text.replace(/<[^>]*>/g, '')
  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
  return cleaned.trim()
}

export const GET: APIRoute = async () => {
  const show = await getShowData()

  if (!show) {
    return new Response(JSON.stringify({ error: 'Show not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  }

  // Create lean JSON structure with cleaned text
  const leanShowData = {
    name: cleanText(show.name),
    description: cleanText(show.description),
    episodes: show.episodes.items.map((episode) => ({
      name: cleanText(episode.name),
      description: cleanText(episode.description),
    })),
  }

  return new Response(JSON.stringify(leanShowData, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
