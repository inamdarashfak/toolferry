import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CategoryPage from '../../../components/CategoryPage/CategoryPage'
import JsonLd from '../../../components/seo/JsonLd'
import { toolCategories, toolCategoryMap } from '../../../data/toolCategories'
import { tools } from '../../../data/tools'
import { buildPageMetadata } from '../../../lib/seo'
import { buildCanonicalUrl } from '../../../lib/site'

type CategoryRoutePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return toolCategories.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: CategoryRoutePageProps): Promise<Metadata> {
  const { slug } = await params
  const category = toolCategoryMap[slug]

  if (!category) {
    return buildPageMetadata({
      title: 'Category Not Found',
      description: 'The requested tool category does not exist on ToolFerry.',
      path: '/404',
      robots: {
        index: false,
        follow: false,
      },
    })
  }

  return buildPageMetadata({
    title: category.name,
    description: category.metaDescription,
    path: `/category/${category.slug}`,
  })
}

async function CategoryRoutePage({ params }: CategoryRoutePageProps) {
  const { slug } = await params
  const category = toolCategoryMap[slug]

  if (!category) {
    notFound()
  }

  const categoryTools = tools.filter((tool) => tool.categorySlug === category.slug)

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: category.name,
            description: category.metaDescription,
            url: buildCanonicalUrl(`/category/${category.slug}`),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: buildCanonicalUrl('/'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: category.name,
                item: buildCanonicalUrl(`/category/${category.slug}`),
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: categoryTools.map((tool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: buildCanonicalUrl(`/tool/${tool.slug}`),
              name: tool.name,
            })),
          },
        ]}
      />
      <CategoryPage category={category} tools={categoryTools} />
    </>
  )
}

export default CategoryRoutePage
