import { z } from 'zod'

// Define the schema for an image object
const imageSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
})

// Define the schema for a copyright object
const copyrightSchema = z.object({
  text: z.string(),
  type: z.string(),
})

// Define the schema for an external URL object
const externalUrlsSchema = z.object({
  spotify: z.string(),
})

// Define the schema for a resume point object
const resumePointSchema = z.object({
  fully_played: z.boolean(),
  resume_position_ms: z.number(),
})

// Define the schema for a restriction object
const restrictionSchema = z.object({
  reason: z.string(),
})

// Define the schema for an episode object
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

// Define the schema for the episodes response object
const episodesResponseSchema = z.object({
  href: z.string(),
  limit: z.number(),
  next: z.string().nullable(),
  offset: z.number(),
  previous: z.string().nullable(),
  total: z.number(),
  items: z.array(episodeSchema),
})

// Define the schema for the main response object
const EpisodesResponseSchema = z.object({
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
  episodes: episodesResponseSchema,
})

type Episode = z.infer<typeof episodeSchema>
export { EpisodesResponseSchema, type Episode }
