'use client'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, type ReactNode } from 'react'
import Container from '../Container/Container'
import RelatedToolsSection from '../RelatedToolsSection/RelatedToolsSection'
import ToolFaqSection from '../ToolFaqSection/ToolFaqSection'
import ToolHelpSection from '../ToolHelpSection/ToolHelpSection'
import type { ToolHelpContent } from '../../data/toolHelpContent'
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
  faqs?: Array<{
    question: string
    answer: string
  }>
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

function ToolPage({ tool, helpContent, faqs = [], relatedToolSlugs }: ToolPageProps) {
  useEffect(() => {
    trackEvent('tool_open', {
      tool_slug: tool.slug,
      tool_name: tool.name,
    })
  }, [tool.name, tool.slug])

  const selectedRelatedTools = relatedToolSlugs
    .map((slug) => tools.find((item) => item.slug === slug))
    .filter((item): item is Tool => Boolean(item))

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
      <Stack
        spacing={{ xs: 4, md: 3 }}
        sx={{
          overflowX: 'clip',
          '& .MuiGrid-container': {
            width: 'auto',
            margin: 0,
          },
        }}
      >
        <Box
          component="h1"
          sx={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            p: 0,
            m: -1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {tool.name}
        </Box>

        <Box>
          <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />}>
            Back to all tools
          </Button>
        </Box>

        {toolContent}

        <ToolHelpSection content={helpContent} />

        <ToolFaqSection faqs={faqs} />

        <RelatedToolsSection tools={selectedRelatedTools} />
      </Stack>
    </Container>
  )
}

export default ToolPage
