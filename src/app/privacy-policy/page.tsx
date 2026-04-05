import JsonLd from '../../components/seo/JsonLd'
import { buildPageMetadata } from '../../lib/seo'
import { buildCanonicalUrl } from '../../lib/site'
import PrivacyPolicy from '../../pageViews/PrivacyPolicy/PrivacyPolicy'

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'Read the ToolFerry privacy policy to understand what information may be collected, how it is used, and your available choices.',
  path: '/privacy-policy',
})

function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy',
          description:
            'Read the ToolFerry privacy policy to understand what information may be collected, how it is used, and your available choices.',
          url: buildCanonicalUrl('/privacy-policy'),
        }}
      />
      <PrivacyPolicy />
    </>
  )
}

export default PrivacyPolicyPage
