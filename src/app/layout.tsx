import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import AnalyticsTracker from '../components/AnalyticsTracker/AnalyticsTracker'
import LayoutShell from '../components/LayoutShell/LayoutShell'
import Providers from '../components/Providers/Providers'
import { DEFAULT_DESCRIPTION, SITE_NAME } from '../lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://toolferry.vercel.app'),
  title: {
    default: `${SITE_NAME} | Productivity Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
}

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
