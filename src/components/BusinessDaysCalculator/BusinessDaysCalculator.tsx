'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateInput(value: string) {
  if (!value) {
    return null
  }

  const [yearText, monthText, dayText] = value.split('-')
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)

  if (!year || !month || !day) {
    return null
  }

  const parsed = new Date(year, month - 1, day)

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null
  }

  return parsed
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function calculateBusinessSummary(
  startDate: Date,
  endDate: Date,
  includeStartDate: boolean
) {
  if (startDate > endDate) {
    return null
  }

  const rangeStart = includeStartDate
    ? startOfDay(startDate)
    : addDays(startOfDay(startDate), 1)
  const rangeEnd = startOfDay(endDate)

  if (rangeStart > rangeEnd) {
    return {
      totalDays: 0,
      businessDays: 0,
      weekendDays: 0,
      fullWeeks: 0,
    }
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const totalDays =
    Math.floor(
      (rangeEnd.getTime() - rangeStart.getTime()) / millisecondsPerDay
    ) + 1

  let businessDays = 0
  let weekendDays = 0

  for (let offset = 0; offset < totalDays; offset += 1) {
    const currentDate = addDays(rangeStart, offset)
    const day = currentDate.getDay()

    if (day === 0 || day === 6) {
      weekendDays += 1
    } else {
      businessDays += 1
    }
  }

  return {
    totalDays,
    businessDays,
    weekendDays,
    fullWeeks: totalDays / 7,
  }
}

function BusinessDaysCalculator() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [startDate, setStartDate] = useState(() => formatDateInput(today))
  const [endDate, setEndDate] = useState(() =>
    formatDateInput(addDays(today, 7))
  )
  const [includeStartDate, setIncludeStartDate] = useState(true)

  const result = useMemo(() => {
    const parsedStartDate = parseDateInput(startDate)
    const parsedEndDate = parseDateInput(endDate)

    if (!parsedStartDate || !parsedEndDate) {
      return {
        error: 'Enter valid dates to calculate business days.',
        summary: null,
      }
    }

    const summary = calculateBusinessSummary(
      parsedStartDate,
      parsedEndDate,
      includeStartDate
    )

    if (!summary) {
      return {
        error: 'Start date cannot be later than the end date.',
        summary: null,
      }
    }

    return {
      error: '',
      summary,
    }
  }, [endDate, includeStartDate, startDate])

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
                Business Days Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Count business days, weekend days, and the total date span between
              two selected dates using a simple Monday-to-Friday workweek.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeStartDate}
                        onChange={(event) =>
                          setIncludeStartDate(event.target.checked)
                        }
                      />
                    }
                    label="Include start date in the count"
                  />
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<AutorenewRoundedIcon />}
                    onClick={() => {
                      setStartDate(formatDateInput(today))
                      setEndDate(formatDateInput(addDays(today, 7)))
                      setIncludeStartDate(true)
                    }}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Reset
                  </Button>
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
                      Business Day Summary
                    </Typography>
                  </Box>

                  {result.summary ? (
                    <>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Business Days
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.summary.businessDays}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Weekend Days
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.summary.weekendDays}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Total Days Counted
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.summary.totalDays}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Approx. Weeks
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.summary.fullWeeks.toFixed(1)}
                        </Typography>
                      </Stack>
                    </>
                  ) : (
                    <Typography color="error.main">{result.error}</Typography>
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

export default BusinessDaysCalculator
