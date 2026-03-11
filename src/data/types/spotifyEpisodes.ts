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
  duration_ms: z.number().optional().default(0),
  explicit: z.boolean(),
  external_urls: externalUrlsSchema.optional().default({ spotify: '' }),
  href: z.string().optional().default(''),
  id: z.string(),
  images: z.array(imageSchema),
  is_externally_hosted: z.boolean().optional().default(false),
  is_playable: z.boolean().optional().default(true),
  language: z.string().optional().default(''),
  languages: z.array(z.string()).optional().default([]),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.string(),
  resume_point: resumePointSchema.optional(),
  type: z.string().optional().default('episode'),
  uri: z.string().optional().default(''),
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
  available_markets: z.array(z.string()).optional().default([]),
  copyrights: z.array(copyrightSchema).optional().default([]),
  description: z.string(),
  html_description: z.string().optional().default(''),
  explicit: z.boolean().optional().default(false),
  external_urls: externalUrlsSchema.optional().default({ spotify: '' }),
  href: z.string().optional().default(''),
  id: z.string().optional().default(''),
  images: z.array(imageSchema),
  is_externally_hosted: z.boolean().optional().default(false),
  languages: z.array(z.string()).optional().default([]),
  media_type: z.string().optional().default(''),
  name: z.string(),
  publisher: z.string().optional().default(''),
  type: z.string().optional().default('show'),
  uri: z.string().optional().default(''),
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
