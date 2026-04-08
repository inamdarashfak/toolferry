'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import { getChartTooltipStyles } from '../../lib/chartTooltip'
import {
  currencyOptions,
  detectDefaultCurrency,
  formatAxisCurrencyValue,
  formatNumber,
  formatTooltipCurrencyValue,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
} from '../../lib/calculator'
import { preserveFormattedNumberCaret } from '../../lib/formattedNumericInput'

const DEFAULT_VALUES = {
  monthlySip: '5000',
  annualStepUp: '10',
  annualReturn: '12',
  years: '15',
}

function StepUpSipCalculator() {
  const theme = useTheme()
  const [monthlySip, setMonthlySip] = useState(DEFAULT_VALUES.monthlySip)
  const [annualStepUp, setAnnualStepUp] = useState(DEFAULT_VALUES.annualStepUp)
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_VALUES.annualReturn)
  const [years, setYears] = useState(DEFAULT_VALUES.years)
  const [currencyCode, setCurrencyCode] = useState('INR')

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale
  const sipAmount = Number(monthlySip) || 0
  const stepUpRate = Number(annualStepUp) || 0
  const returnRate = Number(annualReturn) || 0
  const durationYears = Number(years) || 0

  const result = useMemo(() => {
    if (
      sipAmount <= 0 ||
      stepUpRate < 0 ||
      stepUpRate > 100 ||
      returnRate < 0 ||
      durationYears <= 0
    ) {
      return {
        hasValidInput: false,
        investedAmount: 0,
        estimatedReturns: 0,
        totalValue: 0,
        firstYearContribution: 0,
        finalYearSip: 0,
        growthSeries: [] as Array<{
          label: string
          investedAmount: number
          portfolioValue: number
        }>,
      }
    }

    const monthlyRate = returnRate / 12 / 100
    const totalMonths = Math.round(durationYears * 12)
    let futureValue = 0
    let investedAmount = 0
    const growthSeries: Array<{
      label: string
      investedAmount: number
      portfolioValue: number
    }> = []

    for (let month = 1; month <= totalMonths; month += 1) {
      const currentYearIndex = Math.floor((month - 1) / 12)
      const steppedSip =
        sipAmount * Math.pow(1 + stepUpRate / 100, currentYearIndex)
      investedAmount += steppedSip
      futureValue = (futureValue + steppedSip) * (1 + monthlyRate)

      if (month % 12 === 0 || month === totalMonths) {
        growthSeries.push({
          label: `Year ${Math.ceil(month / 12)}`,
          investedAmount: Number(investedAmount.toFixed(2)),
          portfolioValue: Number(futureValue.toFixed(2)),
        })
      }
    }

    return {
      hasValidInput: true,
      investedAmount,
      estimatedReturns: futureValue - investedAmount,
      totalValue: futureValue,
      firstYearContribution: sipAmount * 12,
      finalYearSip:
        sipAmount *
        Math.pow(
          1 + stepUpRate / 100,
          Math.max(Math.ceil(durationYears) - 1, 0)
        ),
      growthSeries,
    }
  }, [durationYears, returnRate, sipAmount, stepUpRate])

  const handleReset = () => {
    setMonthlySip(DEFAULT_VALUES.monthlySip)
    setAnnualStepUp(DEFAULT_VALUES.annualStepUp)
    setAnnualReturn(DEFAULT_VALUES.annualReturn)
    setYears(DEFAULT_VALUES.years)
    setCurrencyCode(detectDefaultCurrency().code)
  }

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
                Step-Up SIP Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Project a SIP plan that increases every year so you can see how
              rising contributions change long-term portfolio value.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Starting Monthly SIP"
                    value={
                      monthlySip === ''
                        ? ''
                        : formatNumber(Number(monthlySip), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) =>
                      preserveFormattedNumberCaret({
                        event,
                        nextValue: sanitizeNumericInput(event.target.value),
                        setValue: setMonthlySip,
                        locale: numberLocale,
                      })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {selectedCurrency.symbol}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Yearly Step-Up
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stepUpRate || 0}% every year
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={annualStepUp}
                      onChange={(event) =>
                        setAnnualStepUp(
                          sanitizeNumericInput(event.target.value, true)
                        )
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      min={0}
                      max={25}
                      step={1}
                      value={stepUpRate || 0}
                      onChange={(_, value) => setAnnualStepUp(String(value))}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    size="small"
                    label="Expected Return"
                    value={annualReturn}
                    onChange={(event) =>
                      setAnnualReturn(
                        sanitizeNumericInput(event.target.value, true)
                      )
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Investment Duration"
                    value={years}
                    onChange={(event) =>
                      setYears(sanitizeNumericInput(event.target.value))
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Yr</InputAdornment>
                      ),
                    }}
                  />

                  <Grid container spacing={1.5} alignItems="end">
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Currency"
                        value={currencyCode}
                        onChange={(event) =>
                          setCurrencyCode(event.target.value)
                        }
                      >
                        {currencyOptions.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.code}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<AutorenewRoundedIcon />}
                        onClick={handleReset}
                        fullWidth
                        sx={{ borderRadius: 0 }}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack spacing={{ xs: 2, md: 1.75 }}>
                <Grid container spacing={1.5}>
                  {[
                    {
                      label: 'Invested Amount',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.investedAmount,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Estimated Returns',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.estimatedReturns,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Projected Corpus',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.totalValue,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Final Year Monthly SIP',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.finalYearSip,
                        numberLocale
                      )}`,
                    },
                  ].map((item) => (
                    <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                      <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                        <Stack spacing={0.75}>
                          <Typography color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography
                            sx={{ fontSize: '1.18rem', fontWeight: 700 }}
                          >
                            {item.value}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1.5}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Growth Comparison
                    </Typography>
                    {result.hasValidInput ? (
                      <>
                        <Box sx={{ height: 280 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.growthSeries}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={theme.palette.divider}
                              />
                              <XAxis dataKey="label" />
                              <YAxis tickFormatter={formatAxisCurrencyValue} />
                              <Tooltip
                                formatter={(value) =>
                                  formatTooltipCurrencyValue(
                                    value,
                                    numberLocale,
                                    selectedCurrency.symbol
                                  )
                                }
                                {...getChartTooltipStyles(theme)}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="investedAmount"
                                name="Invested"
                                stroke="#0f8b8d"
                                strokeWidth={2}
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="portfolioValue"
                                name="Portfolio Value"
                                stroke="#0b1f33"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                        <Typography
                          color="text.secondary"
                          sx={{ lineHeight: 1.75 }}
                        >
                          The step-up assumption increases the monthly SIP once
                          every year, which can materially raise the final
                          corpus over long durations.
                        </Typography>
                      </>
                    ) : (
                      <Typography color="text.secondary">
                        Enter valid SIP, step-up, return, and duration values to
                        project the growth path.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default StepUpSipCalculator
