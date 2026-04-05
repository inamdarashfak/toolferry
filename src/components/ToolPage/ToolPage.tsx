'use client'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, type ReactNode } from 'react'
import Container from '../Container/Container'
import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav'
import RelatedToolsSection from '../RelatedToolsSection/RelatedToolsSection'
import ToolFaqSection from '../ToolFaqSection/ToolFaqSection'
import ToolHelpSection from '../ToolHelpSection/ToolHelpSection'
import { relatedTools } from '../../data/relatedTools'
import { toolCategoryMap } from '../../data/toolCategories'
import type { ToolHelpContent } from '../../data/toolHelpContent'
import type { ToolSeoContent } from '../../data/toolSeoContent'
import { tools } from '../../data/tools'
import { trackEvent } from '../../lib/analytics'
import type { Tool } from '../../types/tool'

const EmiCalculator = dynamic(() => import('../EmiCalculator/EmiCalculator'), {
  loading: () => <CalculatorFallback />,
})
const FdCalculator = dynamic(() => import('../FdCalculator/FdCalculator'), {
  loading: () => <CalculatorFallback />,
})
const MutualFundCalculator = dynamic(() => import('../MutualFundCalculator/MutualFundCalculator'), {
  loading: () => <CalculatorFallback />,
})
const GoalCalculator = dynamic(() => import('../GoalCalculator/GoalCalculator'), {
  loading: () => <CalculatorFallback />,
})
const GstCalculator = dynamic(() => import('../GstCalculator/GstCalculator'), {
  loading: () => <CalculatorFallback />,
})
const UnitConverter = dynamic(() => import('../UnitConverter/UnitConverter'), {
  loading: () => <CalculatorFallback />,
})
const TextFormatter = dynamic(() => import('../TextFormatter/TextFormatter'), {
  loading: () => <CalculatorFallback />,
})
const JsonViewer = dynamic(() => import('../JsonViewer/JsonViewer'), {
  loading: () => <CalculatorFallback />,
})
const AgeCalculator = dynamic(() => import('../AgeCalculator/AgeCalculator'), {
  loading: () => <CalculatorFallback />,
})
const PregnancyDueDateCalculator = dynamic(
  () => import('../PregnancyDueDateCalculator/PregnancyDueDateCalculator'),
  {
    loading: () => <CalculatorFallback />,
  },
)

type ToolPageProps = {
  tool: Tool
  helpContent: ToolHelpContent
  seoContent: ToolSeoContent
  relatedToolSlugs: string[]
}

function CalculatorFallback() {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 0,
        border: '1px solid rgba(11, 31, 51, 0.08)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,250,250,0.95) 100%)',
        boxShadow: '0 16px 40px rgba(11, 31, 51, 0.05)',
      }}
    >
      <Typography color="text.secondary">Loading calculator...</Typography>
    </Paper>
  )
}

function ToolPage({ tool, helpContent, seoContent, relatedToolSlugs }: ToolPageProps) {
  useEffect(() => {
    trackEvent('tool_open', {
      tool_slug: tool.slug,
      tool_name: tool.name,
    })
  }, [tool.name, tool.slug])

  const selectedRelatedTools = relatedToolSlugs
    .map((slug) => tools.find((item) => item.slug === slug))
    .filter((item): item is Tool => Boolean(item))
  const category = toolCategoryMap[tool.categorySlug]

  let toolContent: ReactNode | null = null

  if (tool.slug === 'emi-calculator') {
    toolContent = <EmiCalculator />
  } else if (tool.slug === 'fd-interest-calculator') {
    toolContent = <FdCalculator />
  } else if (tool.slug === 'mutual-fund-returns-calculator') {
    toolContent = <MutualFundCalculator />
  } else if (tool.slug === 'goal-calculator') {
    toolContent = <GoalCalculator />
  } else if (tool.slug === 'unit-converter') {
    toolContent = <UnitConverter />
  } else if (tool.slug === 'gst-calculator') {
    toolContent = <GstCalculator />
  } else if (tool.slug === 'text-formatter') {
    toolContent = <TextFormatter />
  } else if (tool.slug === 'json-viewer') {
    toolContent = <JsonViewer />
  } else if (tool.slug === 'age-calculator') {
    toolContent = <AgeCalculator />
  } else if (tool.slug === 'pregnancy-due-date-calculator') {
    toolContent = <PregnancyDueDateCalculator />
  }

  return (
    <Container>
      <Stack spacing={4}>
        <Box>
          <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
            Back to all tools
          </Button>
        </Box>

        <Paper
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 0,
            border: '1px solid rgba(11, 31, 51, 0.08)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,250,250,0.96) 100%)',
            boxShadow: '0 14px 30px rgba(11, 31, 51, 0.045)',
          }}
        >
          <Stack spacing={1.5}>
            <BreadcrumbNav
              items={[
                { label: 'Home', href: '/' },
                ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
                { label: tool.name },
              ]}
            />
            <Chip
              label={seoContent.category}
              sx={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(15, 139, 141, 0.08)',
                color: 'secondary.main',
              }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              {tool.name}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 840, lineHeight: 1.75 }}>
              {seoContent.intro}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 840, lineHeight: 1.75 }}>
              {seoContent.audience}
            </Typography>
            <Grid container spacing={1.25}>
              {seoContent.highlights.map((highlight) => (
                <Grid key={highlight} size={{ xs: 12, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 0,
                      height: '100%',
                      borderColor: 'rgba(11, 31, 51, 0.08)',
                      backgroundColor: 'rgba(255,255,255,0.72)',
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                      {highlight}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            {category && (
              <Box>
                <Button component={Link} href={`/category/${category.slug}`} variant="outlined">
                  Explore more {category.name.toLowerCase()}
                </Button>
              </Box>
            )}
          </Stack>
        </Paper>

        {toolContent}

        <ToolHelpSection content={helpContent} />

        <ToolFaqSection faqs={seoContent.faqs} />

        <RelatedToolsSection tools={selectedRelatedTools} />
      </Stack>
    </Container>
  )
}

export default ToolPage
