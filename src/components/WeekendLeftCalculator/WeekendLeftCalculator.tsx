'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'

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

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function findNextWeekendDay(referenceDate: Date) {
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = addDays(referenceDate, offset)
    const day = candidate.getDay()

    if (day === 6 || day === 0) {
      return candidate
    }
  }

  return referenceDate
}

function WeekendLeftCalculator() {
  const [referenceDate, setReferenceDate] = useState(() =>
    formatDateInput(new Date())
  )

  const result = useMemo(() => {
    const parsedReferenceDate = parseDateInput(referenceDate)

    if (!parsedReferenceDate) {
      return {
        hasValidInput: false,
        message: 'Enter a valid date to calculate weekends left in the year.',
        weekendsLeft: 0,
        saturdaysLeft: 0,
        sundaysLeft: 0,
        daysLeftInYear: 0,
        nextWeekendLabel: '',
      }
    }

    const currentDate = getStartOfDay(parsedReferenceDate)
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31)
    const millisecondsPerDay = 24 * 60 * 60 * 1000
    const utcCurrent = Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    )
    const utcEnd = Date.UTC(
      endOfYear.getFullYear(),
      endOfYear.getMonth(),
      endOfYear.getDate()
    )
    const daysLeftInYear = Math.max(
      0,
      Math.floor((utcEnd - utcCurrent) / millisecondsPerDay)
    )

    let saturdaysLeft = 0
    let sundaysLeft = 0

    for (
      let cursor = new Date(currentDate);
      cursor <= endOfYear;
      cursor = addDays(cursor, 1)
    ) {
      const day = cursor.getDay()

      if (day === 6) {
        saturdaysLeft += 1
      } else if (day === 0) {
        sundaysLeft += 1
      }
    }

    return {
      hasValidInput: true,
      message: '',
      weekendsLeft: Math.min(saturdaysLeft, sundaysLeft),
      saturdaysLeft,
      sundaysLeft,
      daysLeftInYear,
      nextWeekendLabel: formatDisplayDate(findNextWeekendDay(currentDate)),
    }
  }, [referenceDate])

  const handleReset = () => {
    setReferenceDate(formatDateInput(new Date()))
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
                Weekend Left Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Check how many Saturdays, Sundays, and full weekends are still
              left in the current year from any selected date.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Reference Date"
                    type="date"
                    value={referenceDate}
                    onChange={(event) => setReferenceDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

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
                      Year-End Snapshot
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
                          Full Weekends Left
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.weekendsLeft}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Saturdays Left
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.saturdaysLeft}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Sundays Left
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.sundaysLeft}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Days Left In Year
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.daysLeftInYear}
                        </Typography>
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        spacing={0.5}
                      >
                        <Typography color="text.secondary">
                          Next Weekend Day
                        </Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                          {result.nextWeekendLabel}
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

export default WeekendLeftCalculator
