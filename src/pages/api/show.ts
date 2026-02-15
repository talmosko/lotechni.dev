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
  try {
    const show = await getShowData()

    if (!show) {
      return new Response(JSON.stringify({ error: 'No show data found' }, null, 2), {
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

    return new Response(JSON.stringify(leanShowData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error fetching show data:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch show data' }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  }
}
