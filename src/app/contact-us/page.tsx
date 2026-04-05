import JsonLd from '../../components/seo/JsonLd'
import { buildPageMetadata } from '../../lib/seo'
import { buildCanonicalUrl } from '../../lib/site'
import ContactUs from '../../pageViews/ContactUs/ContactUs'

export const metadata = buildPageMetadata({
  title: 'Contact Us',
  description:
    'Contact ToolFerry for feedback, issue reports, partnerships, or general questions about the site and its tools.',
  path: '/contact-us',
})

function ContactUsPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Us',
          description:
            'Contact ToolFerry for feedback, issue reports, partnerships, or general questions about the site and its tools.',
          url: buildCanonicalUrl('/contact-us'),
        }}
      />
      <ContactUs />
    </>
  )
}

export default ContactUsPage
