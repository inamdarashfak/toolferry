'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { initAnalytics, trackPageView } from '../../lib/analytics'

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!measurementId || !pathname) {
      return
    }

    initAnalytics()

    const search = searchParams?.toString() ?? ''
    const path = search ? `${pathname}?${search}` : pathname

    trackPageView(path)
  }, [pathname, searchParams])

  if (!measurementId) {
    return null
  }

  return (
    <Script
      id="google-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  )
}

export default AnalyticsTracker
