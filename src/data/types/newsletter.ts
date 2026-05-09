import { z } from 'zod'

export const NewsletterSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  html_content: z.string(),
  sent_at: z.string(),
  screenshot_url: z.string().optional().default(''),
  preview_url: z.string().optional().default(''),
  stats: z.object({
    sent: z.number().optional(),
    opens_count: z.number().optional(),
    clicks_count: z.number().optional(),
    open_rate: z.object({ string: z.string() }).optional(),
    click_rate: z.object({ string: z.string() }).optional(),
  }).optional(),
})

export type Newsletter = z.infer<typeof NewsletterSchema>
