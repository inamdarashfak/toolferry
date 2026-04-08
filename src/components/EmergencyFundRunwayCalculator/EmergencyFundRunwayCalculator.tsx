'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
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
  Bar,
  BarChart,
  CartesianGrid,
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
  currentSavings: '180000',
  monthlyExpenses: '40000',
  monthlyContribution: '15000',
  targetMonths: '6',
}

function EmergencyFundRunwayCalculator() {
  const theme = useTheme()
  const [currentSavings, setCurrentSavings] = useState(
    DEFAULT_VALUES.currentSavings
  )
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    DEFAULT_VALUES.monthlyExpenses
  )
  const [monthlyContribution, setMonthlyContribution] = useState(
    DEFAULT_VALUES.monthlyContribution
  )
  const [targetMonths, setTargetMonths] = useState(DEFAULT_VALUES.targetMonths)
  const [currencyCode, setCurrencyCode] = useState('INR')

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale
  const savings = Number(currentSavings) || 0
  const expenses = Number(monthlyExpenses) || 0
  const contribution = Number(monthlyContribution) || 0
  const targetCoverageMonths = Number(targetMonths) || 0

  const result = useMemo(() => {
    if (
      savings < 0 ||
      expenses <= 0 ||
      contribution < 0 ||
      targetCoverageMonths <= 0
    ) {
      return {
        hasValidInput: false,
        currentRunwayMonths: 0,
        targetFund: 0,
        fundingGap: 0,
        monthsToTarget: 0,
        projectionSeries: [] as Array<{ label: string; value: number }>,
      }
    }

    const currentRunwayMonths = savings / expenses
    const targetFund = expenses * targetCoverageMonths
    const fundingGap = Math.max(targetFund - savings, 0)
    const monthsToTarget =
      fundingGap > 0 && contribution > 0
        ? Math.ceil(fundingGap / contribution)
        : 0
    const projectionSeries = [
      { label: 'Current Savings', value: savings },
      { label: 'Target Fund', value: targetFund },
      { label: 'Gap', value: fundingGap },
    ]

    return {
      hasValidInput: true,
      currentRunwayMonths,
      targetFund,
      fundingGap,
      monthsToTarget,
      projectionSeries,
    }
  }, [contribution, expenses, savings, targetCoverageMonths])

  const handleReset = () => {
    setCurrentSavings(DEFAULT_VALUES.currentSavings)
    setMonthlyExpenses(DEFAULT_VALUES.monthlyExpenses)
    setMonthlyContribution(DEFAULT_VALUES.monthlyContribution)
    setTargetMonths(DEFAULT_VALUES.targetMonths)
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
                Emergency Fund Runway Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              See how many months your current emergency savings can cover and
              how long it may take to build your target buffer.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  {[
                    {
                      label: 'Current Savings',
                      value: currentSavings,
                      setValue: setCurrentSavings,
                    },
                    {
                      label: 'Monthly Essential Expenses',
                      value: monthlyExpenses,
                      setValue: setMonthlyExpenses,
                    },
                    {
                      label: 'Monthly Contribution',
                      value: monthlyContribution,
                      setValue: setMonthlyContribution,
                    },
                  ].map((item) => (
                    <TextField
                      key={item.label}
                      fullWidth
                      size="small"
                      label={item.label}
                      value={
                        item.value === ''
                          ? ''
                          : formatNumber(Number(item.value), numberLocale, {
                              maximumFractionDigits: 0,
                            })
                      }
                      onChange={(event) =>
                        preserveFormattedNumberCaret({
                          event,
                          nextValue: sanitizeNumericInput(event.target.value),
                          setValue: item.setValue,
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
                  ))}

                  <Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Target Coverage
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {targetCoverageMonths || 0} months
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={targetMonths}
                      onChange={(event) =>
                        setTargetMonths(
                          sanitizeNumericInput(event.target.value)
                        )
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">months</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      min={1}
                      max={24}
                      step={1}
                      value={targetCoverageMonths || 1}
                      onChange={(_, value) => setTargetMonths(String(value))}
                    />
                  </Box>

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
                      label: 'Current Runway',
                      value: `${formatNumber(
                        result.currentRunwayMonths,
                        'en-US',
                        {
                          maximumFractionDigits: 1,
                        }
                      )} months`,
                    },
                    {
                      label: 'Target Fund',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.targetFund,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Funding Gap',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.fundingGap,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Months To Target',
                      value:
                        result.fundingGap === 0
                          ? 'Already funded'
                          : result.monthsToTarget > 0
                            ? `${result.monthsToTarget} months`
                            : 'Increase monthly contribution',
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
                  <Stack spacing={1.5} divider={<Divider flexItem />}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Emergency Fund Snapshot
                    </Typography>
                    {result.hasValidInput ? (
                      <>
                        <Box sx={{ height: 260 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={result.projectionSeries}>
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
                              <Bar
                                dataKey="value"
                                fill="#0f8b8d"
                                radius={[0, 0, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                        <Typography
                          color="text.secondary"
                          sx={{ lineHeight: 1.75 }}
                        >
                          A common target is 3 to 6 months of essential
                          expenses, but you can set a higher cushion if your
                          income is less predictable or obligations are higher.
                        </Typography>
                      </>
                    ) : (
                      <Typography color="text.secondary">
                        Enter monthly expenses and a positive target period to
                        see the current runway and target gap.
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

export default EmergencyFundRunwayCalculator
