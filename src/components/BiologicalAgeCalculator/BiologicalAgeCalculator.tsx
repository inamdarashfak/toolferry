'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useRef, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  getHealthHighlightSx,
  sanitizeNumericInput,
} from '../../lib/calculator'

type UnitMode = 'metric' | 'imperial'
type Sex = 'female' | 'male'
type SmokingStatus = 'no' | 'former' | 'yes'
type ExerciseLevel = 'low' | 'moderate' | 'high'
type AlcoholLevel = 'low' | 'moderate' | 'high'
type StressLevel = 'low' | 'moderate' | 'high'

type InsightDirection = 'younger' | 'older'

type Insight = {
  label: string
  years: number
  direction: InsightDirection
}

type BiologicalAgeFormValues = {
  age: string
  sex: Sex
  unitMode: UnitMode
  heightCm: string
  weightKg: string
  heightFeet: string
  heightInches: string
  weightLb: string
  smokingStatus: SmokingStatus
  exerciseLevel: ExerciseLevel
  sleepHours: string
  alcoholLevel: AlcoholLevel
  stressLevel: StressLevel
}

const DEFAULT_VALUES = {
  age: '',
  sex: 'male' as Sex,
  unitMode: 'metric' as UnitMode,
  heightCm: '',
  weightKg: '',
  heightFeet: '',
  heightInches: '',
  weightLb: '',
  smokingStatus: 'no' as SmokingStatus,
  exerciseLevel: 'moderate' as ExerciseLevel,
  sleepHours: '',
  alcoholLevel: 'low' as AlcoholLevel,
  stressLevel: 'moderate' as StressLevel,
}

function getBmi(heightInMeters: number, weightInKilograms: number) {
  if (heightInMeters <= 0 || weightInKilograms <= 0) {
    return null
  }

  return weightInKilograms / (heightInMeters * heightInMeters)
}

function getWeightMetrics(
  unitMode: UnitMode,
  heightCm: string,
  weightKg: string,
  heightFeet: string,
  heightInches: string,
  weightLb: string
) {
  if (unitMode === 'metric') {
    const metricHeight = Number(heightCm) || 0
    const metricWeight = Number(weightKg) || 0

    if (metricHeight <= 0 || metricWeight <= 0) {
      return null
    }

    return {
      heightInMeters: metricHeight / 100,
      weightInKilograms: metricWeight,
    }
  }

  const feet = Number(heightFeet) || 0
  const inches = Number(heightInches) || 0
  const pounds = Number(weightLb) || 0
  const totalInches = feet * 12 + inches

  if (totalInches <= 0 || pounds <= 0) {
    return null
  }

  return {
    heightInMeters: totalInches * 0.0254,
    weightInKilograms: pounds * 0.45359237,
  }
}

function getBmiAdjustment(bmi: number) {
  if (bmi < 18.5) {
    return {
      years: 1.5,
      direction: 'older' as const,
      label: 'Lower-than-typical BMI range',
    }
  }

  if (bmi < 25) {
    return {
      years: 1.5,
      direction: 'younger' as const,
      label: 'Balanced BMI range',
    }
  }

  if (bmi < 30) {
    return {
      years: 1.5,
      direction: 'older' as const,
      label: 'Higher BMI range',
    }
  }

  return {
    years: 3,
    direction: 'older' as const,
    label: 'Obesity-range BMI',
  }
}

function getSmokingAdjustment(smokingStatus: SmokingStatus) {
  if (smokingStatus === 'no') {
    return {
      years: 2,
      direction: 'younger' as const,
      label: 'Non-smoking status',
    }
  }

  if (smokingStatus === 'former') {
    return {
      years: 1,
      direction: 'older' as const,
      label: 'Former smoking history',
    }
  }

  return {
    years: 4,
    direction: 'older' as const,
    label: 'Current smoking habit',
  }
}

function getExerciseAdjustment(exerciseLevel: ExerciseLevel) {
  if (exerciseLevel === 'high') {
    return {
      years: 2.5,
      direction: 'younger' as const,
      label: 'Strong exercise routine',
    }
  }

  if (exerciseLevel === 'moderate') {
    return {
      years: 1,
      direction: 'younger' as const,
      label: 'Moderate weekly exercise',
    }
  }

  return {
    years: 2,
    direction: 'older' as const,
    label: 'Low exercise frequency',
  }
}

