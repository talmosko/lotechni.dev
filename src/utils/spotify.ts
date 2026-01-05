import { XMLParser } from 'fast-xml-parser'
import PodcastRSSFeed from '@data/types/rssFeed'
import { ShowSchema, type Episode, SpotifyEmbedResponseSchema } from '@data/types/spotifyEpisodes'

const excludedEpisodes = [
  '79SCKYsZmqwpBuQ0A2xfrb', // invitation to vote geektime 2025
]

export async function getAccessToken(clientId: string, clientSecret: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function fetchShowData() {
  const showId = import.meta.env.PUBLIC_SPOTIFY_SHOW_ID
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify client credentials in environment variables.')
  }

  const accessToken = await getAccessToken(clientId, clientSecret)

  const res = await fetch(`https://api.spotify.com/v1/shows/${showId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch show data: ${res.statusText}`)
  }

  const data = await res.json()
  const liveEpisodes = data.episodes.items.filter(
    (episode: Episode) => episode && !excludedEpisodes.includes(episode.id)
  )

  const episodesWithNumbers = liveEpisodes.map((episode: Episode, index: number) => {
    return {
      ...episode,
      episode_number: liveEpisodes.length - index - 1,
      iframe_url: `https://open.spotify.com/embed/episode/${episode.id}/video?utm_source=oembed`,
      embed_url: `https://embed.spotify.com/oembed?url=${episode.uri}&format=json`,
    }
  })

  const parsedDataWithNumbers = ShowSchema.parse({
    ...data,
    episodes: { ...data.episodes, items: episodesWithNumbers },
  })

  return parsedDataWithNumbers
}

const getRssFeed = async () => {
  const res = await fetch('https://anchor.fm/s/f01f6814/podcast/rss')
  const xml = await res.text()
  const parser = new XMLParser({
    ignoreAttributes: false,
  })
  const json = parser.parse(xml)
  const rssFeed = PodcastRSSFeed.parse(json)
  return rssFeed
}

export async function fetchEpisodeThumbnails(episodes: Episode[]) {
  const thumbnailMap: Record<string, string> = {}

  await Promise.all(
    episodes.map(async (episode) => {
      try {
        const response = await fetch(episode.embed_url)
        if (!response.ok) {
          console.error(`Failed to fetch embed data for episode ${episode.id}`)
          return
        }

        const embedData = await response.json()
        const parsedEmbed = SpotifyEmbedResponseSchema.parse(embedData)

        thumbnailMap[episode.id] = parsedEmbed.thumbnail_url
      } catch (error) {
        console.error(`Error processing episode ${episode.id}:`, error)
      }
    })
  )

  return thumbnailMap
}
