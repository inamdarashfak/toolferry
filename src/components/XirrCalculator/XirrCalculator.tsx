'use client'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
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
} from '../../lib/calculator'
import { preserveFormattedNumberCaret } from '../../lib/formattedNumericInput'

type CashFlowType = 'investment' | 'redemption'

type CashFlowRow = {
  id: number
  date: string
  amount: string
  type: CashFlowType
}

const DEFAULT_ROWS: CashFlowRow[] = [
  { id: 1, date: '2021-04-01', amount: '100000', type: 'investment' },
  { id: 2, date: '2022-02-15', amount: '50000', type: 'investment' },
  { id: 3, date: '2023-07-10', amount: '25000', type: 'investment' },
  { id: 4, date: '2026-04-08', amount: '235000', type: 'redemption' },
]

function calculateXirr(values: number[], dates: Date[]) {
  const startDate = dates[0].getTime()
  const dayFactors = dates.map(
    (date) => (date.getTime() - startDate) / (1000 * 60 * 60 * 24) / 365
  )

  const npv = (rate: number) =>
    values.reduce(
      (sum, value, index) =>
        sum + value / Math.pow(1 + rate, dayFactors[index]),
      0
    )

  const derivative = (rate: number) =>
    values.reduce(
      (sum, value, index) =>
        sum -
        (dayFactors[index] * value) / Math.pow(1 + rate, dayFactors[index] + 1),
      0
    )

  let guess = 0.12

  for (let iteration = 0; iteration < 100; iteration += 1) {
    const currentValue = npv(guess)
    const currentDerivative = derivative(guess)

    if (
      !Number.isFinite(currentDerivative) ||
      Math.abs(currentDerivative) < 1e-10
    ) {
      break
    }

    const nextGuess = guess - currentValue / currentDerivative

    if (!Number.isFinite(nextGuess) || nextGuess <= -0.999999) {
      break
    }

    if (Math.abs(nextGuess - guess) < 1e-7) {
      return nextGuess
    }

    guess = nextGuess
  }

  return null
}

