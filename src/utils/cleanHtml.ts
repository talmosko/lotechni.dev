/**
 * Cleans HTML content by removing unwanted elements and normalizing spacing
 * such as <br> tags, while preserving them before links.
 * @param html The HTML content to clean
 * @returns The cleaned HTML content
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
