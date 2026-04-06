import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '../../../components/seo/JsonLd'
import ToolPage from '../../../components/ToolPage/ToolPage'
import { relatedTools } from '../../../data/relatedTools'
import { toolCategoryMap } from '../../../data/toolCategories'
import { toolHelpContent } from '../../../data/toolHelpContent'
import { toolSeoContent } from '../../../data/toolSeoContent'
import { tools } from '../../../data/tools'
import { buildCanonicalUrl } from '../../../lib/site'
import { buildPageMetadata } from '../../../lib/seo'

type ToolPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params
  const selectedTool = tools.find((tool) => tool.slug === slug)

  if (!selectedTool) {
    return buildPageMetadata({
      title: 'Tool Not Found',
      description: 'The requested tool page does not exist on ToolFerry.',
      path: '/404',
      robots: {
        index: false,
        follow: false,
      },
    })
  }

  return buildPageMetadata({
    title: selectedTool.name,
    description: selectedTool.metaDescription,
    path: `/tool/${selectedTool.slug}`,
  })
}

async function ToolRoutePage({ params }: ToolPageProps) {
  const { slug } = await params
  const selectedTool = tools.find((tool) => tool.slug === slug)

  if (!selectedTool) {
    notFound()
  }

  const category = toolCategoryMap[selectedTool.categorySlug]
  const seoContent = toolSeoContent[selectedTool.slug]
  const faqSchema = seoContent.faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seoContent.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: selectedTool.name,
            description: selectedTool.metaDescription,
            url: buildCanonicalUrl(`/tool/${selectedTool.slug}`),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: selectedTool.name,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: selectedTool.metaDescription,
            url: buildCanonicalUrl(`/tool/${selectedTool.slug}`),
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
                name: category?.name ?? 'Tools',
                item: buildCanonicalUrl(
                  category ? `/category/${category.slug}` : '/',
                ),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: selectedTool.name,
                item: buildCanonicalUrl(`/tool/${selectedTool.slug}`),
              },
            ],
          },
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />
      <ToolPage
        tool={selectedTool}
        helpContent={toolHelpContent[selectedTool.slug]}
        faqs={seoContent.faqs}
        relatedToolSlugs={relatedTools[selectedTool.slug] ?? []}
      />
    </>
  )
}

export default ToolRoutePage
