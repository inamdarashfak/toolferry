'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  currencyOptions,
  detectDefaultCurrency,
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
  useAnimatedNumber,
} from '../../lib/calculator'
import { preserveFormattedNumberCaret } from '../../lib/formattedNumericInput'

type UsageFrequency = 'perDay' | 'perWeek'
type SavingsHorizon = '1month' | '6months' | '1year'

const DEFAULT_VALUES = {
  costPerUnit: '18',
  unitsUsed: '4',
  unitLabel: 'cigarettes',
  usageFrequency: 'perDay' as UsageFrequency,
  savingsHorizon: '1year' as SavingsHorizon,
}

function getHorizonDays(horizon: SavingsHorizon) {
  if (horizon === '1month') {
    return 30
  }

  if (horizon === '6months') {
    return 182
  }

  return 365
}

function getHorizonLabel(horizon: SavingsHorizon) {
  if (horizon === '1month') {
    return '1 Month'
  }

  if (horizon === '6months') {
    return '6 Months'
  }

  return '1 Year'
}

function AddictionPriceCalculator() {
  const [costPerUnit, setCostPerUnit] = useState(DEFAULT_VALUES.costPerUnit)
  const [unitsUsed, setUnitsUsed] = useState(DEFAULT_VALUES.unitsUsed)
  const [unitLabel, setUnitLabel] = useState(DEFAULT_VALUES.unitLabel)
  const [usageFrequency, setUsageFrequency] = useState<UsageFrequency>(
    DEFAULT_VALUES.usageFrequency
  )
  const [savingsHorizon, setSavingsHorizon] = useState<SavingsHorizon>(
    DEFAULT_VALUES.savingsHorizon
  )
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code)

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale

  const costPerUnitValue = Number(costPerUnit) || 0
  const unitsUsedValue = Number(unitsUsed) || 0

  const result = useMemo(() => {
    if (costPerUnitValue < 0 || unitsUsedValue < 0) {
      return {
        hasValidInput: false,
        message: 'Enter valid non-negative values for price and usage.',
        dailySpend: 0,
        monthlySpend: 0,
        yearlySpend: 0,
        fiveYearSpend: 0,
        horizonSavings: 0,
      }
    }

    const dailyUnits =
      usageFrequency === 'perDay' ? unitsUsedValue : unitsUsedValue / 7
    const dailySpend = dailyUnits * costPerUnitValue
    const monthlySpend = dailySpend * 30
    const yearlySpend = dailySpend * 365
    const fiveYearSpend = yearlySpend * 5
    const horizonSavings = dailySpend * getHorizonDays(savingsHorizon)

    return {
      hasValidInput: true,
      message: '',
      dailySpend,
      monthlySpend,
      yearlySpend,
      fiveYearSpend,
      horizonSavings,
    }
  }, [costPerUnitValue, savingsHorizon, unitsUsedValue, usageFrequency])

  const animatedDailySpend = useAnimatedNumber(result.dailySpend)
  const animatedMonthlySpend = useAnimatedNumber(result.monthlySpend)
  const animatedYearlySpend = useAnimatedNumber(result.yearlySpend)
  const animatedFiveYearSpend = useAnimatedNumber(result.fiveYearSpend)
  const animatedHorizonSavings = useAnimatedNumber(result.horizonSavings)

  const handleReset = () => {
    setCostPerUnit(DEFAULT_VALUES.costPerUnit)
    setUnitsUsed(DEFAULT_VALUES.unitsUsed)
    setUnitLabel(DEFAULT_VALUES.unitLabel)
    setUsageFrequency(DEFAULT_VALUES.usageFrequency)
    setSavingsHorizon(DEFAULT_VALUES.savingsHorizon)
    setCurrencyCode(detectDefaultCurrency().code)
  }

  const moneyValue = (value: number) =>
    `${selectedCurrency.symbol} ${formatNumber(value, numberLocale)}`

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
                Addiction Price Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Estimate how much a repeated habit costs over time by combining
              the price per unit with how often it is used.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cost Per Unit"
                    value={
                      costPerUnit === ''
                        ? ''
                        : formatNumber(Number(costPerUnit), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value)
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setCostPerUnit,
                        locale: numberLocale,
                      })
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            {selectedCurrency.symbol}
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Units Used"
                    value={unitsUsed}
                    onChange={(event) =>
                      setUnitsUsed(
                        sanitizeNumericInput(event.target.value, true)
                      )
                    }
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Unit Label"
                    value={unitLabel}
                    onChange={(event) => setUnitLabel(event.target.value)}
                  />

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Usage Frequency"
                    value={usageFrequency}
                    onChange={(event) =>
                      setUsageFrequency(event.target.value as UsageFrequency)
                    }
                  >
                    <MenuItem value="perDay">Per Day</MenuItem>
                    <MenuItem value="perWeek">Per Week</MenuItem>
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Quit Savings Horizon"
                    value={savingsHorizon}
                    onChange={(event) =>
                      setSavingsHorizon(event.target.value as SavingsHorizon)
                    }
                  >
                    <MenuItem value="1month">1 Month</MenuItem>
                    <MenuItem value="6months">6 Months</MenuItem>
                    <MenuItem value="1year">1 Year</MenuItem>
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Currency"
                    value={currencyCode}
                    onChange={(event) => setCurrencyCode(event.target.value)}
                  >
                    {currencyOptions.map((option) => (
                      <MenuItem key={option.code} value={option.code}>
                        {option.code}
                      </MenuItem>
                    ))}
                  </TextField>

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
                      Spend Snapshot
                    </Typography>
                  </Box>

                  {result.hasValidInput ? (
                    <>
                      <Typography color="text.secondary">
                        Based on {unitsUsedValue || 0}{' '}
                        {unitLabel.trim() || 'units'}{' '}
                        {usageFrequency === 'perDay' ? 'per day' : 'per week'}.
                      </Typography>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Estimated Daily Spend
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {moneyValue(animatedDailySpend)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Estimated Monthly Spend
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {moneyValue(animatedMonthlySpend)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Estimated Yearly Spend
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {moneyValue(animatedYearlySpend)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Estimated 5-Year Spend
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {moneyValue(animatedFiveYearSpend)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Savings If Stopped For{' '}
                          {getHorizonLabel(savingsHorizon)}
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {moneyValue(animatedHorizonSavings)}
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

export default AddictionPriceCalculator
