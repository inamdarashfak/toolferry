import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import AnalyticsTracker from '../components/AnalyticsTracker/AnalyticsTracker'
import LayoutShell from '../components/LayoutShell/LayoutShell'
import Providers from '../components/Providers/Providers'
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Productivity Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: ['/favicon.svg'],
  },
}

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('theme-mode');
                  var system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var mode = stored === 'light' || stored === 'dark' ? stored : system;
                  document.documentElement.dataset.themeMode = mode;
                  document.documentElement.style.colorScheme = mode;
                } catch (error) {
                  document.documentElement.dataset.themeMode = 'light';
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
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
