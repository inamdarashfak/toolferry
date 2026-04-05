'use client'

import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import type { ToolCategory } from '../../data/toolCategories'

type CategoryCardProps = {
  category: ToolCategory
  toolCount: number
}

function CategoryCard({ category, toolCount }: CategoryCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid rgba(11, 31, 51, 0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,250,0.94) 100%)',
        boxShadow: '0 14px 30px rgba(11, 31, 51, 0.045)',
      }}
    >
      <CardActionArea
        component={Link}
        href={`/category/${category.slug}`}
        sx={{
          height: '100%',
          alignItems: 'stretch',
          '&:hover .category-arrow': {
            transform: 'translate(2px, -2px)',
            color: 'secondary.main',
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, sm: 2.5 } }}>
          <Stack spacing={1.25} sx={{ height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" spacing={1.5}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {category.name}
              </Typography>
              <ArrowOutwardRoundedIcon
                className="category-arrow"
                color="action"
                sx={{ transition: 'transform 180ms ease, color 180ms ease' }}
              />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
              {category.description}
            </Typography>
            <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 700 }}>
              {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default CategoryCard
