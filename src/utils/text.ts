export function cleanHtmlContent(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}