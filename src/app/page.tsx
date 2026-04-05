import JsonLd from '../components/seo/JsonLd'
import { buildPageMetadata } from '../lib/seo'
import { SITE_NAME, SITE_URL } from '../lib/site'
import Home from '../pageViews/Home/Home'

export const metadata = buildPageMetadata({
  title: 'Productivity Tools',
  path: '/',
})

function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description:
            'ToolFerry is a clean productivity tools hub for calculators, converters, and text utilities.',
        }}
      />
      <Home />
    </>
  )
}

export default HomePage
