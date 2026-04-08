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
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
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
  corpus: '2500000',
  monthlyWithdrawal: '20000',
  annualReturn: '8',
  durationYears: '20',
}

function SwpCalculator() {
  const theme = useTheme()
  const [corpus, setCorpus] = useState(DEFAULT_VALUES.corpus)
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(
    DEFAULT_VALUES.monthlyWithdrawal
  )
  const [annualReturn, setAnnualReturn] = useState(DEFAULT_VALUES.annualReturn)
  const [durationYears, setDurationYears] = useState(
    DEFAULT_VALUES.durationYears
  )
  const [currencyCode, setCurrencyCode] = useState('INR')

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale

  const openingCorpus = Number(corpus) || 0
  const withdrawal = Number(monthlyWithdrawal) || 0
  const annualRate = Number(annualReturn) || 0
  const years = Number(durationYears) || 0

  const result = useMemo(() => {
    if (openingCorpus <= 0 || withdrawal <= 0 || annualRate < 0 || years <= 0) {
      return {
        hasValidInput: false,
        endingBalance: 0,
        totalWithdrawals: 0,
        growthEarned: 0,
        monthsLasted: 0,
        growthSeries: [] as Array<{
          label: string
          balance: number
          withdrawals: number
        }>,
      }
    }

    const monthlyRate = annualRate / 12 / 100
    const totalMonths = Math.round(years * 12)
    let balance = openingCorpus
    let totalWithdrawn = 0
    let monthsLasted = totalMonths
    const growthSeries: Array<{
      label: string
      balance: number
      withdrawals: number
    }> = []

    for (let month = 1; month <= totalMonths; month += 1) {
      balance *= 1 + monthlyRate
      const actualWithdrawal = Math.min(withdrawal, balance)
      balance -= actualWithdrawal
      totalWithdrawn += actualWithdrawal

      if (month % 12 === 0 || month === totalMonths || balance <= 0) {
        growthSeries.push({
          label: `Year ${Math.ceil(month / 12)}`,
          balance: Number(balance.toFixed(2)),
          withdrawals: Number(totalWithdrawn.toFixed(2)),
        })
      }

      if (balance <= 0) {
        monthsLasted = month
        balance = 0
        break
      }
    }

    return {
      hasValidInput: true,
      endingBalance: balance,
      totalWithdrawals: totalWithdrawn,
      growthEarned:
        openingCorpus + totalWithdrawn > 0
          ? balance + totalWithdrawn - openingCorpus
          : 0,
      monthsLasted,
      growthSeries,
    }
  }, [annualRate, openingCorpus, withdrawal, years])

  const chartData = [
    { name: 'Withdrawn', value: result.totalWithdrawals },
    { name: 'Balance', value: result.endingBalance },
  ]
  const chartColors =
    theme.palette.mode === 'dark'
      ? [theme.palette.secondary.light, '#4dd0e1']
      : [theme.palette.text.primary, '#0f8b8d']

  const handleReset = () => {
    setCorpus(DEFAULT_VALUES.corpus)
    setMonthlyWithdrawal(DEFAULT_VALUES.monthlyWithdrawal)
    setAnnualReturn(DEFAULT_VALUES.annualReturn)
    setDurationYears(DEFAULT_VALUES.durationYears)
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
                SWP Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Estimate how long a corpus can support fixed monthly withdrawals
              and how much balance may remain after the selected withdrawal
              period.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Starting Corpus"
                    value={
                      corpus === ''
                        ? ''
                        : formatNumber(Number(corpus), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) =>
                      preserveFormattedNumberCaret({
                        event,
                        nextValue: sanitizeNumericInput(event.target.value),
                        setValue: setCorpus,
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

                  <TextField
                    fullWidth
                    size="small"
                    label="Monthly Withdrawal"
                    value={
                      monthlyWithdrawal === ''
                        ? ''
                        : formatNumber(
                            Number(monthlyWithdrawal),
                            numberLocale,
                            {
                              maximumFractionDigits: 0,
                            }
                          )
                    }
                    onChange={(event) =>
                      preserveFormattedNumberCaret({
                        event,
                        nextValue: sanitizeNumericInput(event.target.value),
                        setValue: setMonthlyWithdrawal,
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
                        Expected Return
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {annualRate || 0}% per year
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
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
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      min={0}
                      max={18}
                      step={0.1}
                      value={annualRate || 0}
                      onChange={(_, value) => setAnnualReturn(String(value))}
                    />
                  </Box>

                  <Box>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={0.5}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Withdrawal Period
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {years || 0} years
                      </Typography>
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      value={durationYears}
                      onChange={(event) =>
                        setDurationYears(
                          sanitizeNumericInput(event.target.value)
                        )
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Yr</InputAdornment>
                        ),
                      }}
                    />
                    <Slider
                      size="small"
                      sx={{ mt: 1 }}
                      min={1}
                      max={40}
                      step={1}
                      value={years || 1}
                      onChange={(_, value) => setDurationYears(String(value))}
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
                      label: 'Ending Balance',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.endingBalance,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Total Withdrawn',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.totalWithdrawals,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Growth Earned',
                      value: `${selectedCurrency.symbol} ${formatNumber(
                        result.growthEarned,
                        numberLocale
                      )}`,
                    },
                    {
                      label: 'Corpus Lasts',
                      value: `${formatNumber(
                        result.monthsLasted / 12,
                        'en-US',
                        {
                          maximumFractionDigits: 1,
                        }
                      )} years`,
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

                <Box sx={{ mt: { xs: 0.75, md: 1 } }}>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                        <Stack spacing={1.75}>
                          <Typography
                            variant="overline"
                            sx={{ color: 'secondary.main', fontWeight: 700 }}
                          >
                            Corpus Path
                          </Typography>
                          {result.hasValidInput ? (
                            <Box
                              sx={{
                                height: { xs: 280, md: 300 },
                                pt: 1,
                                pr: { xs: 0.5, md: 1 },
                              }}
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                  data={result.growthSeries}
                                  margin={{
                                    top: 12,
                                    right: 12,
                                    left: -16,
                                    bottom: 4,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={theme.palette.divider}
                                  />
                                  <XAxis dataKey="label" />
                                  <YAxis
                                    tickFormatter={formatAxisCurrencyValue}
                                  />
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
                                    dataKey="balance"
                                    name="Balance"
                                    stroke={chartColors[0]}
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="withdrawals"
                                    name="Withdrawals"
                                    stroke={chartColors[1]}
                                    strokeWidth={2}
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </Box>
                          ) : (
                            <Typography color="text.secondary">
                              Enter a valid corpus, withdrawal amount, return
                              rate, and period to project the withdrawal path.
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                      <Paper
                        sx={(theme) => ({
                          ...getCalculatorPanelSx(theme),
                          minHeight: '100%',
                        })}
                      >
                        <Stack spacing={1.5} divider={<Divider flexItem />}>
                          <Typography
                            variant="overline"
                            sx={{ color: 'secondary.main', fontWeight: 700 }}
                          >
                            Withdrawal Mix
                          </Typography>
                          {result.hasValidInput ? (
                            <>
                              <Box
                                sx={{
                                  height: { xs: 220, md: 236 },
                                  pt: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={chartData}
                                      dataKey="value"
                                      nameKey="name"
                                      innerRadius={55}
                                      outerRadius={82}
                                      paddingAngle={2}
                                    >
                                      {chartData.map((entry, index) => (
                                        <Cell
                                          key={entry.name}
                                          fill={
                                            chartColors[
                                              index % chartColors.length
                                            ]
                                          }
                                        />
                                      ))}
                                    </Pie>
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
                                  </PieChart>
                                </ResponsiveContainer>
                              </Box>
                              <Typography
                                color="text.secondary"
                                sx={{ lineHeight: 1.75 }}
                              >
                                {result.endingBalance > 0
                                  ? 'The corpus still has value left at the end of the selected SWP period.'
                                  : 'The selected withdrawal amount depletes the corpus before the full period completes.'}
                              </Typography>
                            </>
                          ) : (
                            <Typography color="text.secondary">
                              Result cards and charts appear after you enter
                              valid inputs.
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default SwpCalculator
