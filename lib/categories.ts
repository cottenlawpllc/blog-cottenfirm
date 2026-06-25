// Shared category slug helper — single source of truth for /category/[slug] routing.
export function categorySlug(name: string | null | undefined): string {
  return (name || 'general')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
