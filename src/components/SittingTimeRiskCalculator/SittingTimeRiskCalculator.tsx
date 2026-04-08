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

const DEFAULT_SITTING_HOURS = '8'

function getRiskProfile(hours: number) {
  if (hours < 4) {
    return {
      riskLevel: 'Low',
      standEveryMinutes: 60,
      note: 'Current sitting time is on the lighter side, but regular movement still helps.',
    }
  }

  if (hours < 8) {
    return {
      riskLevel: 'Moderate',
      standEveryMinutes: 45,
      note: 'Breaking up longer seated stretches can help reduce daily sedentary load.',
    }
  }

  if (hours < 11) {
    return {
      riskLevel: 'High',
      standEveryMinutes: 30,
      note: 'Long daily sitting time may benefit from more frequent standing and walking breaks.',
    }
  }

  return {
    riskLevel: 'Very High',
    standEveryMinutes: 20,
    note: 'Very long sitting time deserves more frequent interruptions and movement throughout the day.',
  }
}

function SittingTimeRiskCalculator() {
  const [sittingHours, setSittingHours] = useState(DEFAULT_SITTING_HOURS)

  const result = useMemo(() => {
    const hours = Number(sittingHours) || 0

    if (sittingHours === '' || hours <= 0 || hours > 24) {
      return {
        hasValidInput: false,
        message:
          'Enter a valid sitting-time value between 0 and 24 hours per day.',
        riskLevel: '',
        standEveryMinutes: 0,
        note: '',
      }
    }

    return {
      hasValidInput: true,
      message: '',
      ...getRiskProfile(hours),
    }
  }, [sittingHours])

  const handleReset = () => {
    setSittingHours(DEFAULT_SITTING_HOURS)
  }

  const riskSeverity =
    result.riskLevel === 'Very High'
      ? 'critical'
      : result.riskLevel === 'High' || result.riskLevel === 'Moderate'
        ? 'attention'
        : 'normal'
  const standEverySeverity =
    result.standEveryMinutes <= 20
      ? 'critical'
      : result.standEveryMinutes <= 30
        ? 'attention'
        : 'normal'
  const sittingShareOfWakingDay = Math.min(
    100,
    ((Number(sittingHours) || 0) / 16) * 100
  )
  const yearlySittingDays = ((Number(sittingHours) || 0) * 365) / 24

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
                Sitting Time Risk Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Estimate a simple sedentary risk band from daily sitting time and
              get a suggested stand-up reminder interval.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Sitting Time Per Day (hours)"
                    value={sittingHours}
                    onChange={(event) =>
                      setSittingHours(
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
                      Sedentary Snapshot
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
                          Health Risk Level
                        </Typography>
                        <Typography
                          sx={(theme) =>
                            getHealthHighlightSx(theme, riskSeverity)
                          }
                        >
                          {result.riskLevel}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Stand Every
                        </Typography>
                        <Typography
                          sx={(theme) =>
                            getHealthHighlightSx(theme, standEverySeverity)
                          }
                        >
                          {formatNumber(result.standEveryMinutes, 'en-US', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          mins
                        </Typography>
                      </Stack>
                      <Typography color="text.secondary">
                        {result.note}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: '0.92rem' }}
                      >
                        This is a simple wellness estimate and should not be
                        treated as a diagnosis or medical risk score.
                      </Typography>

                      <Stack spacing={1.1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          😮 Relatable Comparison
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          That adds up to about{' '}
                          {formatNumber(yearlySittingDays, 'en-US')} full days a
                          year spent sitting.
                        </Typography>
                        <Typography color="text.secondary">
                          You are seated for roughly{' '}
                          {formatNumber(sittingShareOfWakingDay, 'en-US')}% of a
                          16-hour waking day.
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
                              Sitting share of waking day
                            </Typography>
                            <Typography sx={{ fontWeight: 700 }}>
                              {formatNumber(sittingShareOfWakingDay, 'en-US')}%
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
                                width: `${sittingShareOfWakingDay}%`,
                                height: '100%',
                                background:
                                  riskSeverity === 'critical'
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
                            ...getHealthHighlightSx(theme, riskSeverity),
                            lineHeight: 1.55,
                          })}
                        >
                          At this pace, your body is spending nearly{' '}
                          {formatNumber(yearlySittingDays, 'en-US')} full days a
                          year in a chair.
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

export default SittingTimeRiskCalculator
