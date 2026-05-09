import { cleanHtmlContent } from '@utils/cleanHtml'
import type { Newsletter } from '@data/types/newsletter'

const MAILERLITE_API = 'https://connect.mailerlite.com/api'

function extractNewsletterBody(fullHtml: string): string {
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (!bodyMatch) return fullHtml

  let body = bodyMatch[1]

  body = body.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
  body = body.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
  body = body.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
  body = body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  // Keep <style> — we need it for the newsletter content CSS
  // (No longer stripping style tags)

  // Strip MailerLite tracking attributes
  body = body.replace(/\s*(builder-link-id|data-link-id|data-link-type|data-track)="[^"]*"/gi, '')

  const contentMatch = body.match(
    /<(?:div|article|main|table)[^>]*(?:class|id)\s*=\s*["'][^"']*(?:email|content|body|wrapper|container)[^"']*["'][^>]*>([\s\S]*)<\/(?:div|article|main|table)>/i
  )
  if (contentMatch) {
    return contentMatch[1]
  }

  return body
}

let newslettersCache: Newsletter[] | null = null

export async function fetchNewsletters(): Promise<Newsletter[]> {
  if (newslettersCache) return newslettersCache

  const token = import.meta.env.MAILERLITE_API_KEY
  if (!token) {
    console.warn('MAILERLITE_API_KEY not configured')
    return []
  }

  try {
    const res = await fetch(
      `${MAILERLITE_API}/campaigns?filter[status]=sent&filter[type]=regular&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )

    if (!res.ok) {
      console.error('MailerLite API error:', res.status)
      return []
    }

    const { data } = await res.json()
    if (!data || !Array.isArray(data)) return []

    const newsletters: (Newsletter | null)[] = await Promise.all(
      data.map(async (campaign: any): Promise<Newsletter | null> => {
        const email = campaign.emails?.[0]
        if (!email) return null

        let htmlContent = ''
        if (email.preview_url) {
          try {
            const previewRes = await fetch(email.preview_url)
            const fullHtml = await previewRes.text()
            htmlContent = cleanHtmlContent(extractNewsletterBody(fullHtml)) || ''
          } catch {
            htmlContent = ''
          }
        }

        return {
          id: String(campaign.id),
          name: campaign.name || email.subject || '',
          subject: email.subject || '',
          html_content: htmlContent,
          sent_at: campaign.finished_at || campaign.scheduled_for || campaign.created_at || '',
          screenshot_url: email.screenshot_url || '',
          preview_url: email.preview_url || '',
          stats: email.stats,
        } as Newsletter
      })
    )

    const valid: Newsletter[] = newsletters.filter(
      (n): n is Newsletter => n !== null
    )

    valid.sort(
      (a, b) =>
        new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
    )

    newslettersCache = valid
    return valid
  } catch (error) {
    console.error('Failed to fetch newsletters:', error)
    return []
  }
}

export async function getNewsletters(): Promise<Newsletter[]> {
  return fetchNewsletters()
}
