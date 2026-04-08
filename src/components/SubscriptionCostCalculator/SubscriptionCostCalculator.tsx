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

type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

const DEFAULT_VALUES = {
  price: '499',
  billingFrequency: 'monthly' as BillingFrequency,
  quantity: '1',
}

function getYearlyMultiplier(frequency: BillingFrequency) {
  if (frequency === 'weekly') {
    return 52
  }

  if (frequency === 'monthly') {
    return 12
  }

  if (frequency === 'quarterly') {
    return 4
  }

  return 1
}

function SubscriptionCostCalculator() {
  const [price, setPrice] = useState(DEFAULT_VALUES.price)
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>(
    DEFAULT_VALUES.billingFrequency
  )
  const [quantity, setQuantity] = useState(DEFAULT_VALUES.quantity)
  const [currencyCode, setCurrencyCode] = useState(currencyOptions[0].code)

  useEffect(() => {
    setCurrencyCode(detectDefaultCurrency().code)
  }, [])

  const selectedCurrency =
    currencyOptions.find((option) => option.code === currencyCode) ??
    currencyOptions[0]
  const numberLocale = selectedCurrency.locale
  const priceValue = Number(price) || 0
  const quantityValue = Number(quantity) || 0

  const result = useMemo(() => {
    if (priceValue < 0 || quantityValue < 0) {
      return {
        hasValidInput: false,
        message: 'Enter valid non-negative values for price and quantity.',
        monthlyCost: 0,
        yearlyCost: 0,
        fiveYearCost: 0,
        dailyCost: 0,
      }
    }

    const yearlyCost =
      priceValue * quantityValue * getYearlyMultiplier(billingFrequency)
    const monthlyCost = yearlyCost / 12
    const fiveYearCost = yearlyCost * 5
    const dailyCost = yearlyCost / 365

    return {
      hasValidInput: true,
      message: '',
      monthlyCost,
      yearlyCost,
      fiveYearCost,
      dailyCost,
    }
  }, [billingFrequency, priceValue, quantityValue])

  const animatedMonthlyCost = useAnimatedNumber(result.monthlyCost)
  const animatedYearlyCost = useAnimatedNumber(result.yearlyCost)
  const animatedFiveYearCost = useAnimatedNumber(result.fiveYearCost)
  const animatedDailyCost = useAnimatedNumber(result.dailyCost)

  const handleReset = () => {
    setPrice(DEFAULT_VALUES.price)
    setBillingFrequency(DEFAULT_VALUES.billingFrequency)
    setQuantity(DEFAULT_VALUES.quantity)
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
                Subscription Cost Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Roll any recurring subscription into daily, monthly, yearly, and
              long-term cost totals to see what it really adds up to.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Subscription Price"
                    value={
                      price === ''
                        ? ''
                        : formatNumber(Number(price), numberLocale, {
                            maximumFractionDigits: 0,
                          })
                    }
                    onChange={(event) => {
                      const nextValue = sanitizeNumericInput(event.target.value)
                      preserveFormattedNumberCaret({
                        event,
                        nextValue,
                        setValue: setPrice,
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
                    label="Billing Frequency"
                    value={billingFrequency}
                    onChange={(event) =>
                      setBillingFrequency(
                        event.target.value as BillingFrequency
                      )
                    }
                  >
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label="Number of Subscriptions"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(sanitizeNumericInput(event.target.value))
                    }
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
                      Cost Snapshot
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
                          Equivalent Daily Cost
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(animatedDailyCost, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Equivalent Monthly Cost
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(animatedMonthlyCost, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Yearly Cost
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(animatedYearlyCost, numberLocale)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          5-Year Cost
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {selectedCurrency.symbol}{' '}
                          {formatNumber(animatedFiveYearCost, numberLocale)}
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

export default SubscriptionCostCalculator
