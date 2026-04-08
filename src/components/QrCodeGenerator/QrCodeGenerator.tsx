'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

type QrMode = 'text' | 'url' | 'wifi' | 'contact'

const DEFAULT_STATE = {
  mode: 'url' as QrMode,
  text: 'https://toolferry.com',
  url: 'https://toolferry.com',
  wifiSsid: 'CafeGuest',
  wifiPassword: 'welcome123',
  wifiEncryption: 'WPA',
  contactName: 'Tool Ferry',
  contactPhone: '+1 555 010 2024',
  contactEmail: 'hello@example.com',
  contactCompany: 'Tool Ferry',
}

function buildQrValue(values: typeof DEFAULT_STATE) {
  if (values.mode === 'text') {
    return values.text.trim()
  }

  if (values.mode === 'url') {
    const value = values.url.trim()

    if (!value) {
      return ''
    }

    return /^https?:\/\//i.test(value) ? value : `https://${value}`
  }

  if (values.mode === 'wifi') {
    const ssid = values.wifiSsid.trim()

    if (!ssid) {
      return ''
    }

    const password = values.wifiPassword.trim()
    const encryption = values.wifiEncryption.trim()

    return `WIFI:T:${encryption};S:${ssid};P:${password};H:false;;`
  }

  const name = values.contactName.trim()

  if (!name) {
    return ''
  }

  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`]

  if (values.contactCompany.trim()) {
    lines.push(`ORG:${values.contactCompany.trim()}`)
  }

  if (values.contactPhone.trim()) {
    lines.push(`TEL:${values.contactPhone.trim()}`)
  }

  if (values.contactEmail.trim()) {
    lines.push(`EMAIL:${values.contactEmail.trim()}`)
  }

  lines.push('END:VCARD')

  return lines.join('\n')
}

function getValidationMessage(values: typeof DEFAULT_STATE) {
  if (values.mode === 'text' && !values.text.trim()) {
    return 'Enter text to generate a QR code.'
  }

  if (values.mode === 'url' && !values.url.trim()) {
    return 'Enter a URL or domain.'
  }

  if (values.mode === 'wifi' && !values.wifiSsid.trim()) {
    return 'Enter a Wi-Fi network name.'
  }

  if (values.mode === 'contact' && !values.contactName.trim()) {
    return 'Enter at least a contact name.'
  }

  return ''
}

function buildDownloadName(mode: QrMode) {
  return `qr-code-${mode}.png`
}

function QrCodeGenerator() {
  const [values, setValues] = useState(DEFAULT_STATE)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [qrError, setQrError] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const qrValue = useMemo(() => buildQrValue(values), [values])
  const validationMessage = useMemo(
    () => getValidationMessage(values),
    [values]
  )

  useEffect(() => {
    let isCancelled = false

    if (validationMessage) {
      setQrDataUrl('')
      setQrError(validationMessage)
      return
    }

    QRCode.toDataURL(qrValue, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0b1f33',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (!isCancelled) {
          setQrDataUrl(dataUrl)
          setQrError('')
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setQrDataUrl('')
          setQrError('Unable to generate the QR code right now.')
        }
      })

    return () => {
      isCancelled = true
    }
  }, [qrValue, validationMessage])

  async function handleCopy() {
    if (!qrValue) {
      setSnackbarMessage('Enter content before copying.')
      return
    }

    try {
      await navigator.clipboard.writeText(qrValue)
      setSnackbarMessage('QR content copied.')
    } catch {
      setSnackbarMessage('Unable to copy the QR content right now.')
    }
  }

  function handleDownload() {
    if (!qrDataUrl) {
      setSnackbarMessage('Generate a QR code before downloading.')
      return
    }

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = buildDownloadName(values.mode)
    link.click()
    setSnackbarMessage('QR code downloaded.')
  }

  function handleReset() {
    setValues(DEFAULT_STATE)
    setSnackbarMessage('')
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
                  QR Code Generator
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Generate QR codes for links, text, Wi-Fi access, or contact
                details and download the result instantly.
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
                      label="QR Type"
                      value={values.mode}
                      onChange={(event) =>
                        setValues((currentValues) => ({
                          ...currentValues,
                          mode: event.target.value as QrMode,
                        }))
                      }
                    >
                      <MenuItem value="url">Website URL</MenuItem>
                      <MenuItem value="text">Plain Text</MenuItem>
                      <MenuItem value="wifi">Wi-Fi Access</MenuItem>
                      <MenuItem value="contact">Contact Card</MenuItem>
                    </TextField>

                    {values.mode === 'url' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="URL or Domain"
                        value={values.url}
                        onChange={(event) =>
                          setValues((currentValues) => ({
                            ...currentValues,
                            url: event.target.value,
                          }))
                        }
                      />
                    )}

                    {values.mode === 'text' && (
                      <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="Text"
                        value={values.text}
                        onChange={(event) =>
                          setValues((currentValues) => ({
                            ...currentValues,
                            text: event.target.value,
                          }))
                        }
                      />
                    )}

                    {values.mode === 'wifi' && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Network Name"
                          value={values.wifiSsid}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              wifiSsid: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Password"
                          value={values.wifiPassword}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              wifiPassword: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Security"
                          value={values.wifiEncryption}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              wifiEncryption: event.target.value,
                            }))
                          }
                        >
                          <MenuItem value="WPA">WPA / WPA2</MenuItem>
                          <MenuItem value="WEP">WEP</MenuItem>
                          <MenuItem value="nopass">Open Network</MenuItem>
                        </TextField>
                      </>
                    )}

                    {values.mode === 'contact' && (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Name"
                          value={values.contactName}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              contactName: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Company"
                          value={values.contactCompany}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              contactCompany: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Phone"
                          value={values.contactPhone}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              contactPhone: event.target.value,
                            }))
                          }
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Email"
                          value={values.contactEmail}
                          onChange={(event) =>
                            setValues((currentValues) => ({
                              ...currentValues,
                              contactEmail: event.target.value,
                            }))
                          }
                        />
                      </>
                    )}

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
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<ContentCopyRoundedIcon />}
                        onClick={handleCopy}
                      >
                        Copy Content
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
                        QR Preview
                      </Typography>
                    </Box>

                    <Box
                      sx={(theme) => ({
                        minHeight: 360,
                        border: `1px solid ${theme.palette.divider}`,
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(255,255,255,0.92)',
                        p: 2,
                      })}
                    >
                      {qrDataUrl ? (
                        <Box
                          component="img"
                          src={qrDataUrl}
                          alt="Generated QR code"
                          sx={{
                            width: { xs: 220, sm: 280, md: 320 },
                            height: 'auto',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <Typography color="text.secondary">
                          {qrError}
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {qrError || qrValue}
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={<DownloadRoundedIcon />}
                      onClick={handleDownload}
                      disabled={!qrDataUrl}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Download QR Code
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

export default QrCodeGenerator
