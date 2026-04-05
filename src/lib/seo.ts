import type { Metadata } from 'next'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, buildCanonicalUrl } from './site'

type MetadataInput = {
  title: string
  description?: string
  path?: string
  robots?: Metadata['robots']
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  robots,
}: MetadataInput): Metadata {
  const canonical = buildCanonicalUrl(path)
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}
