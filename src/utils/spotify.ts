import { XMLParser } from 'fast-xml-parser'
import PodcastRSSFeed from '../types/rssFeed'
import { EpisodesResponseSchema } from '../types/spotifyEpisodes'
import showMock from '../types/show.mock'

export async function getAccessToken(clientId: string, clientSecret: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return data.access_token
}

export async function fetchEpisodes(showId: string) {
  // try {
  //   const accessToken = await getAccessToken(
  //     import.meta.env.SPOTIFY_CLIENT_ID,
  //     import.meta.env.SPOTIFY_CLIENT_SECRET
  //   );
  //   const response = await fetch(
  //     `https://api.spotify.com/v1/shows/${showId}?limit=50`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   const data = await response.json();
  //   console.log(data);
  //   const show = EpisodesResponseSchema.parse(data);
  //   return show;
  // } catch (error) {
  //   console.log(error);
  //   return EpisodesResponseSchema.parse(showMock);
  // }
  return EpisodesResponseSchema.parse(showMock)
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
