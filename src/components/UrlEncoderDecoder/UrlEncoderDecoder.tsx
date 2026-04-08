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

type UrlMode = 'encode' | 'decode'

function UrlEncoderDecoder() {
  const [mode, setMode] = useState<UrlMode>('encode')
  const [input, setInput] = useState(
    'https://toolferry.com/tools?tool=url encoder&tab=dev'
  )
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const result = useMemo(() => {
    try {
      const output =
        mode === 'encode'
          ? encodeURIComponent(input)
          : decodeURIComponent(input)

      return {
        error: '',
        output,
      }
    } catch {
      return {
        error: 'Enter a valid encoded URL string to decode.',
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
                  URL Encoder / Decoder
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Encode full URL strings for safer transport or decode encoded
                text back into a readable value from one simple workspace.
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
                        setMode(event.target.value as UrlMode)
                      }
                    >
                      <MenuItem value="encode">Encode URL text</MenuItem>
                      <MenuItem value="decode">Decode URL text</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      multiline
                      minRows={10}
                      label={
                        mode === 'encode' ? 'Text Input' : 'Encoded URL Input'
                      }
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
                        setInput(
                          'https://toolferry.com/tools?tool=url encoder&tab=dev'
                        )
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

export default UrlEncoderDecoder
