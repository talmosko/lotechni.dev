import { z } from 'zod'

const imageSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
})

const copyrightSchema = z.object({
  text: z.string(),
  type: z.string(),
})

const externalUrlsSchema = z.object({
  spotify: z.string(),
})

const resumePointSchema = z.object({
  fully_played: z.boolean(),
  resume_position_ms: z.number(),
})

const restrictionSchema = z.object({
  reason: z.string(),
})

const episodeSchema = z.object({
  audio_preview_url: z.string().nullable(),
  description: z.string(),
  html_description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(imageSchema),
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean(),
  language: z.string(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.string(),
  resume_point: resumePointSchema.optional(),
  type: z.string(),
  uri: z.string(),
  restrictions: restrictionSchema.optional(),
})

const EpisodeSchemaWithNumber = episodeSchema.extend({
  episode_number: z.number(),
  iframe_url: z.string(),
  embed_url: z.string(),
  thumbnail_url: z.string().optional(),
})

const SpotifyEpisodesResponseSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(EpisodeSchemaWithNumber),
})

const ShowSchema = z.object({
  available_markets: z.array(z.string()),
  copyrights: z.array(copyrightSchema),
  description: z.string(),
  html_description: z.string(),
  explicit: z.boolean(),
  external_urls: externalUrlsSchema,
  href: z.string(),
  id: z.string(),
  images: z.array(imageSchema),
  is_externally_hosted: z.boolean(),
  languages: z.array(z.string()),
  media_type: z.string(),
  name: z.string(),
  publisher: z.string(),
  type: z.string(),
  uri: z.string(),
  total_episodes: z.number(),
  episodes: SpotifyEpisodesResponseSchema,
})

const SpotifyEmbedResponseSchema = z.object({
  html: z.string(),
  iframe_url: z.string(),
  width: z.number(),
  height: z.number(),
  version: z.string(),
  provider_name: z.string(),
  provider_url: z.string(),
  type: z.string(),
  title: z.string(),
  thumbnail_url: z.string(),
  thumbnail_width: z.number(),
  thumbnail_height: z.number(),
})

type Show = z.infer<typeof ShowSchema>
type Episode = z.infer<typeof EpisodeSchemaWithNumber>

export {
  SpotifyEpisodesResponseSchema,
  ShowSchema,
  SpotifyEmbedResponseSchema,
  type Episode,
  type Show,
}
