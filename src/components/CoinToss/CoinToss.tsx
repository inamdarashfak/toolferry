'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'

type CoinSide = 'Heads' | 'Tails'

const FLIP_DURATION_MS = 1800
const MAX_HISTORY = 5

function getRandomResult(): CoinSide {
  return Math.random() < 0.5 ? 'Heads' : 'Tails'
}

function CoinToss() {
  const timeoutRef = useRef<number | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<CoinSide | null>(null)
  const [queuedResult, setQueuedResult] = useState<CoinSide | null>(null)
  const [rotationDegrees, setRotationDegrees] = useState(0)
  const [history, setHistory] = useState<CoinSide[]>([])
  const [streakSide, setStreakSide] = useState<CoinSide | null>(null)
  const [streakCount, setStreakCount] = useState(0)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleFlip = () => {
    if (isFlipping) {
      return
    }

    const nextResult = getRandomResult()
    const extraTurns = 2160 + Math.floor(Math.random() * 3) * 360

    setIsFlipping(true)
    setQueuedResult(nextResult)
    setResult(null)
    setRotationDegrees((currentRotation) => currentRotation + extraTurns)

    timeoutRef.current = window.setTimeout(() => {
      setResult(nextResult)
      setQueuedResult(null)
      setIsFlipping(false)
      setHistory((currentHistory) =>
        [nextResult, ...currentHistory].slice(0, MAX_HISTORY)
      )
      setStreakSide((currentStreakSide) => {
        if (currentStreakSide === nextResult) {
          setStreakCount((currentStreakCount) => currentStreakCount + 1)
          return currentStreakSide
        }

        setStreakCount(1)
        return nextResult
      })
      timeoutRef.current = null
    }, FLIP_DURATION_MS)
  }

  const statusText = isFlipping
    ? 'Flipping...'
    : result
      ? `${result} wins`
      : 'Tap the button to toss the coin'

  const streakLabel =
    streakCount > 1 && streakSide
      ? `${streakSide} streak: ${streakCount}`
      : 'No active streak'
  const displaySide = result
  const coinTone = displaySide === 'Tails' ? 'tails' : 'heads'
  const coinMark =
    displaySide === 'Tails' ? 'T' : displaySide === 'Heads' ? 'H' : '?'
  const coinLabel = displaySide ?? 'Coin'

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
                Coin Toss
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Flip a coin, watch it toss, and get heads or tails in a quick,
              smooth animation.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                sx={(theme) => ({
                  ...getCalculatorPanelSx(theme),
                  minHeight: '100%',
                })}
              >
                <Stack spacing={{ xs: 2.25, md: 2 }} alignItems="center">
                  <Box
                    sx={{
                      width: '100%',
                      minHeight: { xs: 300, md: 340 },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      perspective: '1400px',
                    }}
                  >
                    <Box
                      sx={(theme) => ({
                        width: { xs: 164, sm: 184, md: 208 },
                        height: { xs: 164, sm: 184, md: 208 },
                        position: 'relative',
                        transition: `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.16, 0.84, 0.26, 1)`,
                        transform: `rotateY(${rotationDegrees}deg)`,
                        filter:
                          result && !isFlipping
                            ? `drop-shadow(0 0 28px ${alpha(theme.palette.warning.main, 0.36)})`
                            : 'drop-shadow(0 16px 24px rgba(11, 31, 51, 0.18))',
                        borderRadius: '50%',
                        border: `4px solid ${alpha(theme.palette.common.white, 0.32)}`,
                        background:
                          coinTone === 'tails'
                            ? 'radial-gradient(circle at 30% 30%, #d8ecff 0%, #7caee6 52%, #295c96 100%)'
                            : 'radial-gradient(circle at 30% 30%, #ffe7a3 0%, #f4bf45 52%, #c77a17 100%)',
                        boxShadow:
                          coinTone === 'tails'
                            ? 'inset 0 4px 18px rgba(255,255,255,0.32), inset 0 -12px 24px rgba(14,42,74,0.28)'
                            : 'inset 0 4px 18px rgba(255,255,255,0.42), inset 0 -12px 24px rgba(115,62,9,0.24)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Box
                        sx={(theme) => ({
                          width: '72%',
                          height: '72%',
                          borderRadius: '50%',
                          border: `2px solid ${alpha(theme.palette.common.white, 0.28)}`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          backgroundColor: alpha(
                            theme.palette.common.white,
                            0.08
                          ),
                          opacity: isFlipping ? 0 : 1,
                          transform: 'translateZ(0)',
                          transition: 'opacity 160ms ease',
                        })}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: '2.4rem', md: '2.8rem' },
                            fontWeight: 800,
                            color: 'common.white',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.18)',
                            lineHeight: 1,
                          }}
                        >
                          {coinMark}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: '0.72rem', md: '0.8rem' },
                            fontWeight: 700,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: alpha('#ffffff', 0.9),
                          }}
                        >
                          {coinLabel}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack
                      spacing={0.75}
                      alignItems="center"
                      sx={{ minHeight: 68 }}
                    >
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        {isFlipping ? 'Coin in motion' : 'Result'}
                      </Typography>
                      <Typography
                        sx={(theme) => ({
                          fontSize: { xs: '1.2rem', md: '1.35rem' },
                          fontWeight: 800,
                          textAlign: 'center',
                          color:
                            result && !isFlipping
                              ? theme.palette.warning.main
                              : theme.palette.text.primary,
                        })}
                      >
                        {statusText}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ textAlign: 'center' }}
                      >
                        {queuedResult && isFlipping
                          ? 'Result will reveal once the flip finishes.'
                          : 'Heads and tails each have an even 50/50 chance.'}
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleFlip}
                      disabled={isFlipping}
                      sx={{
                        minWidth: { xs: '100%', sm: 220 },
                        borderRadius: 0,
                        py: 1.2,
                      }}
                    >
                      {isFlipping ? 'Flipping...' : 'Flip Coin'}
                    </Button>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={{ xs: 2, md: 1.75 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1.5} divider={<Divider flexItem />}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Flip Summary
                      </Typography>
                    </Box>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={0.5}
                    >
                      <Typography color="text.secondary">
                        Latest Result
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>
                        {result ?? 'Waiting for first flip'}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={0.5}
                    >
                      <Typography color="text.secondary">
                        Current Streak
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BoltRoundedIcon
                          color={streakCount > 1 ? 'warning' : 'disabled'}
                          fontSize="small"
                        />
                        <Typography sx={{ fontWeight: 700 }}>
                          {streakLabel}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Last 5 Flips
                      </Typography>
                    </Box>

                    {history.length ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {history.map((item, index) => (
                          <Chip
                            key={`${item}-${index}`}
                            label={item}
                            color={item === 'Heads' ? 'warning' : 'primary'}
                            variant={index === 0 ? 'filled' : 'outlined'}
                            sx={{ borderRadius: 0, fontWeight: 600 }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Your most recent flips will appear here once you start
                        tossing the coin.
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

export default CoinToss
