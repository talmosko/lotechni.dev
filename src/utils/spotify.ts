import { XMLParser } from 'fast-xml-parser'
import PodcastRSSFeed from '@data/types/rssFeed'
import { SpotifyEpisodesResponseSchema, EpisodesResponseSchema } from '@data/types/spotifyEpisodes'
import showMock from '@data/types/show.mock'

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
    throw new Error("Failed to fetch access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function fetchEpisodes(showId: string) {
  try {
    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Spotify credentials in environment variables");
    }

    const accessToken = await getAccessToken(clientId, clientSecret);
    const response = await fetch(
      `https://api.spotify.com/v1/shows/${showId}/episodes?limit=50`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }

    const data = await response.json();
    const episodes = SpotifyEpisodesResponseSchema.parse(data);
    return episodes;
  } catch (error) {
    console.error("Error fetching Spotify episodes:", error);
    return {
      episodes: {
        items: [],
      },
    };
  }
}

export async function fetchShowData(showId: string) {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify client credentials in environment variables.');
  }

  const accessToken = await getAccessToken(clientId, clientSecret);

  const res = await fetch(`https://api.spotify.com/v1/shows/${showId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch show data: ${res.statusText}`);
  }

  const data = await res.json();

  const parsedData = EpisodesResponseSchema.parse(data);

  return parsedData;
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
