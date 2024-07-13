import { z } from "zod";

const Guid = z.union([
  z.object({
    "@_isPermaLink": z.string(),
    "#text": z.string(),
  }),
  z.string(),
]);

const Enclosure = z.object({
  "@_url": z.string(),
  "@_length": z.string(),
  "@_type": z.string(),
});

const ItunesImage = z
  .object({
    "@_href": z.string(),
  })
  .optional();

const ItunesCategorySingle = z.object({
  "@_text": z.string().optional(),
});

const ItunesCategory = z.union([
  z.array(ItunesCategorySingle),
  ItunesCategorySingle,
]);

const ItunesOwner = z.object({
  "itunes:name": z.string(),
  "itunes:email": z.string(),
});

const AtomLinkSingle = z.object({
  "@_href": z.string(),
  "@_rel": z.string(),
  "@_type": z.optional(z.string()),
});

const AtomLink = z.union([z.array(AtomLinkSingle), AtomLinkSingle]);

const Image = z.object({
  url: z.string(),
  title: z.string(),
  link: z.string(),
});

const Item = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string().optional(),
  guid: Guid,
  "dc:creator": z.string().optional(),
  pubDate: z.string(),
  enclosure: Enclosure,
  "itunes:summary": z.string().optional(),
  "itunes:explicit": z.union([z.string(), z.boolean()]),
  "itunes:duration": z.union([
    z.string(),
    z.number().transform((n) => n.toString()),
  ]),
  "itunes:image": ItunesImage,
  "itunes:episodeType": z.string().optional(),
  "itunes:season": z
    .union([z.string(), z.number().transform((n) => n.toString())])
    .optional(),
  "itunes:episode": z
    .union([z.string(), z.number().transform((n) => n.toString())])
    .optional(),
});

const Channel = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  image: Image,
  generator: z.string().optional(),
  lastBuildDate: z.string().optional(),
  "atom:link": AtomLink,
  author: z.string().optional(),
  copyright: z.string(),
  language: z.string(),
  "itunes:author": z.string(),
  "itunes:summary": z.string().optional(),
  "itunes:type": z.string(),
  "itunes:owner": ItunesOwner,
  "itunes:explicit": z.union([z.string(), z.boolean()]),
  "itunes:category": ItunesCategory,
  "itunes:image": ItunesImage,
  item: z.array(Item),
});

const PodcastRSSFeed = z.object({
  rss: z.object({
    channel: Channel,
  }),
});

export { PodcastRSSFeed };
