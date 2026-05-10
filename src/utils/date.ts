export function formatHebrewDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
