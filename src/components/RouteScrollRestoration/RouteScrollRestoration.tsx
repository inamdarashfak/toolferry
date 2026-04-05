'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

function RouteScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default RouteScrollRestoration
