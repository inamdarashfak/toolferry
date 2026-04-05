import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/site'

function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

export default robots
