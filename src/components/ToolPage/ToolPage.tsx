'use client'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import dynamic from 'next/dynamic'
import { useEffect, type ReactNode } from 'react'
import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav'
import Container from '../Container/Container'
import RelatedToolsSection from '../RelatedToolsSection/RelatedToolsSection'
import ToolFaqSection from '../ToolFaqSection/ToolFaqSection'
import ToolHelpSection from '../ToolHelpSection/ToolHelpSection'
import ToolShareMenu from '../ToolShareMenu/ToolShareMenu'
import { toolCategoryMap } from '../../data/toolCategories'
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
const PpfCalculator = dynamic(() => import('../PpfCalculator/PpfCalculator'), {
  loading: () => <CalculatorFallback />,
})
const MutualFundCalculator = dynamic(
  () => import('../MutualFundCalculator/MutualFundCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const CagrCalculator = dynamic(
  () => import('../CagrCalculator/CagrCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const SwpCalculator = dynamic(() => import('../SwpCalculator/SwpCalculator'), {
  loading: () => <CalculatorFallback />,
})
const StepUpSipCalculator = dynamic(
  () => import('../StepUpSipCalculator/StepUpSipCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const XirrCalculator = dynamic(
  () => import('../XirrCalculator/XirrCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const EmergencyFundRunwayCalculator = dynamic(
  () =>
    import('../EmergencyFundRunwayCalculator/EmergencyFundRunwayCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const DebtPayoffPlanner = dynamic(
  () => import('../DebtPayoffPlanner/DebtPayoffPlanner'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const GoalCalculator = dynamic(
  () => import('../GoalCalculator/GoalCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const InvoiceGenerator = dynamic(
  () => import('../InvoiceGenerator/InvoiceGenerator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const GstCalculator = dynamic(() => import('../GstCalculator/GstCalculator'), {
  loading: () => <CalculatorFallback />,
})
const PercentageCalculator = dynamic(
  () => import('../PercentageCalculator/PercentageCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const DiscountCalculator = dynamic(
  () => import('../DiscountCalculator/DiscountCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const SubscriptionCostCalculator = dynamic(
  () => import('../SubscriptionCostCalculator/SubscriptionCostCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const CanIAffordThisCalculator = dynamic(
  () => import('../CanIAffordThisCalculator/CanIAffordThisCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const AddictionPriceCalculator = dynamic(
  () => import('../AddictionPriceCalculator/AddictionPriceCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const DecisionMakerWheel = dynamic(
  () => import('../DecisionMakerWheel/DecisionMakerWheel'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const CoinToss = dynamic(() => import('../CoinToss/CoinToss'), {
  loading: () => <CalculatorFallback />,
})
const UnitConverter = dynamic(() => import('../UnitConverter/UnitConverter'), {
  loading: () => <CalculatorFallback />,
})
const CurrencyConverter = dynamic(
  () => import('../CurrencyConverter/CurrencyConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const TimeZoneConverter = dynamic(
  () => import('../TimeZoneConverter/TimeZoneConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const ColorConverter = dynamic(
  () => import('../ColorConverter/ColorConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const NumberToWordsConverter = dynamic(
  () => import('../NumberToWordsConverter/NumberToWordsConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const TextFormatter = dynamic(() => import('../TextFormatter/TextFormatter'), {
  loading: () => <CalculatorFallback />,
})
const PasswordGenerator = dynamic(
  () => import('../PasswordGenerator/PasswordGenerator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const QrCodeGenerator = dynamic(
  () => import('../QrCodeGenerator/QrCodeGenerator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const Base64EncoderDecoder = dynamic(
  () => import('../Base64EncoderDecoder/Base64EncoderDecoder'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const UrlEncoderDecoder = dynamic(
  () => import('../UrlEncoderDecoder/UrlEncoderDecoder'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const UuidGeneratorValidator = dynamic(
  () => import('../UuidGeneratorValidator/UuidGeneratorValidator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const JwtDecoder = dynamic(() => import('../JwtDecoder/JwtDecoder'), {
  loading: () => <CalculatorFallback />,
})
const JsonViewer = dynamic(() => import('../JsonViewer/JsonViewer'), {
  loading: () => <CalculatorFallback />,
})
const CsvToJsonConverter = dynamic(
  () => import('../CsvToJsonConverter/CsvToJsonConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const JsonToCsvConverter = dynamic(
  () => import('../JsonToCsvConverter/JsonToCsvConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const BaseNumberConverter = dynamic(
  () => import('../BaseNumberConverter/BaseNumberConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const TimestampConverter = dynamic(
  () => import('../TimestampConverter/TimestampConverter'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const AgeCalculator = dynamic(() => import('../AgeCalculator/AgeCalculator'), {
  loading: () => <CalculatorFallback />,
})
const DateDifferenceCalculator = dynamic(
  () => import('../DateDifferenceCalculator/DateDifferenceCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const BusinessDaysCalculator = dynamic(
  () => import('../BusinessDaysCalculator/BusinessDaysCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const WeekendLeftCalculator = dynamic(
  () => import('../WeekendLeftCalculator/WeekendLeftCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const ImageResizerCompressor = dynamic(
  () => import('../ImageResizerCompressor/ImageResizerCompressor'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const BmiCalculator = dynamic(() => import('../BmiCalculator/BmiCalculator'), {
  loading: () => <CalculatorFallback />,
})
const ScreenTimeImpactCalculator = dynamic(
  () => import('../ScreenTimeImpactCalculator/ScreenTimeImpactCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const SittingTimeRiskCalculator = dynamic(
  () => import('../SittingTimeRiskCalculator/SittingTimeRiskCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const HeartRateZoneCalculator = dynamic(
  () => import('../HeartRateZoneCalculator/HeartRateZoneCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const BiologicalAgeCalculator = dynamic(
  () => import('../BiologicalAgeCalculator/BiologicalAgeCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
)
const PregnancyDueDateCalculator = dynamic(
  () => import('../PregnancyDueDateCalculator/PregnancyDueDateCalculator'),
  {
    loading: () => <CalculatorFallback />,
  }
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
      sx={(theme) => ({
        p: { xs: 3, md: 5 },
        borderRadius: 0,
        border: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(18,29,44,0.98) 0%, rgba(12,20,32,0.96) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(247,250,250,0.95) 100%)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 18px 36px rgba(0, 0, 0, 0.24)'
            : '0 16px 40px rgba(11, 31, 51, 0.05)',
      })}
    >
      <Typography color="text.secondary">Loading calculator...</Typography>
    </Paper>
  )
}

function ToolPage({
  tool,
  helpContent,
  faqs = [],
  relatedToolSlugs,
}: ToolPageProps) {
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
  } else if (tool.slug === 'ppf-calculator') {
    toolContent = <PpfCalculator />
  } else if (tool.slug === 'mutual-fund-returns-calculator') {
    toolContent = <MutualFundCalculator />
  } else if (tool.slug === 'cagr-calculator') {
    toolContent = <CagrCalculator />
  } else if (tool.slug === 'swp-calculator') {
    toolContent = <SwpCalculator />
  } else if (tool.slug === 'step-up-sip-calculator') {
    toolContent = <StepUpSipCalculator />
  } else if (tool.slug === 'xirr-calculator') {
    toolContent = <XirrCalculator />
  } else if (tool.slug === 'emergency-fund-runway-calculator') {
    toolContent = <EmergencyFundRunwayCalculator />
  } else if (tool.slug === 'debt-payoff-planner') {
    toolContent = <DebtPayoffPlanner />
  } else if (tool.slug === 'goal-calculator') {
    toolContent = <GoalCalculator />
  } else if (tool.slug === 'invoice-generator') {
    toolContent = <InvoiceGenerator />
  } else if (tool.slug === 'unit-converter') {
    toolContent = <UnitConverter />
  } else if (tool.slug === 'currency-converter') {
    toolContent = <CurrencyConverter />
  } else if (tool.slug === 'time-zone-converter') {
    toolContent = <TimeZoneConverter />
  } else if (tool.slug === 'color-converter') {
    toolContent = <ColorConverter />
  } else if (tool.slug === 'number-to-words-converter') {
    toolContent = <NumberToWordsConverter />
  } else if (tool.slug === 'gst-calculator') {
    toolContent = <GstCalculator />
  } else if (tool.slug === 'percentage-calculator') {
    toolContent = <PercentageCalculator />
  } else if (tool.slug === 'discount-calculator') {
    toolContent = <DiscountCalculator />
  } else if (tool.slug === 'subscription-cost-calculator') {
    toolContent = <SubscriptionCostCalculator />
  } else if (tool.slug === 'can-i-afford-this-calculator') {
    toolContent = <CanIAffordThisCalculator />
  } else if (tool.slug === 'addiction-price-calculator') {
    toolContent = <AddictionPriceCalculator />
  } else if (tool.slug === 'decision-maker-spin-the-wheel') {
    toolContent = <DecisionMakerWheel />
  } else if (tool.slug === 'coin-toss-heads-or-tails') {
    toolContent = <CoinToss />
  } else if (tool.slug === 'text-formatter') {
    toolContent = <TextFormatter />
  } else if (tool.slug === 'password-generator') {
    toolContent = <PasswordGenerator />
  } else if (tool.slug === 'qr-code-generator') {
    toolContent = <QrCodeGenerator />
  } else if (tool.slug === 'image-resizer-compressor') {
    toolContent = <ImageResizerCompressor />
  } else if (tool.slug === 'base64-encode-decode') {
    toolContent = <Base64EncoderDecoder />
  } else if (tool.slug === 'url-encoder-decoder') {
    toolContent = <UrlEncoderDecoder />
  } else if (tool.slug === 'uuid-generator-validator') {
    toolContent = <UuidGeneratorValidator />
  } else if (tool.slug === 'jwt-decoder') {
    toolContent = <JwtDecoder />
  } else if (tool.slug === 'json-viewer') {
    toolContent = <JsonViewer />
  } else if (tool.slug === 'csv-to-json-converter') {
    toolContent = <CsvToJsonConverter />
  } else if (tool.slug === 'json-to-csv-converter') {
    toolContent = <JsonToCsvConverter />
  } else if (tool.slug === 'base-number-converter') {
    toolContent = <BaseNumberConverter />
  } else if (tool.slug === 'timestamp-converter') {
    toolContent = <TimestampConverter />
  } else if (tool.slug === 'age-calculator') {
    toolContent = <AgeCalculator />
  } else if (tool.slug === 'date-difference-calculator') {
    toolContent = <DateDifferenceCalculator />
  } else if (tool.slug === 'business-days-calculator') {
    toolContent = <BusinessDaysCalculator />
  } else if (tool.slug === 'weekend-left-calculator') {
    toolContent = <WeekendLeftCalculator />
  } else if (tool.slug === 'bmi-calculator') {
    toolContent = <BmiCalculator />
  } else if (tool.slug === 'screen-time-impact-calculator') {
    toolContent = <ScreenTimeImpactCalculator />
  } else if (tool.slug === 'sitting-time-risk-calculator') {
    toolContent = <SittingTimeRiskCalculator />
  } else if (tool.slug === 'heart-rate-zone-calculator') {
    toolContent = <HeartRateZoneCalculator />
  } else if (tool.slug === 'biological-age-calculator') {
    toolContent = <BiologicalAgeCalculator />
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

        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            ...(category
              ? [{ label: category.name, href: `/category/${category.slug}` }]
              : []),
            { label: tool.name },
          ]}
        />

        <Stack spacing={1.25}>
          <Box data-tool-download-root>{toolContent}</Box>
          <ToolShareMenu
            toolName={tool.name}
            toolSlug={tool.slug}
            toolDescription={tool.description}
            shareTextOverride={
              tool.slug === 'biological-age-calculator'
                ? 'Just checked my biological age on Tool Ferry 😲 Curious what yours looks like?'
                : undefined
            }
          />
        </Stack>

        <ToolHelpSection content={helpContent} />

        <ToolFaqSection faqs={faqs} />

        <RelatedToolsSection tools={selectedRelatedTools} />
      </Stack>
    </Container>
  )
}

export default ToolPage
