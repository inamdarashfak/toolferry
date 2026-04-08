'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import {
  v1 as uuidv1,
  v4 as uuidv4,
  v7 as uuidv7,
  validate as validateUuid,
  version as uuidVersion,
} from 'uuid'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

type UuidMode = 'generate' | 'validate'
type UuidVersionOption = 'v1' | 'v4' | 'v7'

type ValidationResult = {
  value: string
  isValid: boolean
  label: string
}

const MAX_UUIDS = 50

function createUuids(version: UuidVersionOption, quantity: number) {
  return Array.from({ length: quantity }, () => {
    if (version === 'v1') {
      return uuidv1()
    }

    if (version === 'v7') {
      return uuidv7()
    }

    return uuidv4()
  })
}

function UuidGeneratorValidator() {
  const [mode, setMode] = useState<UuidMode>('generate')
  const [uuidVersionOption, setUuidVersionOption] =
    useState<UuidVersionOption>('v4')
  const [quantity, setQuantity] = useState('5')
  const [generatedUuids, setGeneratedUuids] = useState(() =>
    createUuids('v4', 5)
  )
  const [validationInput, setValidationInput] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const quantityValue = useMemo(() => {
    const parsed = Number(quantity)

    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1
    }

    return Math.min(Math.floor(parsed), MAX_UUIDS)
  }, [quantity])

  const validationResults = useMemo<ValidationResult[]>(() => {
    return validationInput
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => {
        const isValid = validateUuid(value)

        return {
          value,
          isValid,
          label: isValid ? `Valid UUID v${uuidVersion(value)}` : 'Invalid UUID',
        }
      })
  }, [validationInput])

  function handleGenerate() {
    setGeneratedUuids(createUuids(uuidVersionOption, quantityValue))
  }

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
                  UUID Generator / Validator
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Generate UUIDs in common versions or validate pasted UUID values
                from one compact developer workspace.
              </Typography>
            </Box>

            <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
              <Tabs
                value={mode}
                onChange={(_, value: UuidMode) => setMode(value)}
                variant="fullWidth"
              >
                <Tab value="generate" label="Generate" />
                <Tab value="validate" label="Validate" />
              </Tabs>
            </Paper>

            {mode === 'generate' ? (
              <Grid container spacing={{ xs: 2, md: 1.75 }}>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                    <Stack spacing={{ xs: 2, md: 1.75 }}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="UUID Version"
                        value={uuidVersionOption}
                        onChange={(event) =>
                          setUuidVersionOption(
                            event.target.value as UuidVersionOption
                          )
                        }
                      >
                        <MenuItem value="v1">UUID v1</MenuItem>
                        <MenuItem value="v4">UUID v4</MenuItem>
                        <MenuItem value="v7">UUID v7</MenuItem>
                      </TextField>

                      <TextField
                        fullWidth
                        size="small"
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        helperText={`Generate between 1 and ${MAX_UUIDS} UUIDs at a time.`}
                      />

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                      >
                        <Button
                          variant="contained"
                          startIcon={<AutorenewRoundedIcon />}
                          onClick={handleGenerate}
                        >
                          Generate UUIDs
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setUuidVersionOption('v4')
                            setQuantity('5')
                            setGeneratedUuids(createUuids('v4', 5))
                          }}
                        >
                          Reset
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
                          Generated UUIDs
                        </Typography>
                      </Box>

                      <Stack spacing={1}>
                        {generatedUuids.map((value) => (
                          <Stack
                            key={value}
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                            justifyContent="space-between"
                            sx={{
                              p: 1.25,
                              border: '1px solid rgba(11, 31, 51, 0.08)',
                              backgroundColor: 'rgba(255,255,255,0.72)',
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: 'monospace',
                                wordBreak: 'break-all',
                              }}
                            >
                              {value}
                            </Typography>
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<ContentCopyRoundedIcon />}
                              onClick={() => handleCopy(value, 'UUID copied.')}
                              sx={{
                                alignSelf: { xs: 'flex-start', sm: 'center' },
                              }}
                            >
                              Copy
                            </Button>
                          </Stack>
                        ))}
                      </Stack>

                      <Button
                        variant="contained"
                        startIcon={<ContentCopyRoundedIcon />}
                        onClick={() =>
                          handleCopy(
                            generatedUuids.join('\n'),
                            'UUID list copied.'
                          )
                        }
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Copy All
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={{ xs: 2, md: 1.75 }}>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                    <Stack spacing={{ xs: 2, md: 1.75 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={10}
                        label="Paste one UUID per line"
                        value={validationInput}
                        onChange={(event) =>
                          setValidationInput(event.target.value)
                        }
                      />

                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={() => setValidationInput('')}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Clear
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
                          Validation Results
                        </Typography>
                      </Box>

                      {validationResults.length ? (
                        <Stack spacing={1}>
                          {validationResults.map((result) => (
                            <Stack
                              key={result.value}
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={1}
                              alignItems={{ xs: 'stretch', sm: 'center' }}
                              justifyContent="space-between"
                              sx={{
                                p: 1.25,
                                border: '1px solid rgba(11, 31, 51, 0.08)',
                                backgroundColor: 'rgba(255,255,255,0.72)',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: 'monospace',
                                  wordBreak: 'break-all',
                                }}
                              >
                                {result.value}
                              </Typography>
                              <Chip
                                label={result.label}
                                color={result.isValid ? 'success' : 'default'}
                                variant={result.isValid ? 'filled' : 'outlined'}
                                sx={{
                                  alignSelf: { xs: 'flex-start', sm: 'center' },
                                }}
                              />
                            </Stack>
                          ))}
                        </Stack>
                      ) : (
                        <Typography color="text.secondary">
                          Paste one or more UUIDs to validate them here.
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            )}
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

export default UuidGeneratorValidator
