import type { APIRoute } from 'astro'
import { getShowData } from '@stores/episodes'

export const GET: APIRoute = async () => {
  try {
    const show = await getShowData()

    if (!show) {
      return new Response(
        JSON.stringify({ error: 'No show data found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Create lean JSON structure
    const leanShowData = {
      name: show.name,
      description: show.description,
      episodes: show.episodes.items.map((episode) => ({
        name: episode.name,
        description: episode.description,
      })),
    }

    return new Response(JSON.stringify(leanShowData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching show data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch show data' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
