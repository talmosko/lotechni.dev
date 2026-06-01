/**
 * Cleans HTML content by removing unwanted elements and normalizing spacing
 * such as <br> tags, while preserving them before links.
 * @param html The HTML content to clean
 * @returns The cleaned HTML content (still valid HTML)
 */
export function cleanHtmlContent(html?: string) {
  if (!html) return html

  return (
    html
      // Replace <br> tags before links with a special marker
      .replace(/(<br\s*\/?>\s*)(<a\s)/g, '___PRESERVE_BR___$2')
      // Remove all other <br> tags
      .replace(/<br\s*\/?>/g, '')
      // Remove multiple consecutive whitespaces
      .replace(/\s+/g, ' ')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Restore preserved <br> tags
      .replace(/___PRESERVE_BR___/g, '<br>')
      .trim()
  )
}

/**
 * Strips all HTML tags from a string, returning plain text only.
 * Useful for displaying HTML content in plain text contexts
 * (e.g. closed/collapsed card descriptions).
 * @param html The HTML content to strip
 * @returns The plain text content without any HTML tags
 */
export function stripHtmlTags(html?: string) {
  if (!html) return html
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}
