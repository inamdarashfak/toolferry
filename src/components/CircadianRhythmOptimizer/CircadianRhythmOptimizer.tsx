'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import NearMeRoundedIcon from '@mui/icons-material/NearMeRounded'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'

type GeolocationStatus =
  | 'idle'
  | 'requesting'
  | 'ready'
  | 'denied'
  | 'unsupported'
  | 'error'

type SolarStatus = 'idle' | 'loading' | 'ready' | 'error'

type Coordinates = {
  latitude: number
  longitude: number
}

type SolarData = {
  sunriseMinutes: number
  sunsetMinutes: number
  timezone: string
}

type ResultCard = {
  label: string
  value: string
  note: string
  icon: typeof LightModeRoundedIcon
}

type CalculationResult = {
  hasValidInput: boolean
  error: string
  wakeMinutes: number
  bedtimeMinutes: number
  morningStart: number
  morningEnd: number
  dimStart: number
  dimEnd: number
  isSolarAdjusted: boolean
  modelNote: string
  sunriseMinutes: number | null
  sunsetMinutes: number | null
  timezone: string
}

const DEFAULT_WAKE_TIME = '07:00'

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseTimeToMinutes(value: string) {
  const [hoursText, minutesText] = value.split(':')
  const hours = Number(hoursText)
  const minutes = Number(minutesText)

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null
  }

  return hours * 60 + minutes
}

function parseApiTimeToMinutes(value: string) {
  const timeValue = value.split('T')[1] ?? ''
  return parseTimeToMinutes(timeValue.slice(0, 5))
}

