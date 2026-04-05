import type { MetadataRoute } from 'next'
import { toolCategories } from '../data/toolCategories'
import { tools } from '../data/tools'
import { SITE_URL } from '../lib/site'

function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/contact-us', '/privacy-policy'].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }))

  const categoryRoutes = toolCategories.map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  const toolRoutes = tools.map((tool) => ({
    url: `${SITE_URL}/tool/${tool.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes]
}

export default sitemap
