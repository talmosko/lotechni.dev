import { XMLParser } from 'fast-xml-parser'
import PodcastRSSFeed from '@data/types/rssFeed'
import { ShowSchema } from '@data/types/spotifyEpisodes'

// Titles of non-episode RSS items to exclude (e.g. vote callouts, announcements)
const EXCLUDED_TITLE_PATTERNS = [
  /הצביעו לנו/i, // geektime vote callout
]

function extractEpisodeNumber(title: string): number | null {
  const match = title.match(/פרק \{(\d+)\}/)
  return match ? parseInt(match[1]) : null
}

async function getRssFeed() {
  const res = await fetch('https://anchor.fm/s/f01f6814/podcast/rss')
  const xml = await res.text()
  const parser = new XMLParser({ ignoreAttributes: false })
  const json = parser.parse(xml)
  return PodcastRSSFeed.parse(json)
}

/**
 * Fetches the Spotify episode ID list from the n8n Playwright workflow.
 * Returns an ordered array (newest first) matching the RSS feed order.
 * Falls back to an empty array if the env var is not configured or the call fails.
 *
 * NOTE: The n8n workflow runs Playwright synchronously (~2 min). The Astro
 * build will wait for the response before continuing.
 */
async function fetchSpotifyEpisodeIds(): Promise<string[]> {
  const webhookUrl = import.meta.env.N8N_SPOTIFY_WEBHOOK_URL
  if (!webhookUrl) return []

  try {
    const res = await fetch(webhookUrl, { signal: AbortSignal.timeout(180_000) })
    if (!res.ok) return []
    const data: { episodeId: string }[] = await res.json()
    return data.map((ep) => ep.episodeId)
  } catch {
    return []
  }
}

/**
 * Converts an RSS episode link (podcasters.spotify.com) to a Spotify/Anchor
 * embeddable iframe URL (creators.spotify.com).
 *
 * Input:  https://podcasters.spotify.com/pod/show/lotechni/episodes/44---e3g4k4n
 * Output: https://creators.spotify.com/pod/profile/lotechni/embed/episodes/44---e3g4k4n
 */
function buildAnchorEmbedUrl(rssLink: string): string {
  if (!rssLink) return ''
  const match = rssLink.match(/\/pod\/show\/([^/]+)\/episodes\/([^?#]+)/)
  if (!match) return ''
  const [, handle, slug] = match
  return `https://creators.spotify.com/pod/profile/${handle}/embed/episodes/${slug}`
}

export async function fetchShowData() {
  const [rssFeed, spotifyIds] = await Promise.all([getRssFeed(), fetchSpotifyEpisodeIds()])

  const channel = rssFeed.rss.channel
  const items = channel.item
  const showImageUrl = channel['itunes:image']?.['@_href'] || ''

  const episodeItems = items.map((item, index) => {
    const episodeImageUrl = item['itunes:image']?.['@_href'] || showImageUrl
    const episodeNumber = extractEpisodeNumber(item.title)

    // Prefer the Spotify video embed if we have the ID from n8n, otherwise use Anchor embed
    const spotifyId = spotifyIds[index]
    const iframeUrl = spotifyId
      ? `https://open.spotify.com/embed/episode/${spotifyId}/video?utm_source=oembed`
      : buildAnchorEmbedUrl(item.link || '')

    return {
      id: spotifyId || item.link || '',
      name: item.title,
      description: item.description,
      html_description: item.description,
      release_date: new Date(item.pubDate).toISOString().split('T')[0],
      release_date_precision: 'day',
      images: [{ url: episodeImageUrl, height: null, width: null }],
      episode_number: episodeNumber ?? -1,
      iframe_url: iframeUrl,
      embed_url: iframeUrl,
      thumbnail_url: episodeImageUrl,
      audio_preview_url: null,
      explicit: item['itunes:explicit'] === true || item['itunes:explicit'] === 'true',
    }
  })

  // Filter out items without a valid episode number (announcements, vote callouts, etc.)
  const liveEpisodes = episodeItems.filter(
    (ep) =>
      ep.episode_number >= 0 &&
      !EXCLUDED_TITLE_PATTERNS.some((pattern) => pattern.test(ep.name))
  )

  return ShowSchema.parse({
    name: channel.title,
    description: channel.description,
    images: [{ url: showImageUrl, height: null, width: null }],
    total_episodes: liveEpisodes.length,
    episodes: {
      href: '',
      limit: liveEpisodes.length,
      next: null,
      offset: 0,
      previous: null,
      total: liveEpisodes.length,
      items: liveEpisodes,
    },
  })
}
