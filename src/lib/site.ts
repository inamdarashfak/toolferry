export const SITE_NAME = 'ToolFerry'
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://toolferry.com'
export const DEFAULT_DESCRIPTION =
  'ToolFerry is a clean productivity tools hub for calculators, converters, and text utilities.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/toolferry-logo.png`

export function buildCanonicalUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${SITE_URL}${normalizedPath}`
}
