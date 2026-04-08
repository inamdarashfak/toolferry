'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  getHealthHighlightSx,
} from '../../lib/calculator'

type UnitMode = 'metric' | 'imperial'

const DEFAULT_VALUES = {
  unitMode: 'metric' as UnitMode,
  heightCm: '170',
  weightKg: '68',
  heightFeet: '5',
  heightInches: '7',
  weightLb: '150',
}

function sanitizeNumericInput(value: string, allowDecimal = false) {
  const sanitized = value.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, '')

  if (!allowDecimal) {
    return sanitized
  }

  const [integerPart, ...decimalParts] = sanitized.split('.')

  if (decimalParts.length === 0) {
    return sanitized
  }

  return `${integerPart}.${decimalParts.join('')}`
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) {
    return 'Underweight'
  }

  if (bmi < 25) {
    return 'Normal weight'
  }

  if (bmi < 30) {
    return 'Overweight'
  }

  return 'Obesity'
}

function BmiCalculator() {
  const [unitMode, setUnitMode] = useState<UnitMode>(DEFAULT_VALUES.unitMode)
  const [heightCm, setHeightCm] = useState(DEFAULT_VALUES.heightCm)
  const [weightKg, setWeightKg] = useState(DEFAULT_VALUES.weightKg)
  const [heightFeet, setHeightFeet] = useState(DEFAULT_VALUES.heightFeet)
  const [heightInches, setHeightInches] = useState(DEFAULT_VALUES.heightInches)
  const [weightLb, setWeightLb] = useState(DEFAULT_VALUES.weightLb)

  const result = useMemo(() => {
    if (unitMode === 'metric') {
      const heightInCentimeters = Number(heightCm) || 0
      const weightInKilograms = Number(weightKg) || 0

      if (heightInCentimeters <= 0 || weightInKilograms <= 0) {
        return {
          error: 'Enter valid height and weight to calculate BMI.',
          bmi: null,
          category: '',
        }
      }

      const heightInMeters = heightInCentimeters / 100
      const bmi = weightInKilograms / (heightInMeters * heightInMeters)

      return {
        error: '',
        bmi,
        category: getBmiCategory(bmi),
      }
    }

    const feet = Number(heightFeet) || 0
    const inches = Number(heightInches) || 0
    const pounds = Number(weightLb) || 0
    const totalInches = feet * 12 + inches

    if (totalInches <= 0 || pounds <= 0) {
      return {
        error: 'Enter valid height and weight to calculate BMI.',
        bmi: null,
        category: '',
      }
    }

    const bmi = (pounds / (totalInches * totalInches)) * 703

    return {
      error: '',
      bmi,
      category: getBmiCategory(bmi),
    }
  }, [heightCm, heightFeet, heightInches, unitMode, weightKg, weightLb])

  const handleReset = () => {
    setUnitMode(DEFAULT_VALUES.unitMode)
    setHeightCm(DEFAULT_VALUES.heightCm)
    setWeightKg(DEFAULT_VALUES.weightKg)
    setHeightFeet(DEFAULT_VALUES.heightFeet)
    setHeightInches(DEFAULT_VALUES.heightInches)
    setWeightLb(DEFAULT_VALUES.weightLb)
  }

  const bmiSeverity =
    result.category === 'Obesity'
      ? 'critical'
      : result.category === 'Overweight'
        ? 'attention'
        : 'normal'

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
                BMI Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Calculate body mass index from your height and weight and check
              the standard BMI category instantly.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Unit System"
                    value={unitMode}
                    onChange={(event) =>
                      setUnitMode(event.target.value as UnitMode)
                    }
                  >
                    <MenuItem value="metric">Metric (cm, kg)</MenuItem>
                    <MenuItem value="imperial">Imperial (ft, in, lb)</MenuItem>
                  </TextField>

                  {unitMode === 'metric' ? (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        label="Height (cm)"
                        value={heightCm}
                        onChange={(event) =>
                          setHeightCm(
                            sanitizeNumericInput(event.target.value, true)
                          )
                        }
                      />

                      <TextField
                        fullWidth
                        size="small"
                        label="Weight (kg)"
                        value={weightKg}
                        onChange={(event) =>
                          setWeightKg(
                            sanitizeNumericInput(event.target.value, true)
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        label="Height (feet)"
                        value={heightFeet}
                        onChange={(event) =>
                          setHeightFeet(
                            sanitizeNumericInput(event.target.value)
                          )
                        }
                      />

                      <TextField
                        fullWidth
                        size="small"
                        label="Height (inches)"
                        value={heightInches}
                        onChange={(event) =>
                          setHeightInches(
                            sanitizeNumericInput(event.target.value)
                          )
                        }
                      />

                      <TextField
                        fullWidth
                        size="small"
                        label="Weight (lb)"
                        value={weightLb}
                        onChange={(event) =>
                          setWeightLb(
                            sanitizeNumericInput(event.target.value, true)
                          )
                        }
                      />
                    </>
                  )}

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
                      BMI Result
                    </Typography>
                  </Box>

                  {result.bmi ? (
                    <>
                      <Stack spacing={0.75}>
                        <Typography
                          sx={(theme) => ({
                            fontSize: { xs: '2rem', md: '2.4rem' },
                            lineHeight: 1.05,
                            ...getHealthHighlightSx(theme, bmiSeverity),
                          })}
                        >
                          {result.bmi.toFixed(1)}
                        </Typography>
                        <Typography color="text.secondary">
                          Body Mass Index
                        </Typography>
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Category</Typography>
                        <Typography
                          sx={(theme) =>
                            getHealthHighlightSx(theme, bmiSeverity)
                          }
                        >
                          {result.category}
                        </Typography>
                      </Stack>

                      <Typography
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        BMI is a general screening measure and should not be
                        treated as a medical diagnosis on its own.
                      </Typography>
                    </>
                  ) : (
                    <Typography color="text.secondary">
                      {result.error}
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

export default BmiCalculator