function XirrCalculator() {
  const [rows, setRows] = useState<CashFlowRow[]>(DEFAULT_ROWS)
  const [currencyCode, setCurrencyCode] = useState('INR')

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale

  const result = useMemo(() => {
    const parsedRows = rows
      .map((row) => {
        const amount = Number(row.amount) || 0
        const date = row.date ? new Date(`${row.date}T00:00:00`) : null

        return {
          ...row,
          signedAmount: row.type === 'investment' ? -amount : amount,
          amount,
          date,
        }
      })
      .filter(
        (row) => row.amount > 0 && row.date && !Number.isNaN(row.date.getTime())
      )
      .sort((left, right) => left.date!.getTime() - right.date!.getTime())

    if (parsedRows.length < 2) {
      return {
        hasValidInput: false,
        message:
          'Add at least two valid cash flows with dates to calculate XIRR.',
        xirr: 0,
        totalInvested: 0,
        totalRealized: 0,
        netGain: 0,
        durationYears: 0,
      }
    }

    const hasInvestment = parsedRows.some((row) => row.signedAmount < 0)
    const hasRedemption = parsedRows.some((row) => row.signedAmount > 0)

    if (!hasInvestment || !hasRedemption) {
      return {
        hasValidInput: false,
        message: 'You need at least one investment and one redemption value.',
        xirr: 0,
        totalInvested: 0,
        totalRealized: 0,
        netGain: 0,
        durationYears: 0,
      }
    }

    const values = parsedRows.map((row) => row.signedAmount)
    const dates = parsedRows.map((row) => row.date as Date)
    const xirr = calculateXirr(values, dates)

    if (xirr === null) {
      return {
        hasValidInput: false,
        message:
          'These cash flows do not converge to a valid XIRR. Adjust the dates or values and try again.',
        xirr: 0,
        totalInvested: 0,
        totalRealized: 0,
        netGain: 0,
        durationYears: 0,
      }
    }

    const totalInvested = parsedRows
      .filter((row) => row.signedAmount < 0)
      .reduce((sum, row) => sum + row.amount, 0)
    const totalRealized = parsedRows
      .filter((row) => row.signedAmount > 0)
      .reduce((sum, row) => sum + row.amount, 0)
    const durationYears =
      (dates[dates.length - 1].getTime() - dates[0].getTime()) /
      (1000 * 60 * 60 * 24 * 365)

    return {
      hasValidInput: true,
      message: '',
      xirr: xirr * 100,
      totalInvested,
      totalRealized,
      netGain: totalRealized - totalInvested,
      durationYears,
    }
  }, [rows])

  const handleRowChange = (
    rowId: number,
    field: keyof Pick<CashFlowRow, 'date' | 'amount' | 'type'>,
    value: string
  ) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]:
                field === 'amount' ? sanitizeNumericInput(value, true) : value,
            }
          : row
      )
    )
  }

  const handleAddRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      {
        id: Math.max(...currentRows.map((row) => row.id), 0) + 1,
        date: '2026-04-08',
        amount: '',
        type: 'investment',
      },
    ])
  }

  const handleRemoveRow = (rowId: number) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId))
  }

  const handleReset = () => {
    setRows(DEFAULT_ROWS)
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
                XIRR Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Calculate annualized returns for irregular cash flows using dated
              investments and redemptions.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Cash Flows
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        select
                        size="small"
                        label="Currency"
                        value={currencyCode}
                        onChange={(event) =>
                          setCurrencyCode(event.target.value)
                        }
                        sx={{ minWidth: 110 }}
                      >
                        {currencyOptions.map((option) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.code}
                          </MenuItem>
                        ))}
                      </TextField>
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<AddRoundedIcon />}
                        onClick={handleAddRow}
                        sx={{ borderRadius: 0 }}
                      >
                        Add Row
                      </Button>
                    </Stack>
                  </Stack>

                  <Stack spacing={1.25}>
                    {rows.map((row, index) => (
                      <Grid
                        key={row.id}
                        container
                        spacing={1.25}
                        alignItems="center"
                      >
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <TextField
                            select
                            fullWidth
                            size="small"
                            label={index === 0 ? 'Type' : undefined}
                            value={row.type}
                            onChange={(event) =>
                              handleRowChange(
                                row.id,
                                'type',
                                event.target.value
                              )
                            }
                          >
                            <MenuItem value="investment">Investment</MenuItem>
                            <MenuItem value="redemption">Redemption</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label={index === 0 ? 'Date' : undefined}
                            value={row.date}
                            onChange={(event) =>
                              handleRowChange(
                                row.id,
                                'date',
                                event.target.value
                              )
                            }
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 10, sm: 4.5 }}>
                          <TextField
                            fullWidth
                            size="small"
                            label={index === 0 ? 'Amount' : undefined}
                            value={
                              row.amount === ''
                                ? ''
                                : formatNumber(
                                    Number(row.amount),
                                    numberLocale,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )
                            }
                            onChange={(event) =>
                              preserveFormattedNumberCaret({
                                event,
                                nextValue: sanitizeNumericInput(
                                  event.target.value,
                                  true
                                ),
                                setValue: (value) =>
                                  handleRowChange(row.id, 'amount', value),
                                locale: numberLocale,
                                options: { maximumFractionDigits: 2 },
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
                        </Grid>
                        <Grid size={{ xs: 2, sm: 1 }}>
                          <IconButton
                            color="inherit"
                            onClick={() => handleRemoveRow(row.id)}
                            disabled={rows.length <= 2}
                            aria-label="Remove cash flow row"
                            sx={{
                              borderRadius: 0,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                  </Stack>

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

            <Grid size={{ xs: 12, lg: 5 }}>
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
                    Return Summary
                  </Typography>

                  {result.hasValidInput ? (
                    <>
                      <Stack spacing={0.75}>
                        <Typography color="text.secondary">XIRR</Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: '1.8rem', md: '2.25rem' },
                            fontWeight: 700,
                            lineHeight: 1.05,
                          }}
                        >
                          {formatNumber(result.xirr, 'en-US', {
                            maximumFractionDigits: 2,
                          })}
                          %
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Total Invested
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(result.totalInvested, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Total Realized
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(result.totalRealized, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Net Gain</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(result.netGain, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Cash Flow Span
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {formatNumber(result.durationYears, 'en-US', {
                            maximumFractionDigits: 2,
                          })}{' '}
                          years
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

export default XirrCalculator
