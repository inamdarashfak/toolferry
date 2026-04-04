const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

let isInitialized = false

function isAnalyticsEnabled() {
  return Boolean(MEASUREMENT_ID)
}

export function initAnalytics() {
  if (!isAnalyticsEnabled() || isInitialized || typeof window === 'undefined') {
    return
  }

  const existingScript = document.querySelector(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"]`,
  )

  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
  })

  isInitialized = true
}

export function trackPageView(path: string) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') {
    return
  }

  initAnalytics()
  window.gtag?.('config', MEASUREMENT_ID, {
    page_path: path,
  })
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined') {
    return
  }

  initAnalytics()
  window.gtag?.('event', name, params)
}
