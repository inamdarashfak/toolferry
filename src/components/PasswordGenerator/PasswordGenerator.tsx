'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

const LOWERCASE = 'abcdefghjkmnpqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHJKMNPQRSTUVWXYZ'
const NUMBERS = '23456789'
const SYMBOLS = '!@#$%^&*()-_=+?'

type PasswordOptions = {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
}

function getRandomCharacter(pool: string) {
  const randomValues = new Uint32Array(1)
  window.crypto.getRandomValues(randomValues)
  return pool[randomValues[0] % pool.length]
}

function generatePassword(options: PasswordOptions) {
  const pools = [
    options.lowercase ? LOWERCASE : '',
    options.uppercase ? UPPERCASE : '',
    options.numbers ? NUMBERS : '',
    options.symbols ? SYMBOLS : '',
  ].filter(Boolean)

  if (!pools.length) {
    return ''
  }

  const requiredCharacters = pools.map((pool) => getRandomCharacter(pool))
  const fullPool = pools.join('')
  const remainingCharacters = Array.from(
    { length: Math.max(options.length - requiredCharacters.length, 0) },
    () => getRandomCharacter(fullPool)
  )
  const passwordCharacters = [...requiredCharacters, ...remainingCharacters]

  for (let index = passwordCharacters.length - 1; index > 0; index -= 1) {
    const randomValues = new Uint32Array(1)
    window.crypto.getRandomValues(randomValues)
    const swapIndex = randomValues[0] % (index + 1)
    ;[passwordCharacters[index], passwordCharacters[swapIndex]] = [
      passwordCharacters[swapIndex],
      passwordCharacters[index],
    ]
  }

  return passwordCharacters.join('')
}

function getStrengthLabel(options: PasswordOptions) {
  let score = 0

  if (options.length >= 12) {
    score += 1
  }

  if (options.length >= 16) {
    score += 1
  }

  if (options.lowercase) {
    score += 1
  }

  if (options.uppercase) {
    score += 1
  }

  if (options.numbers) {
    score += 1
  }

  if (options.symbols) {
    score += 1
  }

  if (score <= 2) {
    return 'Basic'
  }

  if (score <= 4) {
    return 'Good'
  }

  return 'Strong'
}

function PasswordGenerator() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [password, setPassword] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const validationMessage = useMemo(() => {
    if (
      !options.lowercase &&
      !options.uppercase &&
      !options.numbers &&
      !options.symbols
    ) {
      return 'Enable at least one character set.'
    }

    return ''
  }, [options])

  const strengthLabel = useMemo(() => getStrengthLabel(options), [options])

  useEffect(() => {
    if (validationMessage) {
      setPassword('')
      return
    }

    setPassword(generatePassword(options))
  }, [options, validationMessage])

  function handleRegenerate() {
    if (validationMessage) {
      return
    }

    setPassword(generatePassword(options))
  }

  async function handleCopy() {
    if (!password) {
      setSnackbarMessage('Generate a password first.')
      return
    }

    try {
      await navigator.clipboard.writeText(password)
      setSnackbarMessage('Password copied.')
    } catch {
      setSnackbarMessage('Unable to copy the password right now.')
    }
  }

  return (
    <>
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
                  Password Generator
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Generate strong passwords with adjustable length and character
                sets from one compact browser-based tool.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 1.75 }}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={{ xs: 2, md: 1.75 }}>
                    <Box>
                      <Typography gutterBottom>Password Length</Typography>
                      <Slider
                        value={options.length}
                        min={8}
                        max={40}
                        step={1}
                        valueLabelDisplay="auto"
                        onChange={(_, value) =>
                          setOptions((currentOptions) => ({
                            ...currentOptions,
                            length: value as number,
                          }))
                        }
                      />
                    </Box>

                    <Stack>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.lowercase}
                            onChange={(event) =>
                              setOptions((currentOptions) => ({
                                ...currentOptions,
                                lowercase: event.target.checked,
                              }))
                            }
                          />
                        }
                        label="Lowercase letters"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.uppercase}
                            onChange={(event) =>
                              setOptions((currentOptions) => ({
                                ...currentOptions,
                                uppercase: event.target.checked,
                              }))
                            }
                          />
                        }
                        label="Uppercase letters"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.numbers}
                            onChange={(event) =>
                              setOptions((currentOptions) => ({
                                ...currentOptions,
                                numbers: event.target.checked,
                              }))
                            }
                          />
                        }
                        label="Numbers"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={options.symbols}
                            onChange={(event) =>
                              setOptions((currentOptions) => ({
                                ...currentOptions,
                                symbols: event.target.checked,
                              }))
                            }
                          />
                        }
                        label="Symbols"
                      />
                    </Stack>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<AutorenewRoundedIcon />}
                        onClick={() => setOptions(DEFAULT_OPTIONS)}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<AutorenewRoundedIcon />}
                        onClick={handleRegenerate}
                        disabled={Boolean(validationMessage)}
                      >
                        Regenerate
                      </Button>
                    </Stack>
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
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Generated Password
                      </Typography>
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={validationMessage || password}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      error={Boolean(validationMessage)}
                    />

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Strength:{' '}
                        <Box
                          component="span"
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          {strengthLabel}
                        </Box>
                      </Typography>
                      <Typography color="text.secondary">
                        Length:{' '}
                        <Box
                          component="span"
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          {options.length}
                        </Box>
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      startIcon={<ContentCopyRoundedIcon />}
                      onClick={handleCopy}
                      disabled={!password}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Copy Password
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={2200}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </>
  )
}

export default PasswordGenerator
