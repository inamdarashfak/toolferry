'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

type Base64Mode = 'encode' | 'decode'

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return window.btoa(binary)
}

function decodeBase64(value: string) {
  const normalized = value.trim()

  if (!normalized) {
    return ''
  }

  const binary = window.atob(normalized)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function Base64EncoderDecoder() {
  const [mode, setMode] = useState<Base64Mode>('encode')
  const [input, setInput] = useState('Hello from Tool Ferry')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const result = useMemo(() => {
    try {
      const output =
        mode === 'encode' ? encodeBase64(input) : decodeBase64(input)

      return {
        error: '',
        output,
      }
    } catch {
      return {
        error: 'Enter valid Base64 text to decode.',
        output: '',
      }
    }
  }, [input, mode])

  async function handleCopy() {
    if (!result.output) {
      setSnackbarMessage('Nothing to copy yet.')
      return
    }

    try {
      await navigator.clipboard.writeText(result.output)
      setSnackbarMessage('Output copied.')
    } catch {
      setSnackbarMessage('Unable to copy the output right now.')
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
                  Base64 Encode / Decode
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Encode plain text into Base64 or decode Base64 back into
                readable text from one simple workspace.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 1.75 }}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={{ xs: 2, md: 1.75 }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Mode"
                      value={mode}
                      onChange={(event) =>
                        setMode(event.target.value as Base64Mode)
                      }
                    >
                      <MenuItem value="encode">Encode to Base64</MenuItem>
                      <MenuItem value="decode">Decode Base64</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      multiline
                      minRows={10}
                      label={mode === 'encode' ? 'Text Input' : 'Base64 Input'}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                    />

                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={() => {
                        setMode('encode')
                        setInput('Hello from Tool Ferry')
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
                  <Stack spacing={1.5}>
                    <Box>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Output
                      </Typography>
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      minRows={10}
                      value={result.error || result.output}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      error={Boolean(result.error)}
                    />

                    <Button
                      variant="contained"
                      startIcon={<ContentCopyRoundedIcon />}
                      onClick={handleCopy}
                      disabled={!result.output}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Copy Output
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

export default Base64EncoderDecoder
