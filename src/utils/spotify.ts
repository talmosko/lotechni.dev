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

/**
 * Determines if an episode belongs to the "לא פורמלי" secondary series
 * and extracts its sub-number.
 * Returns { isLf: true, lfNumber: N } for "לא פורמלי" / "לא פורמאלי" episodes,
 * or { isLf: false } for regular episodes.
 */
function parseLfInfo(title: string): { isLf: boolean; lfNumber?: number } {
  const isLf = /לא פורמלי|לא פורמאלי/i.test(title)
  if (!isLf) return { isLf: false }
  const match = title.match(/\{(\d+)\}/)
  return { isLf: true, lfNumber: match ? parseInt(match[1]) : 0 }
}

/**
 * Creates a unique key for an episode based on its series and number.
 * Returns "main-N" for regular episodes, "lf-N" for "לא פורמלי" episodes.
 */
function getEpisodeKey(title: string): string | null {
  const lfInfo = parseLfInfo(title)
  if (lfInfo.isLf) {
    return lfInfo.lfNumber !== undefined ? `lf-${lfInfo.lfNumber}` : null
  }
  const episodeNumber = extractEpisodeNumber(title)
  return episodeNumber !== null ? `main-${episodeNumber}` : null
}

async function getRssFeed() {
  const res = await fetch('https://anchor.fm/s/f01f6814/podcast/rss')
  const xml = await res.text()
  const parser = new XMLParser({ ignoreAttributes: false })
  const json = parser.parse(xml)
  return PodcastRSSFeed.parse(json)
}

type SpotifyEpisodeData = { episodeId: string; embedUrl: string; thumbnailUrl: string; title?: string }

/**
 * Fetches episode data from the n8n Playwright workflow.
 * Returns an array of Spotify episode data (order-independent — matched by series+number).
 * Falls back to an empty array if the env var is not configured or the call fails.
 *
 * NOTE: The n8n workflow runs Playwright synchronously (~2 min). The Astro
 * build will wait for the response before continuing.
 */
async function fetchSpotifyEpisodeData(): Promise<SpotifyEpisodeData[]> {
  const webhookUrl = import.meta.env.N8N_SPOTIFY_WEBHOOK_URL
  if (!webhookUrl) return []

  try {
    const res = await fetch(webhookUrl, { signal: AbortSignal.timeout(180_000) })
    if (!res.ok) return []
    return await res.json()
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
  const [rssFeed, spotifyData] = await Promise.all([getRssFeed(), fetchSpotifyEpisodeData()])

  const channel = rssFeed.rss.channel
  const items = channel.item
  const showImageUrl = channel['itunes:image']?.['@_href'] || ''

  // Build a lookup map from episode key (series+number) → Spotify data
  // e.g. "main-50" → פרק 50, "lf-0" → לא פורמלי 0
  const spotifyByKey = new Map<string, SpotifyEpisodeData>()
  for (const sd of spotifyData) {
    if (sd.title) {
      const key = getEpisodeKey(sd.title)
      if (key) spotifyByKey.set(key, sd)
    }
  }

  const episodeItems = items.map((item) => {
    const episodeNumber = extractEpisodeNumber(item.title)
    const lfInfo = parseLfInfo(item.title)
    const slug = lfInfo.isLf
      ? `lf-${lfInfo.lfNumber}`
      : episodeNumber?.toString() ?? ''

    // Match Spotify data by series+number (reliable, order-independent)
    const episodeKey = getEpisodeKey(item.title)
    const spotify = episodeKey ? spotifyByKey.get(episodeKey) : undefined

    // Always use buildAnchorEmbedUrl for iframe (reliable, based on RSS link)
    const iframeUrl = buildAnchorEmbedUrl(item.link || '')

    // Prefer Spotify CDN thumbnail; fall back to RSS feed image
    const thumbnailUrl =
      spotify?.thumbnailUrl || item['itunes:image']?.['@_href'] || showImageUrl

    return {
      id: spotify?.episodeId || item.link || '',
      name: item.title,
      description: item.description,
      html_description: item.description,
      release_date: new Date(item.pubDate).toISOString().split('T')[0],
      release_date_precision: 'day',
      images: [{ url: thumbnailUrl, height: null, width: null }],
      episode_number: episodeNumber ?? -1,
      slug,
      iframe_url: iframeUrl,
      embed_url: iframeUrl,
      thumbnail_url: thumbnailUrl,
      audio_preview_url: null,
      explicit: item['itunes:explicit'] === true || item['itunes:explicit'] === 'true',
    }
  })

  // Filter out items without a valid episode number or slug (announcements, vote callouts, etc.)
  const liveEpisodes = episodeItems.filter(
    (ep) =>
      (ep.episode_number >= 0 || ep.slug.startsWith('lf-')) &&
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
