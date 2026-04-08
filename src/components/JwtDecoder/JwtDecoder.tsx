'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

type ParsedJson = Record<string, unknown>

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddingLength = (4 - (normalized.length % 4)) % 4
  const padded = normalized.padEnd(normalized.length + paddingLength, '=')
  const binary = window.atob(padded)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function parseJwtJson(segment: string, label: string) {
  try {
    return JSON.parse(decodeBase64Url(segment)) as ParsedJson
  } catch {
    throw new Error(`The ${label} section could not be decoded as JSON.`)
  }
}

function formatJson(value: ParsedJson | null) {
  if (!value) {
    return ''
  }

  return JSON.stringify(value, null, 2)
}

function formatTimestamp(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return ''
  }

  return new Date(value * 1000).toLocaleString()
}

function JwtDecoder() {
  const [token, setToken] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [currentEpochSeconds, setCurrentEpochSeconds] = useState(0)

  useEffect(() => {
    setCurrentEpochSeconds(Math.floor(Date.now() / 1000))
  }, [token])

  const result = useMemo(() => {
    const trimmedToken = token.trim()

    if (!trimmedToken) {
      return {
        error: '',
        header: null as ParsedJson | null,
        payload: null as ParsedJson | null,
        signature: '',
      }
    }

    const parts = trimmedToken.split('.')

    if (parts.length !== 3) {
      return {
        error: 'Enter a token with header, payload, and signature sections.',
        header: null,
        payload: null,
        signature: '',
      }
    }

    try {
      const header = parseJwtJson(parts[0], 'header')
      const payload = parseJwtJson(parts[1], 'payload')

      return {
        error: '',
        header,
        payload,
        signature: parts[2],
      }
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to decode this token.',
        header: null,
        payload: null,
        signature: '',
      }
    }
  }, [token])

  const summaryItems = useMemo(() => {
    if (!result.header || !result.payload) {
      return []
    }

    const payload = result.payload
    const header = result.header

    return [
      {
        label: 'Algorithm',
        value: typeof header.alg === 'string' ? header.alg : 'Not provided',
      },
      {
        label: 'Type',
        value: typeof header.typ === 'string' ? header.typ : 'Not provided',
      },
      {
        label: 'Issuer',
        value: typeof payload.iss === 'string' ? payload.iss : 'Not provided',
      },
      {
        label: 'Subject',
        value: typeof payload.sub === 'string' ? payload.sub : 'Not provided',
      },
      {
        label: 'Audience',
        value:
          typeof payload.aud === 'string'
            ? payload.aud
            : Array.isArray(payload.aud)
              ? payload.aud.join(', ')
              : 'Not provided',
      },
      {
        label: 'Issued at',
        value: formatTimestamp(payload.iat) || 'Not provided',
      },
      {
        label: 'Not before',
        value: formatTimestamp(payload.nbf) || 'Not provided',
      },
      {
        label: 'Expires at',
        value: formatTimestamp(payload.exp) || 'Not provided',
      },
      {
        label: 'Status',
        value:
          typeof payload.nbf === 'number' && payload.nbf > currentEpochSeconds
            ? 'Not valid yet'
            : typeof payload.exp === 'number' &&
                payload.exp <= currentEpochSeconds
              ? 'Expired'
              : 'Time window looks active',
      },
    ]
  }, [currentEpochSeconds, result.header, result.payload])

  async function handleCopy(value: string, successMessage: string) {
    if (!value) {
      setSnackbarMessage('Nothing to copy yet.')
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setSnackbarMessage(successMessage)
    } catch {
      setSnackbarMessage('Unable to copy right now.')
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
                  JWT Decoder
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Decode JWT header and payload values, inspect timing claims, and
                review algorithm details without sending the token anywhere.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 1.75 }}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={{ xs: 2, md: 1.75 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={12}
                      label="JWT Token"
                      placeholder="Paste a token like header.payload.signature"
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      error={Boolean(result.error)}
                      helperText={
                        result.error ||
                        'The token is decoded only. Signature verification is not performed.'
                      }
                    />

                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={() => setToken('')}
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
                  <Stack spacing={1.5}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Decoded Token
                      </Typography>
                      <Chip
                        icon={<WarningAmberRoundedIcon />}
                        label="Signature not verified"
                        color="warning"
                        variant="outlined"
                      />
                    </Stack>

                    {result.header && result.payload ? (
                      <Stack spacing={1.5}>
                        <Grid container spacing={1}>
                          {summaryItems.map((item) => (
                            <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                              <Box
                                sx={{
                                  p: 1.25,
                                  border: '1px solid rgba(11, 31, 51, 0.08)',
                                  backgroundColor: 'rgba(255,255,255,0.72)',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {item.label}
                                </Typography>
                                <Typography
                                  sx={{ mt: 0.35, wordBreak: 'break-word' }}
                                >
                                  {item.value}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        <Grid container spacing={1.5}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={0.75}>
                              <Typography color="text.secondary">
                                Header
                              </Typography>
                              <TextField
                                fullWidth
                                multiline
                                minRows={8}
                                value={formatJson(result.header)}
                                slotProps={{ input: { readOnly: true } }}
                              />
                              <Button
                                variant="text"
                                size="small"
                                startIcon={<ContentCopyRoundedIcon />}
                                onClick={() =>
                                  handleCopy(
                                    formatJson(result.header),
                                    'Header copied.'
                                  )
                                }
                                sx={{ alignSelf: 'flex-start' }}
                              >
                                Copy Header
                              </Button>
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={0.75}>
                              <Typography color="text.secondary">
                                Payload
                              </Typography>
                              <TextField
                                fullWidth
                                multiline
                                minRows={8}
                                value={formatJson(result.payload)}
                                slotProps={{ input: { readOnly: true } }}
                              />
                              <Button
                                variant="text"
                                size="small"
                                startIcon={<ContentCopyRoundedIcon />}
                                onClick={() =>
                                  handleCopy(
                                    formatJson(result.payload),
                                    'Payload copied.'
                                  )
                                }
                                sx={{ alignSelf: 'flex-start' }}
                              >
                                Copy Payload
                              </Button>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Stack spacing={0.75}>
                          <Typography color="text.secondary">
                            Signature
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            value={result.signature}
                            slotProps={{ input: { readOnly: true } }}
                          />
                        </Stack>
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Paste a JWT to inspect its header, payload, and timing
                        details here.
                      </Typography>
                    )}
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

export default JwtDecoder