function getSleepAdjustment(sleepHours: number) {
  if (sleepHours >= 7 && sleepHours <= 8.5) {
    return {
      years: 1.5,
      direction: 'younger' as const,
      label: 'Supportive sleep range',
    }
  }

  if (sleepHours >= 6 && sleepHours < 7) {
    return {
      years: 1,
      direction: 'older' as const,
      label: 'Slightly short sleep',
    }
  }

  if (sleepHours < 6) {
    return {
      years: 2.5,
      direction: 'older' as const,
      label: 'Short sleep pattern',
    }
  }

  return {
    years: 1,
    direction: 'older' as const,
    label: 'Long sleep pattern',
  }
}

function getAlcoholAdjustment(alcoholLevel: AlcoholLevel) {
  if (alcoholLevel === 'low') {
    return {
      years: 0.5,
      direction: 'younger' as const,
      label: 'Low alcohol intake',
    }
  }

  if (alcoholLevel === 'moderate') {
    return {
      years: 0.5,
      direction: 'older' as const,
      label: 'Moderate alcohol intake',
    }
  }

  return {
    years: 2,
    direction: 'older' as const,
    label: 'High alcohol intake',
  }
}

function getStressAdjustment(stressLevel: StressLevel) {
  if (stressLevel === 'low') {
    return {
      years: 1.5,
      direction: 'younger' as const,
      label: 'Low daily stress',
    }
  }

  if (stressLevel === 'moderate') {
    return {
      years: 0,
      direction: 'older' as const,
      label: 'Moderate daily stress',
    }
  }

  return {
    years: 2.5,
    direction: 'older' as const,
    label: 'High daily stress',
  }
}

function getSexAdjustment(sex: Sex) {
  if (sex === 'female') {
    return {
      years: 0.5,
      direction: 'younger' as const,
      label: 'Female baseline adjustment',
    }
  }

  return {
    years: 0,
    direction: 'older' as const,
    label: 'Male baseline adjustment',
  }
}

function buildInsightSummary(insights: Insight[]) {
  const olderFactors = insights.filter(
    (insight) => insight.direction === 'older' && insight.years > 0
  )
  const youngerFactors = insights.filter(
    (insight) => insight.direction === 'younger' && insight.years > 0
  )

  return {
    olderFactors,
    youngerFactors,
  }
}

