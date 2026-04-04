import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Suspense, lazy, useEffect } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Container from '../../components/Container/Container'
import { tools } from '../../data/tools'
import { trackEvent } from '../../lib/analytics'

const EmiCalculator = lazy(() => import('../../components/EmiCalculator/EmiCalculator'))
const FdCalculator = lazy(() => import('../../components/FdCalculator/FdCalculator'))
const MutualFundCalculator = lazy(
  () => import('../../components/MutualFundCalculator/MutualFundCalculator'),
)
const GstCalculator = lazy(() => import('../../components/GstCalculator/GstCalculator'))
const UnitConverter = lazy(() => import('../../components/UnitConverter/UnitConverter'))
const TextFormatter = lazy(() => import('../../components/TextFormatter/TextFormatter'))
const JsonViewer = lazy(() => import('../../components/JsonViewer/JsonViewer'))
const AgeCalculator = lazy(() => import('../../components/AgeCalculator/AgeCalculator'))
const PregnancyDueDateCalculator = lazy(
  () => import('../../components/PregnancyDueDateCalculator/PregnancyDueDateCalculator'),
)

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

function Tool() {
  const { toolName } = useParams()
  const selectedTool = tools.find((tool) => tool.slug === toolName)

  useEffect(() => {
    const title = selectedTool ? `${selectedTool.name} | ToolFerry` : 'Tool Not Found | ToolFerry'
    document.title = title
  }, [selectedTool])

  useEffect(() => {
    if (!selectedTool) {
      return
    }

    trackEvent('tool_open', {
      tool_slug: selectedTool.slug,
      tool_name: selectedTool.name,
    })
  }, [selectedTool])

  if (!selectedTool) {
    return (
      <Container>
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
          <Stack spacing={2}>
            <Typography variant="h4">Tool not found</Typography>
            <Typography color="text.secondary">
              The requested tool page does not exist yet.
            </Typography>
            <Box>
              <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
                Back to home
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    )
  }

  if (selectedTool.slug === 'emi-calculator') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense
            fallback={<CalculatorFallback />}
          >
            <EmiCalculator />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'fd-interest-calculator') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <FdCalculator />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'mutual-fund-returns-calculator') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <MutualFundCalculator />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'unit-converter') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <UnitConverter />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'gst-calculator') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <GstCalculator />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'text-formatter') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <TextFormatter />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'json-viewer') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <JsonViewer />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'age-calculator') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <AgeCalculator />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  if (selectedTool.slug === 'pregnancy-due-date-calculator') {
    return (
      <Container>
        <Stack spacing={4}>
          <Box>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
              Back to all tools
            </Button>
          </Box>

          <Suspense fallback={<CalculatorFallback />}>
            <PregnancyDueDateCalculator />
          </Suspense>
        </Stack>
      </Container>
    )
  }

  return (
    <Container>
      <Stack spacing={4}>
        <Box>
          <Button component={RouterLink} to="/" startIcon={<ArrowBackRoundedIcon />}>
            Back to all tools
          </Button>
        </Box>

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
          <Stack spacing={3}>
            <Chip
              label="Placeholder"
              sx={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(15, 139, 141, 0.08)',
                color: 'secondary.main',
                fontWeight: 700,
              }}
            />
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              {selectedTool.name}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 680, lineHeight: 1.8 }}>
              {selectedTool.description}
            </Typography>
            <Box
              sx={{
                borderRadius: 0,
                border: '1px dashed rgba(11, 31, 51, 0.16)',
                backgroundColor: 'rgba(255, 255, 255, 0.78)',
                p: { xs: 3, md: 4 },
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                This page is reserved for the upcoming {selectedTool.name.toLowerCase()}.
                The calculator or formatter UI will be added in a later iteration.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}

export default Tool
