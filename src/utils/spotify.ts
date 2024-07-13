import { XMLParser } from "fast-xml-parser";
import { PodcastRSSFeed } from "../types/rssFeed";

export async function getAccessToken(client_id: string, client_secret: string) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function fetchEpisodes(accessToken: string, showId: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/shows/${showId}/episodes`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data.items;
}

const getRssFeed = async () => {
  const res = await fetch("https://anchor.fm/s/f01f6814/podcast/rss");
  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const json = parser.parse(xml);
  const rssFeed = PodcastRSSFeed.parse(json);
  return rssFeed;
};
