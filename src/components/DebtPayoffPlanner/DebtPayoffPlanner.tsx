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
import { useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  sanitizeNumericInput,
} from '../../lib/calculator'
import { preserveFormattedNumberCaret } from '../../lib/formattedNumericInput'

type Strategy = 'avalanche' | 'snowball'

type DebtRow = {
  id: number
  name: string
  balance: string
  rate: string
  minimumPayment: string
}

type SimulatedDebt = {
  id: number
  name: string
  balance: number
  rate: number
  minimumPayment: number
  paidOffMonth: number | null
}

const DEFAULT_DEBTS: DebtRow[] = [
  {
    id: 1,
    name: 'Credit Card',
    balance: '95000',
    rate: '36',
    minimumPayment: '4500',
  },
  {
    id: 2,
    name: 'Personal Loan',
    balance: '180000',
    rate: '16',
    minimumPayment: '6500',
  },
  {
    id: 3,
    name: 'Bike Loan',
    balance: '70000',
    rate: '11',
    minimumPayment: '3200',
  },
]

const DEFAULT_EXTRA_PAYMENT = '2500'
const MAX_MONTHS = 600

function sortDebtsForStrategy(debts: SimulatedDebt[], strategy: Strategy) {
  const ordered = [...debts].filter((debt) => debt.balance > 0)

  ordered.sort((left, right) => {
    if (strategy === 'avalanche') {
      if (right.rate !== left.rate) {
        return right.rate - left.rate
      }

      return left.balance - right.balance
    }

    if (left.balance !== right.balance) {
      return left.balance - right.balance
    }

    return right.rate - left.rate
  })

  return ordered
}

function simulatePayoff(
  debts: DebtRow[],
  extraPayment: number,
  strategy: Strategy
) {
  const simulatedDebts: SimulatedDebt[] = debts.map((debt) => ({
    id: debt.id,
    name: debt.name.trim() || `Debt ${debt.id}`,
    balance: Number(debt.balance) || 0,
    rate: Number(debt.rate) || 0,
    minimumPayment: Number(debt.minimumPayment) || 0,
    paidOffMonth: null,
  }))

  if (
    simulatedDebts.length === 0 ||
    simulatedDebts.some(
      (debt) => debt.balance <= 0 || debt.rate < 0 || debt.minimumPayment <= 0
    ) ||
    extraPayment < 0
  ) {
    return {
      hasValidInput: false,
      message:
        'Enter at least one debt with positive balance and payment values.',
      payoffMonths: 0,
      totalInterest: 0,
      totalPayment: 0,
      order: [] as string[],
    }
  }

  let month = 0
  let totalInterest = 0
  let totalPayment = 0

  while (
    simulatedDebts.some((debt) => debt.balance > 0) &&
    month < MAX_MONTHS
  ) {
    month += 1
    let extraPool = extraPayment
    const beforeMonthBalance = simulatedDebts.reduce(
      (sum, debt) => sum + debt.balance,
      0
    )

    simulatedDebts.forEach((debt) => {
      if (debt.balance <= 0) {
        return
      }

      const interest = debt.balance * (debt.rate / 12 / 100)
      debt.balance += interest
      totalInterest += interest
    })

    simulatedDebts.forEach((debt) => {
      if (debt.balance <= 0) {
        return
      }

      const payment = Math.min(debt.minimumPayment, debt.balance)
      debt.balance -= payment
      totalPayment += payment

      if (debt.balance <= 0.01 && debt.paidOffMonth === null) {
        debt.balance = 0
        debt.paidOffMonth = month
      }
    })

    const orderedDebts = sortDebtsForStrategy(simulatedDebts, strategy)

    for (const debt of orderedDebts) {
      if (extraPool <= 0) {
        break
      }

      if (debt.balance <= 0) {
        continue
      }

      const payment = Math.min(extraPool, debt.balance)
      debt.balance -= payment
      totalPayment += payment
      extraPool -= payment

      if (debt.balance <= 0.01 && debt.paidOffMonth === null) {
        debt.balance = 0
        debt.paidOffMonth = month
      }
    }

    const afterMonthBalance = simulatedDebts.reduce(
      (sum, debt) => sum + debt.balance,
      0
    )

    if (afterMonthBalance >= beforeMonthBalance) {
      return {
        hasValidInput: false,
        message:
          'Payments are too low to reduce debt. Increase minimum or extra monthly payment.',
        payoffMonths: 0,
        totalInterest: 0,
        totalPayment: 0,
        order: [] as string[],
      }
    }
  }

  if (simulatedDebts.some((debt) => debt.balance > 0)) {
    return {
      hasValidInput: false,
      message: 'This debt set does not pay off within the simulation limit.',
      payoffMonths: 0,
      totalInterest: 0,
      totalPayment: 0,
      order: [] as string[],
    }
  }

  return {
    hasValidInput: true,
    message: '',
    payoffMonths: month,
    totalInterest,
    totalPayment,
    order: [...simulatedDebts]
      .sort(
        (left, right) =>
          (left.paidOffMonth ?? MAX_MONTHS) - (right.paidOffMonth ?? MAX_MONTHS)
      )
      .map((debt) => debt.name),
  }
}

