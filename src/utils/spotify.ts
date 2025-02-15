import { XMLParser } from 'fast-xml-parser'
import PodcastRSSFeed from '@data/types/rssFeed'
import { ShowSchema, type Episode } from '@data/types/spotifyEpisodes'

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
  const liveEpisodes = data.episodes.items.filter((episode: Episode) => episode)
  const episodesWithNumbers = liveEpisodes.map((episode: Episode, index: number) => ({
    ...episode,
    episode_number: liveEpisodes.length - index - 1,
  }))

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
