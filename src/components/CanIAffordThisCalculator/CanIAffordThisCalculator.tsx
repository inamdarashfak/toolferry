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

const DEFAULT_VALUES = {
  monthlyIncome: '85000',
  essentialExpenses: '42000',
  savingsGoal: '10000',
  itemPrice: '18000',
}

function CanIAffordThisCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(
    DEFAULT_VALUES.monthlyIncome
  )
  const [essentialExpenses, setEssentialExpenses] = useState(
    DEFAULT_VALUES.essentialExpenses
  )
  const [savingsGoal, setSavingsGoal] = useState(DEFAULT_VALUES.savingsGoal)
  const [itemPrice, setItemPrice] = useState(DEFAULT_VALUES.itemPrice)
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code)

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale

  const incomeValue = Number(monthlyIncome) || 0
  const essentialExpensesValue = Number(essentialExpenses) || 0
  const savingsGoalValue = Number(savingsGoal) || 0
  const itemPriceValue = Number(itemPrice) || 0

  const result = useMemo(() => {
    if (
      incomeValue < 0 ||
      essentialExpensesValue < 0 ||
      savingsGoalValue < 0 ||
      itemPriceValue < 0
    ) {
      return {
        hasValidInput: false,
        message:
          'Enter valid non-negative values for income, expenses, savings, and price.',
        leftoverAfterEssentials: 0,
        leftoverAfterSavings: 0,
        purchaseBuffer: 0,
        shortfall: 0,
        statusLabel: '',
      }
    }

    const leftoverAfterEssentials = incomeValue - essentialExpensesValue
    const leftoverAfterSavings = leftoverAfterEssentials - savingsGoalValue
    const purchaseBuffer = leftoverAfterSavings - itemPriceValue
    const shortfall = purchaseBuffer < 0 ? Math.abs(purchaseBuffer) : 0

    return {
      hasValidInput: true,
      message: '',
      leftoverAfterEssentials,
      leftoverAfterSavings,
      purchaseBuffer,
      shortfall,
      statusLabel:
        purchaseBuffer >= 0 ? 'Fits this month' : 'Does not fit this month',
    }
  }, [essentialExpensesValue, incomeValue, itemPriceValue, savingsGoalValue])

  const animatedEssentialsLeft = useAnimatedNumber(
    result.leftoverAfterEssentials
  )
  const animatedSavingsLeft = useAnimatedNumber(result.leftoverAfterSavings)
  const animatedPurchaseBuffer = useAnimatedNumber(
    result.purchaseBuffer >= 0 ? result.purchaseBuffer : result.shortfall
  )

  const handleReset = () => {
    setMonthlyIncome(DEFAULT_VALUES.monthlyIncome)
    setEssentialExpenses(DEFAULT_VALUES.essentialExpenses)
    setSavingsGoal(DEFAULT_VALUES.savingsGoal)
    setItemPrice(DEFAULT_VALUES.itemPrice)
    setCurrencyCode(detectDefaultCurrency().code)
  }

  const renderMoneyValue = (value: number) =>
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
                Can I Afford This? Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Compare your monthly income, essential spending, savings goal, and
              item price to see whether a purchase fits your current budget.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Monthly Income"
                    value={
                      monthlyIncome === ''
                        ? ''
                        : formatNumber(Number(monthlyIncome), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value)
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setMonthlyIncome,
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
                    label="Essential Monthly Expenses"
                    value={
                      essentialExpenses === ''
                        ? ''
                        : formatNumber(
                            Number(essentialExpenses),
                            numberLocale,
                            {
                              maximumFractionDigits: 0,
                            }
                          )
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value)
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setEssentialExpenses,
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
                    label="Monthly Savings Goal"
                    value={
                      savingsGoal === ''
                        ? ''
                        : formatNumber(Number(savingsGoal), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value)
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setSavingsGoal,
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
                    label="Item Price"
                    value={
                      itemPrice === ''
                        ? ''
                        : formatNumber(Number(itemPrice), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value)
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setItemPrice,
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
                      Affordability Snapshot
                    </Typography>
                  </Box>

                  {result.hasValidInput ? (
                    <>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">Status</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.statusLabel}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Left After Essentials
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {renderMoneyValue(animatedEssentialsLeft)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Left After Savings Goal
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {renderMoneyValue(animatedSavingsLeft)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          {result.purchaseBuffer >= 0
                            ? 'Buffer After Purchase'
                            : 'Shortfall To Buy'}
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {renderMoneyValue(animatedPurchaseBuffer)}
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

export default CanIAffordThisCalculator
