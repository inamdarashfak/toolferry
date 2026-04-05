'use client'

import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'

type BreadcrumbNavProps = {
  items: Array<{
    label: string
    href?: string
  }>
}

function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <Breadcrumbs
      separator={<NavigateNextRoundedIcon sx={{ fontSize: '1rem' }} />}
      aria-label="breadcrumb"
    >
      {items.map((item, index) =>
        item.href && index < items.length - 1 ? (
          <Link
            key={`${item.label}-${item.href}`}
            component={NextLink}
            href={item.href}
            color="text.secondary"
            underline="hover"
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={item.label} color="text.primary" sx={{ fontWeight: 600 }}>
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  )
}

export default BreadcrumbNav
