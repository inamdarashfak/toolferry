'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  getHealthHighlightSx,
  sanitizeNumericInput,
} from '../../lib/calculator'

const DEFAULT_DAILY_SCREEN_TIME = '6'
const PRODUCTIVITY_LOSS_RATIO = 0.35

function ScreenTimeImpactCalculator() {
  const [dailyScreenTime, setDailyScreenTime] = useState(
    DEFAULT_DAILY_SCREEN_TIME
  )

  const result = useMemo(() => {
    const dailyHours = Number(dailyScreenTime) || 0

    if (dailyScreenTime === '' || dailyHours <= 0 || dailyHours > 24) {
      return {
        hasValidInput: false,
        message:
          'Enter a valid average daily screen-time value between 0 and 24 hours.',
        yearlyHours: 0,
        yearlyDays: 0,
        productivityLossHours: 0,
      }
    }

    const yearlyHours = dailyHours * 365
    const yearlyDays = yearlyHours / 24
    const productivityLossHours = yearlyHours * PRODUCTIVITY_LOSS_RATIO

    return {
      hasValidInput: true,
      message: '',
      yearlyHours,
      yearlyDays,
      productivityLossHours,
    }
  }, [dailyScreenTime])

  const handleReset = () => {
    setDailyScreenTime(DEFAULT_DAILY_SCREEN_TIME)
  }

  const yearlyHoursSeverity =
    result.yearlyHours >= 3000
      ? 'critical'
      : result.yearlyHours >= 1800
        ? 'attention'
        : 'normal'
  const productivitySeverity =
    result.productivityLossHours >= 1000
      ? 'critical'
      : result.productivityLossHours >= 500
        ? 'attention'
        : 'normal'
  const wakingDayShare = Math.min(
    100,
    ((Number(dailyScreenTime) || 0) / 16) * 100
  )
  const lostWorkWeeks = result.productivityLossHours / 40

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 0.75 }}
            >
              <Typography
                variant="h3"
                sx={{ fontSize: { xs: '1.55rem', md: '1.8rem' } }}
              >
                Screen Time Impact Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Translate average daily screen time into yearly hours, full days,
              and a simple potential productivity-loss estimate.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Daily Screen Time (hours)"
                    value={dailyScreenTime}
                    onChange={(event) =>
                      setDailyScreenTime(
                        sanitizeNumericInput(event.target.value, true)
                      )
                    }
                  />

                  <Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      sx={{ borderRadius: 0 }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                sx={(theme) => ({
                  ...getCalculatorPanelSx(theme),
                  minHeight: '100%',
                })}
              >
                <Stack spacing={1.5} divider={<Divider flexItem />}>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Impact Snapshot
                    </Typography>
                  </Box>

                  {result.hasValidInput ? (
                    <>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Yearly Screen Hours
                        </Typography>
                        <Typography
                          sx={(theme) =>
                            getHealthHighlightSx(theme, yearlyHoursSeverity)
                          }
                        >
                          {formatNumber(result.yearlyHours, 'en-US')} hrs
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Equivalent Full Days Per Year
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.yearlyDays, 'en-US')} days
                        </Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="text.secondary">
                          Potential Productivity Loss
                        </Typography>
                        <Typography
                          sx={(theme) =>
                            getHealthHighlightSx(theme, productivitySeverity)
                          }
                        >
                          {formatNumber(result.productivityLossHours, 'en-US')}{' '}
                          hrs/year
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: '0.92rem' }}
                        >
                          This uses a simple estimate and should be treated as a
                          lifestyle prompt, not a clinical or workplace
                          assessment.
                        </Typography>
                      </Stack>

                      <Stack spacing={1.1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          😮 Relatable Comparison
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          That is like{' '}
                          {formatNumber(result.yearlyDays, 'en-US')} full days a
                          year spent in front of a screen.
                        </Typography>
                        <Typography color="text.secondary">
                          Your potential productivity loss is roughly{' '}
                          {formatNumber(lostWorkWeeks, 'en-US')} 40-hour work
                          weeks a year.
                        </Typography>
                      </Stack>

                      <Stack spacing={1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          📊 Visual Insight
                        </Typography>
                        <Stack spacing={0.55}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={1}
                          >
                            <Typography color="text.secondary">
                              Share of a 16-hour waking day
                            </Typography>
                            <Typography sx={{ fontWeight: 700 }}>
                              {formatNumber(wakingDayShare, 'en-US')}%
                            </Typography>
                          </Stack>
                          <Box
                            sx={(theme) => ({
                              height: 12,
                              borderRadius: 0,
                              overflow: 'hidden',
                              border: `1px solid ${theme.palette.divider}`,
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255,255,255,0.06)'
                                  : 'rgba(11,31,51,0.06)',
                            })}
                          >
                            <Box
                              sx={(theme) => ({
                                width: `${wakingDayShare}%`,
                                height: '100%',
                                background:
                                  productivitySeverity === 'critical'
                                    ? `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.error.main} 100%)`
                                    : `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${alpha(
                                        theme.palette.warning.main,
                                        0.92
                                      )} 100%)`,
                              })}
                            />
                          </Box>
                        </Stack>
                      </Stack>

                      <Stack spacing={1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          🧠 Oh Shit Moment
                        </Typography>
                        <Typography
                          sx={(theme) => ({
                            ...getHealthHighlightSx(
                              theme,
                              productivitySeverity
                            ),
                            lineHeight: 1.55,
                          })}
                        >
                          At this pace, you are giving up about{' '}
                          {formatNumber(result.productivityLossHours, 'en-US')}{' '}
                          hours a year to screen drift alone.
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      {result.message}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default ScreenTimeImpactCalculator