function BiologicalAgeCalculator() {
  const [age, setAge] = useState(DEFAULT_VALUES.age)
  const [sex, setSex] = useState<Sex>(DEFAULT_VALUES.sex)
  const [unitMode, setUnitMode] = useState<UnitMode>(DEFAULT_VALUES.unitMode)
  const [heightCm, setHeightCm] = useState(DEFAULT_VALUES.heightCm)
  const [weightKg, setWeightKg] = useState(DEFAULT_VALUES.weightKg)
  const [heightFeet, setHeightFeet] = useState(DEFAULT_VALUES.heightFeet)
  const [heightInches, setHeightInches] = useState(DEFAULT_VALUES.heightInches)
  const [weightLb, setWeightLb] = useState(DEFAULT_VALUES.weightLb)
  const [smokingStatus, setSmokingStatus] = useState<SmokingStatus>(
    DEFAULT_VALUES.smokingStatus
  )
  const [exerciseLevel, setExerciseLevel] = useState<ExerciseLevel>(
    DEFAULT_VALUES.exerciseLevel
  )
  const [sleepHours, setSleepHours] = useState(DEFAULT_VALUES.sleepHours)
  const [alcoholLevel, setAlcoholLevel] = useState<AlcoholLevel>(
    DEFAULT_VALUES.alcoholLevel
  )
  const [stressLevel, setStressLevel] = useState<StressLevel>(
    DEFAULT_VALUES.stressLevel
  )
  const [submittedValues, setSubmittedValues] =
    useState<BiologicalAgeFormValues>(DEFAULT_VALUES)
  const [isCalculating, setIsCalculating] = useState(false)
  const calculationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  const result = useMemo(() => {
    const chronologicalAge = Number(submittedValues.age) || 0
    const sleep = Number(submittedValues.sleepHours) || 0
    const bodyMetrics = getWeightMetrics(
      submittedValues.unitMode,
      submittedValues.heightCm,
      submittedValues.weightKg,
      submittedValues.heightFeet,
      submittedValues.heightInches,
      submittedValues.weightLb
    )

    if (chronologicalAge < 18 || chronologicalAge > 100) {
      return {
        error: 'Enter an age between 18 and 100 for this wellness estimate.',
        biologicalAge: null,
        bmi: null,
        gap: 0,
        insights: [] as Insight[],
      }
    }

    if (!bodyMetrics) {
      return {
        error: 'Enter valid height and weight values to continue.',
        biologicalAge: null,
        bmi: null,
        gap: 0,
        insights: [] as Insight[],
      }
    }

    if (sleep <= 0 || sleep > 16) {
      return {
        error: 'Enter a realistic average sleep duration in hours.',
        biologicalAge: null,
        bmi: null,
        gap: 0,
        insights: [] as Insight[],
      }
    }

    const bmi = getBmi(
      bodyMetrics.heightInMeters,
      bodyMetrics.weightInKilograms
    )

    if (!bmi) {
      return {
        error: 'Unable to calculate BMI from the values entered.',
        biologicalAge: null,
        bmi: null,
        gap: 0,
        insights: [] as Insight[],
      }
    }

    const insights: Insight[] = [
      getSexAdjustment(submittedValues.sex),
      getBmiAdjustment(bmi),
      getSmokingAdjustment(submittedValues.smokingStatus),
      getExerciseAdjustment(submittedValues.exerciseLevel),
      getSleepAdjustment(sleep),
      getAlcoholAdjustment(submittedValues.alcoholLevel),
      getStressAdjustment(submittedValues.stressLevel),
    ]

    const totalAdjustment = insights.reduce((sum, insight) => {
      return (
        sum + (insight.direction === 'older' ? insight.years : -insight.years)
      )
    }, 0)

    const rawBiologicalAge = chronologicalAge + totalAdjustment
    const biologicalAge = Math.max(
      18,
      Math.min(
        chronologicalAge + 15,
        Math.max(chronologicalAge - 15, rawBiologicalAge)
      )
    )

    return {
      error: '',
      biologicalAge,
      bmi,
      gap: biologicalAge - chronologicalAge,
      insights,
    }
  }, [submittedValues])

  const insightSummary = useMemo(
    () => buildInsightSummary(result.insights),
    [result.insights]
  )

  useEffect(() => {
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current)
      }
    }
  }, [])

  const handleCalculate = () => {
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current)
    }

    const nextSubmittedValues = {
      age,
      sex,
      unitMode,
      heightCm,
      weightKg,
      heightFeet,
      heightInches,
      weightLb,
      smokingStatus,
      exerciseLevel,
      sleepHours,
      alcoholLevel,
      stressLevel,
    }

    setIsCalculating(true)
    calculationTimeoutRef.current = setTimeout(() => {
      setSubmittedValues(nextSubmittedValues)
      setIsCalculating(false)
      calculationTimeoutRef.current = null
    }, 3800)
  }

  const handleReset = () => {
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current)
      calculationTimeoutRef.current = null
    }

    setAge(DEFAULT_VALUES.age)
    setSex(DEFAULT_VALUES.sex)
    setUnitMode(DEFAULT_VALUES.unitMode)
    setHeightCm(DEFAULT_VALUES.heightCm)
    setWeightKg(DEFAULT_VALUES.weightKg)
    setHeightFeet(DEFAULT_VALUES.heightFeet)
    setHeightInches(DEFAULT_VALUES.heightInches)
    setWeightLb(DEFAULT_VALUES.weightLb)
    setSmokingStatus(DEFAULT_VALUES.smokingStatus)
    setExerciseLevel(DEFAULT_VALUES.exerciseLevel)
    setSleepHours(DEFAULT_VALUES.sleepHours)
    setAlcoholLevel(DEFAULT_VALUES.alcoholLevel)
    setStressLevel(DEFAULT_VALUES.stressLevel)
    setSubmittedValues(DEFAULT_VALUES)
    setIsCalculating(false)
  }

  const ageGapSeverity =
    (result.gap ?? 0) >= 5
      ? 'critical'
      : (result.gap ?? 0) > 0
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
                Biological Age Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Estimate a wellness-based biological age using your actual age,
              body measurements, and a few everyday habit inputs.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Chronological Age"
                    value={age}
                    onChange={(event) =>
                      setAge(sanitizeNumericInput(event.target.value))
                    }
                  />

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Sex"
                    value={sex}
                    onChange={(event) => setSex(event.target.value as Sex)}
                  >
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                  </TextField>

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

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Smoking Status"
                    value={smokingStatus}
                    onChange={(event) =>
                      setSmokingStatus(event.target.value as SmokingStatus)
                    }
                  >
                    <MenuItem value="no">Non-smoker</MenuItem>
                    <MenuItem value="former">Former smoker</MenuItem>
                    <MenuItem value="yes">Current smoker</MenuItem>
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Exercise Frequency"
                    value={exerciseLevel}
                    onChange={(event) =>
                      setExerciseLevel(event.target.value as ExerciseLevel)
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label="Average Sleep (hours)"
                    value={sleepHours}
                    onChange={(event) =>
                      setSleepHours(
                        sanitizeNumericInput(event.target.value, true)
                      )
                    }
                  />

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Alcohol Intake"
                    value={alcoholLevel}
                    onChange={(event) =>
                      setAlcoholLevel(event.target.value as AlcoholLevel)
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Stress Level"
                    value={stressLevel}
                    onChange={(event) =>
                      setStressLevel(event.target.value as StressLevel)
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      sx={{ borderRadius: 0 }}
                    >
                      {isCalculating ? 'Calculating...' : 'Calculate'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      disabled={isCalculating}
                      sx={{ borderRadius: 0 }}
                    >
                      Reset
                    </Button>
                  </Stack>
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
                      Biological Age Estimate
                    </Typography>
                  </Box>

                  {isCalculating ? (
                    <Stack
                      spacing={1.25}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ minHeight: 320, textAlign: 'center' }}
                    >
                      <CircularProgress size={30} color="secondary" />
                      <Typography sx={{ fontWeight: 700 }}>
                        Calculating your biological age...
                      </Typography>
                      <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
                        Reviewing body metrics, sleep, stress, and lifestyle
                        factors.
                      </Typography>
                    </Stack>
                  ) : result.biologicalAge !== null ? (
                    <>
                      <Stack spacing={0.75}>
                        <Typography
                          sx={{
                            fontSize: { xs: '2rem', md: '2.4rem' },
                            fontWeight: 700,
                            lineHeight: 1.05,
                          }}
                        >
                          {formatNumber(result.biologicalAge, 'en-US', {
                            maximumFractionDigits: 1,
                          })}{' '}
                          years
                        </Typography>
                        <Typography color="text.secondary">
                          Estimated biological age from lifestyle and body
                          metrics.
                        </Typography>
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Chronological Age
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {submittedValues.age} years
                        </Typography>
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Age Gap</Typography>
                        <Typography
                          sx={(theme) =>
                            getHealthHighlightSx(theme, ageGapSeverity)
                          }
                        >
                          {result.gap > 0
                            ? `${formatNumber(result.gap, 'en-US')} years older`
                            : result.gap < 0
                              ? `${formatNumber(Math.abs(result.gap), 'en-US')} years younger`
                              : 'Close to your actual age'}
                        </Typography>
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Calculated BMI
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.bmi ?? 0, 'en-US')}
                        </Typography>
                      </Stack>

                      <Stack spacing={1}>
                        <Typography color="text.secondary">
                          What is helping
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {insightSummary.youngerFactors.length > 0 ? (
                            insightSummary.youngerFactors.map((insight) => (
                              <Chip
                                key={insight.label}
                                label={`${insight.label} (-${formatNumber(insight.years, 'en-US')}y)`}
                                color="success"
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Typography
                              color="text.secondary"
                              sx={{ fontSize: '0.95rem' }}
                            >
                              No strong younger-driving factors in this
                              scenario.
                            </Typography>
                          )}
                        </Stack>
                      </Stack>

                      <Stack spacing={1}>
                        <Typography color="text.secondary">
                          What is pushing older
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {insightSummary.olderFactors.length > 0 ? (
                            insightSummary.olderFactors.map((insight) => (
                              <Chip
                                key={insight.label}
                                label={`${insight.label} (+${formatNumber(insight.years, 'en-US')}y)`}
                                color="warning"
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Typography
                              color="text.secondary"
                              sx={{ fontSize: '0.95rem' }}
                            >
                              No strong older-driving factors in this scenario.
                            </Typography>
                          )}
                        </Stack>
                      </Stack>

                      <Typography
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        This is a non-medical wellness estimate intended for
                        educational use. It should not be treated as a
                        diagnostic or clinical age assessment.
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

export default BiologicalAgeCalculator
