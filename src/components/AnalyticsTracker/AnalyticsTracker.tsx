'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { getAnalyticsMeasurementId, trackPageView } from '../../lib/analytics'

const measurementId = getAnalyticsMeasurementId()

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId || !pathname) {
      return
    }

    const search = searchParams?.toString() ?? ''
    const path = search ? `${pathname}?${search}` : pathname

    trackPageView(path)
  }, [pathname, searchParams])

  if (!measurementId) {
    return null
  }

  return (
    <>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          `,
        }}
      />
    </>
  )
}

export default AnalyticsTracker