function DebtPayoffPlanner() {
  const [debts, setDebts] = useState<DebtRow[]>(DEFAULT_DEBTS)
  const [extraPayment, setExtraPayment] = useState(DEFAULT_EXTRA_PAYMENT)
  const [strategy, setStrategy] = useState<Strategy>('avalanche')

  const extraPaymentValue = Number(extraPayment) || 0

  const selectedStrategyResult = useMemo(
    () => simulatePayoff(debts, extraPaymentValue, strategy),
    [debts, extraPaymentValue, strategy]
  )
  const avalancheResult = useMemo(
    () => simulatePayoff(debts, extraPaymentValue, 'avalanche'),
    [debts, extraPaymentValue]
  )
  const snowballResult = useMemo(
    () => simulatePayoff(debts, extraPaymentValue, 'snowball'),
    [debts, extraPaymentValue]
  )

  const handleDebtChange = (
    debtId: number,
    field: keyof Pick<DebtRow, 'name' | 'balance' | 'rate' | 'minimumPayment'>,
    value: string
  ) => {
    setDebts((currentDebts) =>
      currentDebts.map((debt) =>
        debt.id === debtId
          ? {
              ...debt,
              [field]:
                field === 'name'
                  ? value
                  : sanitizeNumericInput(value, field === 'rate'),
            }
          : debt
      )
    )
  }

  const handleAddDebt = () => {
    setDebts((currentDebts) => [
      ...currentDebts,
      {
        id: Math.max(...currentDebts.map((debt) => debt.id), 0) + 1,
        name: `Debt ${currentDebts.length + 1}`,
        balance: '',
        rate: '',
        minimumPayment: '',
      },
    ])
  }

  const handleRemoveDebt = (debtId: number) => {
    setDebts((currentDebts) =>
      currentDebts.filter((debt) => debt.id !== debtId)
    )
  }

  const handleReset = () => {
    setDebts(DEFAULT_DEBTS)
    setExtraPayment(DEFAULT_EXTRA_PAYMENT)
    setStrategy('avalanche')
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
                Debt Payoff Planner
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Compare avalanche and snowball payoff plans across multiple debts
              using your current balances, rates, and payments.
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
                      Debt Inputs
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      startIcon={<AddRoundedIcon />}
                      onClick={handleAddDebt}
                      sx={{
                        borderRadius: 0,
                        alignSelf: { xs: 'stretch', sm: 'auto' },
                      }}
                    >
                      Add Debt
                    </Button>
                  </Stack>

                  <Stack spacing={1.5}>
                    {debts.map((debt) => (
                      <Box
                        key={debt.id}
                        sx={(theme) => ({
                          p: { xs: 1.25, sm: 1.5 },
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.02)'
                              : 'rgba(255,255,255,0.82)',
                        })}
                      >
                        <Grid container spacing={1.25} alignItems="center">
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Debt Name"
                              value={debt.name}
                              onChange={(event) =>
                                handleDebtChange(
                                  debt.id,
                                  'name',
                                  event.target.value
                                )
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Balance"
                              value={debt.balance}
                              onChange={(event) =>
                                preserveFormattedNumberCaret({
                                  event,
                                  nextValue: sanitizeNumericInput(
                                    event.target.value
                                  ),
                                  setValue: (value) =>
                                    handleDebtChange(debt.id, 'balance', value),
                                  locale: 'en-IN',
                                })
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    ₹
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 2.5 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Rate"
                              value={debt.rate}
                              onChange={(event) =>
                                handleDebtChange(
                                  debt.id,
                                  'rate',
                                  event.target.value
                                )
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 10, sm: 2.5 }}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Min Payment"
                              value={debt.minimumPayment}
                              onChange={(event) =>
                                preserveFormattedNumberCaret({
                                  event,
                                  nextValue: sanitizeNumericInput(
                                    event.target.value
                                  ),
                                  setValue: (value) =>
                                    handleDebtChange(
                                      debt.id,
                                      'minimumPayment',
                                      value
                                    ),
                                  locale: 'en-IN',
                                })
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    ₹
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 2, sm: 1 }}>
                            <IconButton
                              color="inherit"
                              onClick={() => handleRemoveDebt(debt.id)}
                              disabled={debts.length <= 2}
                              aria-label="Remove debt row"
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
                      </Box>
                    ))}
                  </Stack>

                  <Box sx={{ mt: { xs: 0.75, md: 1 } }}>
                    <Grid container spacing={1.25} alignItems="end">
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Extra Monthly Payment"
                          value={extraPayment}
                          onChange={(event) =>
                            preserveFormattedNumberCaret({
                              event,
                              nextValue: sanitizeNumericInput(
                                event.target.value
                              ),
                              setValue: setExtraPayment,
                              locale: 'en-IN',
                            })
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Focus Strategy"
                          value={strategy}
                          onChange={(event) =>
                            setStrategy(event.target.value as Strategy)
                          }
                        >
                          <MenuItem value="avalanche">Avalanche</MenuItem>
                          <MenuItem value="snowball">Snowball</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
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
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={{ xs: 2, md: 1.75 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1.5} divider={<Divider flexItem />}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Strategy Comparison
                    </Typography>
                    {avalancheResult.hasValidInput &&
                    snowballResult.hasValidInput ? (
                      <>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">
                            Avalanche Payoff
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {avalancheResult.payoffMonths} months
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">
                            Snowball Payoff
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {snowballResult.payoffMonths} months
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">
                            Avalanche Interest
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            ₹{' '}
                            {formatNumber(
                              avalancheResult.totalInterest,
                              'en-IN'
                            )}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">
                            Snowball Interest
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            ₹{' '}
                            {formatNumber(
                              snowballResult.totalInterest,
                              'en-IN'
                            )}
                          </Typography>
                        </Stack>
                      </>
                    ) : (
                      <Typography color="text.secondary">
                        {selectedStrategyResult.message}
                      </Typography>
                    )}
                  </Stack>
                </Paper>

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
                      Selected Plan
                    </Typography>
                    {selectedStrategyResult.hasValidInput ? (
                      <>
                        <Stack spacing={0.75}>
                          <Typography color="text.secondary">
                            Payoff Time
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '1.8rem', md: '2.2rem' },
                              fontWeight: 700,
                              lineHeight: 1.05,
                            }}
                          >
                            {selectedStrategyResult.payoffMonths} months
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          spacing={0.5}
                        >
                          <Typography color="text.secondary">
                            Total Interest
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            ₹{' '}
                            {formatNumber(
                              selectedStrategyResult.totalInterest,
                              'en-IN'
                            )}
                          </Typography>
                        </Stack>
                        <Stack spacing={0.75}>
                          <Typography color="text.secondary">
                            Payoff Order
                          </Typography>
                          <Stack spacing={0.5}>
                            {selectedStrategyResult.order.map((name, index) => (
                              <Typography key={name} sx={{ fontWeight: 600 }}>
                                {index + 1}. {name}
                              </Typography>
                            ))}
                          </Stack>
                        </Stack>
                      </>
                    ) : (
                      <Typography color="text.secondary">
                        {selectedStrategyResult.message}
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

export default DebtPayoffPlanner
