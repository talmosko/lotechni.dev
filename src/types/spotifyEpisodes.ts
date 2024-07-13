import { z } from "zod";

// Define the schema for an image object
const imageSchema = z.object({
  url: z.string(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

// Define the schema for an episode object
const episodeSchema = z.object({
  audio_preview_url: z.string().nullable(),
  description: z.string(),
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: z.object({
    spotify: z.string(),
  }),
  href: z.string(),
  html_description: z.string(),
  id: z.string(),
  images: z.array(imageSchema),
  is_externally_hosted: z.boolean(),
  is_playable: z.boolean(),
  language: z.string(),
  languages: z.array(z.string()),
  name: z.string(),
  release_date: z.string(),
  release_date_precision: z.string(),
  type: z.string(),
  uri: z.string(),
});

// Define the schema for the response object
const EpisodesResponseSchema = z.array(episodeSchema);

type Episode = z.infer<typeof episodeSchema>;
export { EpisodesResponseSchema, type Episode };