function formatTimeLabel(totalMinutes: number) {
  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440
  const dayOffset = Math.floor(totalMinutes / 1440)
  const hours = Math.floor(normalizedMinutes / 60)
  const minutes = normalizedMinutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = ((hours + 11) % 12) + 1
  const dayLabel =
    dayOffset === 1 ? ' (next day)' : dayOffset > 1 ? ` (+${dayOffset}d)` : ''

  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}${dayLabel}`
}

function formatWindowLabel(startMinutes: number, endMinutes: number) {
  return `${formatTimeLabel(startMinutes)} - ${formatTimeLabel(endMinutes)}`
}

function clampToRange(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function getTimelinePosition(minutesFromWake: number) {
  return clampToRange((minutesFromWake / 960) * 100, 0, 100)
}

function getLocationStatusMessage(
  geolocationStatus: GeolocationStatus,
  solarStatus: SolarStatus
) {
  if (geolocationStatus === 'requesting') {
    return 'Checking your current location to align today’s light windows with local daylight.'
  }

  if (geolocationStatus === 'denied') {
    return 'Location access was denied, so these windows use your wake-up time only.'
  }

  if (geolocationStatus === 'unsupported') {
    return 'Location access is not available in this browser, so these windows use your wake-up time only.'
  }

  if (geolocationStatus === 'error') {
    return 'Current location could not be read, so these windows use your wake-up time only.'
  }

  if (solarStatus === 'loading') {
    return 'Local sunrise and sunset are loading for the selected date.'
  }

  if (solarStatus === 'error') {
    return 'Daylight timing could not be loaded, so these windows use your wake-up time only.'
  }

  if (solarStatus === 'ready') {
    return 'These windows are adjusted using your local sunrise and sunset for the selected date.'
  }

  return 'Use current location to refine the schedule with local sunrise and sunset.'
}

function CircadianRhythmOptimizer() {
  const [wakeTime, setWakeTime] = useState(DEFAULT_WAKE_TIME)
  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateInput(new Date())
  )
  const [geolocationStatus, setGeolocationStatus] =
    useState<GeolocationStatus>('idle')
  const [solarStatus, setSolarStatus] = useState<SolarStatus>('idle')
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [solarData, setSolarData] = useState<SolarData | null>(null)
  const [locationMessage, setLocationMessage] = useState('')

  const browserTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time'

  useEffect(() => {
    if (!coordinates) {
      setSolarStatus('idle')
      setSolarData(null)
      return
    }

    const currentCoordinates = coordinates
    const controller = new AbortController()

    async function loadSolarData() {
      setSolarStatus('loading')

      try {
        const params = new URLSearchParams({
          latitude: String(currentCoordinates.latitude),
          longitude: String(currentCoordinates.longitude),
          daily: 'sunrise,sunset',
          timezone: 'auto',
          start_date: selectedDate,
          end_date: selectedDate,
        })

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Unable to load daylight data.')
        }

        const data = (await response.json()) as {
          timezone?: string
          daily?: {
            sunrise?: string[]
            sunset?: string[]
          }
        }

        const sunriseMinutes = parseApiTimeToMinutes(
          data.daily?.sunrise?.[0] ?? ''
        )
        const sunsetMinutes = parseApiTimeToMinutes(
          data.daily?.sunset?.[0] ?? ''
        )

        if (sunriseMinutes === null || sunsetMinutes === null) {
          throw new Error('Missing sunrise or sunset time.')
        }

        setSolarData({
          sunriseMinutes,
          sunsetMinutes,
          timezone: data.timezone || browserTimeZone,
        })
        setSolarStatus('ready')
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }

        setSolarData(null)
        setSolarStatus('error')
      }
    }

    void loadSolarData()

    return () => controller.abort()
  }, [browserTimeZone, coordinates, selectedDate])

  const result = useMemo<CalculationResult>(() => {
    const wakeMinutes = parseTimeToMinutes(wakeTime)

    if (!selectedDate || wakeMinutes === null) {
      return {
        hasValidInput: false,
        error: 'Enter a wake-up time and date to build your light schedule.',
        wakeMinutes: 0,
        bedtimeMinutes: 0,
        morningStart: 0,
        morningEnd: 0,
        dimStart: 0,
        dimEnd: 0,
        isSolarAdjusted: false,
        modelNote: '',
        sunriseMinutes: null,
        sunsetMinutes: null,
        timezone: browserTimeZone,
      }
    }

    const bedtimeMinutes = wakeMinutes + 16 * 60
    const baseMorningStart = wakeMinutes + 30
    const baseMorningEnd = wakeMinutes + 120
    const baseDimStart = bedtimeMinutes - 180
    const baseDimEnd = bedtimeMinutes - 60

    let morningStart = baseMorningStart
    let morningEnd = baseMorningEnd
    let dimStart = baseDimStart
    let dimEnd = baseDimEnd
    let modelNote =
      'Built from your wake-up time. Add current location for daylight-based refinement.'
    let isSolarAdjusted = false

    if (solarStatus === 'ready' && solarData) {
      const solarMorningStart = Math.max(
        baseMorningStart,
        solarData.sunriseMinutes - 30
      )
      const solarMorningEnd = Math.min(
        baseMorningEnd,
        solarData.sunriseMinutes + 90
      )

      if (solarMorningEnd - solarMorningStart >= 30) {
        morningStart = solarMorningStart
        morningEnd = solarMorningEnd
      } else {
        morningStart = wakeMinutes + 30
        morningEnd = wakeMinutes + 90
      }

      const solarDimStart = Math.max(baseDimStart, solarData.sunsetMinutes - 30)

      if (solarDimStart < baseDimEnd) {
        dimStart = solarDimStart
        dimEnd = baseDimEnd
      } else {
        dimStart = bedtimeMinutes - 150
        dimEnd = bedtimeMinutes - 60
      }

      modelNote = `Adjusted to local daylight in ${solarData.timezone}.`
      isSolarAdjusted = true
    } else if (geolocationStatus === 'denied') {
      modelNote =
        'Location access was denied, so this is an approximate wake-time schedule.'
    } else if (
      geolocationStatus === 'unsupported' ||
      geolocationStatus === 'error' ||
      solarStatus === 'error'
    ) {
      modelNote =
        'Daylight timing was unavailable, so this is an approximate wake-time schedule.'
    }

    return {
      hasValidInput: true,
      error: '',
      wakeMinutes,
      bedtimeMinutes,
      morningStart,
      morningEnd,
      dimStart,
      dimEnd,
      isSolarAdjusted,
      modelNote,
      sunriseMinutes: solarData?.sunriseMinutes ?? null,
      sunsetMinutes: solarData?.sunsetMinutes ?? null,
      timezone: solarData?.timezone ?? browserTimeZone,
    }
  }, [
    browserTimeZone,
    geolocationStatus,
    selectedDate,
    solarData,
    solarStatus,
    wakeTime,
  ])

  const handleUseCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setCoordinates(null)
      setGeolocationStatus('unsupported')
      setLocationMessage('Location access is not supported in this browser.')
      return
    }

    setGeolocationStatus('requesting')
    setLocationMessage('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setGeolocationStatus('ready')
        setLocationMessage(
          'Current location captured for local daylight timing.'
        )
      },
      (error) => {
        setCoordinates(null)
        setSolarData(null)
        setSolarStatus('idle')

        if (error.code === error.PERMISSION_DENIED) {
          setGeolocationStatus('denied')
          setLocationMessage(
            'Location access was denied. You can retry whenever you want.'
          )
          return
        }

        setGeolocationStatus('error')
        setLocationMessage(
          'Current location could not be fetched right now. Please try again.'
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  const handleReset = () => {
    setWakeTime(DEFAULT_WAKE_TIME)
    setSelectedDate(formatDateInput(new Date()))
    setCoordinates(null)
    setGeolocationStatus('idle')
    setSolarStatus('idle')
    setSolarData(null)
    setLocationMessage('')
  }

  const locationSummary = coordinates
    ? `${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}`
    : browserTimeZone
  const timelineSunrisePosition =
    result.hasValidInput && result.sunriseMinutes !== null
      ? getTimelinePosition(result.sunriseMinutes - result.wakeMinutes)
      : null
  const timelineSunsetPosition =
    result.hasValidInput && result.sunsetMinutes !== null
      ? getTimelinePosition(result.sunsetMinutes - result.wakeMinutes)
      : null

  const summaryCards: ResultCard[] = result.hasValidInput
    ? [
        {
          label: 'Morning Light',
          value: formatWindowLabel(result.morningStart, result.morningEnd),
          note: 'Use outdoor daylight or a bright walk soon after waking.',
          icon: LightModeRoundedIcon,
        },
        {
          label: 'Dim Lights',
          value: formatWindowLabel(result.dimStart, result.dimEnd),
          note: 'Lower bright overhead light and screens as bedtime gets closer.',
          icon: DarkModeRoundedIcon,
        },
        {
          label: 'Estimated Bedtime',
          value: formatTimeLabel(result.bedtimeMinutes),
          note: 'Built from a 16-hour wake window to keep the schedule simple.',
          icon: BedtimeRoundedIcon,
        },
        {
          label: 'Location Mode',
          value: result.isSolarAdjusted
            ? 'Daylight-adjusted'
            : 'Wake-time based',
          note: result.modelNote,
          icon: NearMeRoundedIcon,
        },
      ]
    : []

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 780 }}>
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
                Circadian Rhythm Optimizer
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 }, maxWidth: 720 }}
            >
              Turn your wake-up time and current location into light windows for
              morning sunlight and evening dim-light habits.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Wake-up Time"
                    type="time"
                    value={wakeTime}
                    onChange={(event) => setWakeTime(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="Date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <Box
                    sx={(theme) => ({
                      p: 1.5,
                      border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.03)'
                          : 'rgba(255,255,255,0.56)',
                    })}
                  >
                    <Stack spacing={1.1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <MyLocationRoundedIcon
                            sx={{ color: 'secondary.main', fontSize: 20 }}
                          />
                          <Typography sx={{ fontWeight: 700 }}>
                            Current Location
                          </Typography>
                        </Stack>
                        {geolocationStatus === 'requesting' ||
                        solarStatus === 'loading' ? (
                          <CircularProgress size={18} />
                        ) : null}
                      </Stack>

                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: '0.94rem' }}
                      >
                        {getLocationStatusMessage(
                          geolocationStatus,
                          solarStatus
                        )}
                      </Typography>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        flexWrap="wrap"
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<MyLocationRoundedIcon />}
                          onClick={handleUseCurrentLocation}
                          disabled={
                            geolocationStatus === 'requesting' ||
                            solarStatus === 'loading'
                          }
                          sx={{
                            borderRadius: 0,
                            boxShadow: 'none',
                            alignSelf: 'flex-start',
                          }}
                        >
                          Use Current Location
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          startIcon={<AutorenewRoundedIcon />}
                          onClick={handleReset}
                          sx={{ borderRadius: 0, alignSelf: 'flex-start' }}
                        >
                          Reset
                        </Button>
                      </Stack>

                      <Stack spacing={0.5}>
                        <Typography
                          sx={{ fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          Active reference
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{ fontSize: '0.92rem' }}
                        >
                          {locationSummary}
                        </Typography>
                        {locationMessage ? (
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: '0.86rem' }}
                          >
                            {locationMessage}
                          </Typography>
                        ) : null}
                      </Stack>
                    </Stack>
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
                {result.hasValidInput ? (
                  <Stack spacing={1.75}>
                    <Grid container spacing={1.2}>
                      {summaryCards.map((card) => {
                        const Icon = card.icon

                        return (
                          <Grid key={card.label} size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={(theme) => ({
                                p: 1.5,
                                minHeight: '100%',
                                border: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
                                background:
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.03)'
                                    : 'rgba(255,255,255,0.9)',
                              })}
                            >
                              <Stack spacing={1}>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Box
                                    sx={(theme) => ({
                                      display: 'inline-flex',
                                      p: 0.75,
                                      borderRadius: 999,
                                      backgroundColor: alpha(
                                        theme.palette.secondary.main,
                                        theme.palette.mode === 'dark'
                                          ? 0.18
                                          : 0.12
                                      ),
                                    })}
                                  >
                                    <Icon
                                      sx={{
                                        fontSize: 18,
                                        color: 'secondary.main',
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    sx={{
                                      fontSize: '0.84rem',
                                      fontWeight: 700,
                                    }}
                                  >
                                    {card.label}
                                  </Typography>
                                </Stack>
                                <Typography
                                  sx={{
                                    fontSize: { xs: '1rem', md: '1.08rem' },
                                    fontWeight: 700,
                                    lineHeight: 1.35,
                                  }}
                                >
                                  {card.value}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  sx={{ fontSize: '0.88rem', lineHeight: 1.65 }}
                                >
                                  {card.note}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>

                    <Divider flexItem />

                    <Stack spacing={1.2}>
                      <Box>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          Daily Rhythm Timeline
                        </Typography>
                        <Typography color="text.secondary">
                          A simple wake-to-sleep view of when to get bright
                          light and when to start softening it.
                        </Typography>
                      </Box>

                      <Box
                        sx={(theme) => ({
                          position: 'relative',
                          p: { xs: 1.5, md: 1.75 },
                          border: `1px solid ${alpha(theme.palette.divider, 0.84)}`,
                          background:
                            theme.palette.mode === 'dark'
                              ? 'linear-gradient(90deg, rgba(255,183,77,0.08) 0%, rgba(255,255,255,0.02) 32%, rgba(144,202,249,0.06) 100%)'
                              : 'linear-gradient(90deg, rgba(255,224,178,0.5) 0%, rgba(255,255,255,0.76) 36%, rgba(227,242,253,0.72) 100%)',
                        })}
                      >
                        <Stack spacing={1.2}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={1}
                          >
                            <Typography sx={{ fontWeight: 700 }}>
                              Wake
                            </Typography>
                            <Typography sx={{ fontWeight: 700 }}>
                              Sleep
                            </Typography>
                          </Stack>

                          <Box
                            sx={(theme) => ({
                              position: 'relative',
                              height: 58,
                              border: `1px solid ${theme.palette.divider}`,
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(4, 10, 20, 0.58)'
                                  : 'rgba(255,255,255,0.7)',
                              overflow: 'hidden',
                            })}
                          >
                            <Box
                              sx={(theme) => ({
                                position: 'absolute',
                                inset: 0,
                                background:
                                  theme.palette.mode === 'dark'
                                    ? 'linear-gradient(90deg, rgba(255,183,77,0.08) 0%, rgba(255,213,79,0.2) 18%, rgba(100,181,246,0.16) 72%, rgba(13,27,42,0.14) 100%)'
                                    : 'linear-gradient(90deg, rgba(255,224,178,0.82) 0%, rgba(255,241,118,0.6) 22%, rgba(144,202,249,0.5) 72%, rgba(207,216,220,0.72) 100%)',
                              })}
                            />

                            <Box
                              sx={(theme) => ({
                                position: 'absolute',
                                left: `${getTimelinePosition(
                                  result.morningStart - result.wakeMinutes
                                )}%`,
                                width: `${Math.max(
                                  getTimelinePosition(
                                    result.morningEnd - result.wakeMinutes
                                  ) -
                                    getTimelinePosition(
                                      result.morningStart - result.wakeMinutes
                                    ),
                                  4
                                )}%`,
                                top: 10,
                                height: 14,
                                backgroundColor: alpha(
                                  theme.palette.warning.main,
                                  theme.palette.mode === 'dark' ? 0.65 : 0.48
                                ),
                                border: `1px solid ${alpha(
                                  theme.palette.warning.main,
                                  0.72
                                )}`,
                              })}
                            />

                            <Box
                              sx={(theme) => ({
                                position: 'absolute',
                                left: `${getTimelinePosition(
                                  result.dimStart - result.wakeMinutes
                                )}%`,
                                width: `${Math.max(
                                  getTimelinePosition(
                                    result.dimEnd - result.wakeMinutes
                                  ) -
                                    getTimelinePosition(
                                      result.dimStart - result.wakeMinutes
                                    ),
                                  4
                                )}%`,
                                bottom: 10,
                                height: 14,
                                backgroundColor: alpha(
                                  theme.palette.info.main,
                                  theme.palette.mode === 'dark' ? 0.5 : 0.4
                                ),
                                border: `1px solid ${alpha(
                                  theme.palette.info.main,
                                  0.68
                                )}`,
                              })}
                            />

                            {[0, 25, 50, 75, 100].map((stop) => (
                              <Box
                                key={stop}
                                sx={(theme) => ({
                                  position: 'absolute',
                                  left: `${stop}%`,
                                  top: 0,
                                  bottom: 0,
                                  width: 1,
                                  backgroundColor: alpha(
                                    theme.palette.divider,
                                    0.6
                                  ),
                                })}
                              />
                            ))}

                            <Box
                              sx={(theme) => ({
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                backgroundColor: theme.palette.secondary.main,
                              })}
                            />

                            <Box
                              sx={(theme) => ({
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: 2,
                                backgroundColor: alpha(
                                  theme.palette.text.primary,
                                  0.7
                                ),
                              })}
                            />

                            {timelineSunrisePosition !== null ? (
                              <Box
                                sx={(theme) => ({
                                  position: 'absolute',
                                  left: `${timelineSunrisePosition}%`,
                                  top: 4,
                                  bottom: 4,
                                  width: 2,
                                  backgroundColor: alpha(
                                    theme.palette.warning.light,
                                    0.92
                                  ),
                                })}
                              />
                            ) : null}

                            {timelineSunsetPosition !== null ? (
                              <Box
                                sx={(theme) => ({
                                  position: 'absolute',
                                  left: `${timelineSunsetPosition}%`,
                                  top: 4,
                                  bottom: 4,
                                  width: 2,
                                  backgroundColor: alpha(
                                    theme.palette.info.light,
                                    0.92
                                  ),
                                })}
                              />
                            ) : null}
                          </Box>

                          <Grid container spacing={1}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Stack spacing={0.45}>
                                <Typography
                                  sx={{ fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                  Wake: {formatTimeLabel(result.wakeMinutes)}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  sx={{ fontSize: '0.84rem' }}
                                >
                                  Start your day with a bright anchor quickly.
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Stack spacing={0.45}>
                                <Typography
                                  sx={{ fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                  Sleep:{' '}
                                  {formatTimeLabel(result.bedtimeMinutes)}
                                </Typography>
                                <Typography
                                  color="text.secondary"
                                  sx={{ fontSize: '0.84rem' }}
                                >
                                  Ease into lower light before this point.
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider flexItem />

                    <Stack spacing={1}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Rhythm Note
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>
                        Your bright-light anchor begins within the first two
                        waking hours, while your dim-light phase begins about
                        two to three hours before bed.
                      </Typography>
                      <Typography color="text.secondary">
                        {result.modelNote} Local time reference:{' '}
                        {result.timezone}.
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">{result.error}</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default CircadianRhythmOptimizer
