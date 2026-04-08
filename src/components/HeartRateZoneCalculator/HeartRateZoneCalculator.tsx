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

const DEFAULT_AGE = '30'

function getZoneRange(
  maxHeartRate: number,
  minRatio: number,
  maxRatio: number
) {
  return {
    min: Math.round(maxHeartRate * minRatio),
    max: Math.round(maxHeartRate * maxRatio),
  }
}

function HeartRateZoneCalculator() {
  const [age, setAge] = useState(DEFAULT_AGE)

  const result = useMemo(() => {
    const ageValue = Number(age) || 0

    if (age === '' || ageValue <= 0 || ageValue > 120) {
      return {
        hasValidInput: false,
        message:
          'Enter a valid age between 1 and 120 to estimate heart-rate zones.',
        maxHeartRate: 0,
        fatBurn: { min: 0, max: 0 },
        cardio: { min: 0, max: 0 },
        peak: { min: 0, max: 0 },
      }
    }

    const maxHeartRate = 220 - ageValue

    return {
      hasValidInput: true,
      message: '',
      maxHeartRate,
      fatBurn: getZoneRange(maxHeartRate, 0.5, 0.7),
      cardio: getZoneRange(maxHeartRate, 0.7, 0.85),
      peak: getZoneRange(maxHeartRate, 0.85, 0.95),
    }
  }, [age])

  const handleReset = () => {
    setAge(DEFAULT_AGE)
  }

  const cardioSpan = result.cardio.max - result.cardio.min
  const zoneTrackWidth = result.maxHeartRate > 0 ? result.maxHeartRate : 1

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
                Heart Rate Zone Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Estimate max heart rate and common training zones from age using
              the standard 220 minus age method.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Age"
                    value={age}
                    onChange={(event) =>
                      setAge(sanitizeNumericInput(event.target.value))
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
                      Training Zones
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
                          Estimated Max Heart Rate
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.maxHeartRate, 'en-US', {
                            maximumFractionDigits: 0,
                          })}{' '}
                          bpm
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Fat Burn Zone
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.fatBurn.min}-{result.fatBurn.max} bpm
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Cardio Zone
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.cardio.min}-{result.cardio.max} bpm
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Peak Zone
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.peak.min}-{result.peak.max} bpm
                        </Typography>
                      </Stack>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: '0.92rem' }}
                      >
                        These are simplified training estimates and should not
                        replace personalized guidance from a coach or clinician.
                      </Typography>

                      <Stack spacing={1.1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          😮 Relatable Comparison
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          Your cardio zone starts around {result.cardio.min}{' '}
                          bpm, and your peak effort begins around{' '}
                          {result.peak.min} bpm.
                        </Typography>
                        <Typography color="text.secondary">
                          That gives you about a{' '}
                          {formatNumber(cardioSpan, 'en-US', {
                            maximumFractionDigits: 0,
                          })}
                          -bpm cardio working range before peak intensity kicks
                          in.
                        </Typography>
                      </Stack>

                      <Stack spacing={1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          📊 Visual Insight
                        </Typography>
                        <Stack spacing={0.8}>
                          <Stack spacing={0.35}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              spacing={1}
                            >
                              <Typography color="text.secondary">
                                Fat Burn
                              </Typography>
                              <Typography sx={{ fontWeight: 700 }}>
                                {result.fatBurn.min}-{result.fatBurn.max} bpm
                              </Typography>
                            </Stack>
                            <Box
                              sx={(theme) => ({
                                height: 10,
                                border: `1px solid ${theme.palette.divider}`,
                              })}
                            >
                              <Box
                                sx={(theme) => ({
                                  ml: `${(result.fatBurn.min / zoneTrackWidth) * 100}%`,
                                  width: `${((result.fatBurn.max - result.fatBurn.min) / zoneTrackWidth) * 100}%`,
                                  height: '100%',
                                  backgroundColor: alpha(
                                    theme.palette.secondary.main,
                                    0.85
                                  ),
                                })}
                              />
                            </Box>
                          </Stack>
                          <Stack spacing={0.35}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              spacing={1}
                            >
                              <Typography color="text.secondary">
                                Cardio
                              </Typography>
                              <Typography sx={{ fontWeight: 700 }}>
                                {result.cardio.min}-{result.cardio.max} bpm
                              </Typography>
                            </Stack>
                            <Box
                              sx={(theme) => ({
                                height: 10,
                                border: `1px solid ${theme.palette.divider}`,
                              })}
                            >
                              <Box
                                sx={(theme) => ({
                                  ml: `${(result.cardio.min / zoneTrackWidth) * 100}%`,
                                  width: `${((result.cardio.max - result.cardio.min) / zoneTrackWidth) * 100}%`,
                                  height: '100%',
                                  backgroundColor: alpha(
                                    theme.palette.warning.main,
                                    0.9
                                  ),
                                })}
                              />
                            </Box>
                          </Stack>
                          <Stack spacing={0.35}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              spacing={1}
                            >
                              <Typography color="text.secondary">
                                Peak
                              </Typography>
                              <Typography sx={{ fontWeight: 700 }}>
                                {result.peak.min}-{result.peak.max} bpm
                              </Typography>
                            </Stack>
                            <Box
                              sx={(theme) => ({
                                height: 10,
                                border: `1px solid ${theme.palette.divider}`,
                              })}
                            >
                              <Box
                                sx={(theme) => ({
                                  ml: `${(result.peak.min / zoneTrackWidth) * 100}%`,
                                  width: `${((result.peak.max - result.peak.min) / zoneTrackWidth) * 100}%`,
                                  height: '100%',
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.88
                                  ),
                                })}
                              />
                            </Box>
                          </Stack>
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
                            ...getHealthHighlightSx(theme, 'attention'),
                            lineHeight: 1.55,
                          })}
                        >
                          Once you cross {result.peak.min} bpm, you are no
                          longer in “easy cardio” territory. You are pushing
                          close to your ceiling.
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

export default HeartRateZoneCalculator
