'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp'

function formatBytes(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`
  }

  return `${size} B`
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read the image file.'))
    }
    image.src = objectUrl
  })
}

function ImageResizerCompressor() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('')
  const [resultPreviewUrl, setResultPreviewUrl] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [sourceWidth, setSourceWidth] = useState(0)
  const [sourceHeight, setSourceHeight] = useState(0)
  const [targetWidth, setTargetWidth] = useState('')
  const [targetHeight, setTargetHeight] = useState('')
  const [keepAspectRatio, setKeepAspectRatio] = useState(true)
  const [quality, setQuality] = useState(82)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg')
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!sourceFile) {
      setSourcePreviewUrl('')
      return
    }

    const nextPreviewUrl = URL.createObjectURL(sourceFile)
    setSourcePreviewUrl(nextPreviewUrl)

    return () => {
      URL.revokeObjectURL(nextPreviewUrl)
    }
  }, [sourceFile])

  useEffect(() => {
    return () => {
      if (resultPreviewUrl) {
        URL.revokeObjectURL(resultPreviewUrl)
      }
    }
  }, [resultPreviewUrl])

  const resultSizeText = useMemo(
    () => (resultBlob ? formatBytes(resultBlob.size) : ''),
    [resultBlob]
  )

  async function processImage(
    file: File,
    widthText: string,
    heightText: string
  ) {
    setIsProcessing(true)
    setErrorMessage('')

    try {
      const image = await loadImage(file)
      const widthInput = Number(widthText)
      const heightInput = Number(heightText)
      const hasWidth = Number.isFinite(widthInput) && widthInput > 0
      const hasHeight = Number.isFinite(heightInput) && heightInput > 0

      let finalWidth = hasWidth ? Math.round(widthInput) : image.naturalWidth
      let finalHeight = hasHeight
        ? Math.round(heightInput)
        : image.naturalHeight

      if (keepAspectRatio) {
        const aspectRatio = image.naturalWidth / image.naturalHeight

        if (hasWidth && !hasHeight) {
          finalHeight = Math.round(finalWidth / aspectRatio)
        } else if (!hasWidth && hasHeight) {
          finalWidth = Math.round(finalHeight * aspectRatio)
        } else if (hasWidth && hasHeight) {
          finalHeight = Math.round(finalWidth / aspectRatio)
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = finalWidth
      canvas.height = finalHeight
      const context = canvas.getContext('2d')

      if (!context) {
        throw new Error('Canvas is not available in this browser.')
      }

      context.drawImage(image, 0, 0, finalWidth, finalHeight)

      const nextBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          resolve,
          outputFormat,
          outputFormat === 'image/png' ? undefined : quality / 100
        )
      })

      if (!nextBlob) {
        throw new Error('Unable to generate the resized image.')
      }

      if (resultPreviewUrl) {
        URL.revokeObjectURL(resultPreviewUrl)
      }

      setResultBlob(nextBlob)
      setResultPreviewUrl(URL.createObjectURL(nextBlob))
      setTargetWidth(String(finalWidth))
      setTargetHeight(String(finalHeight))
    } catch (error) {
      setResultBlob(null)
      setResultPreviewUrl('')
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to process the image.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleFileSelect(file: File | null) {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Choose a valid image file.')
      return
    }

    setSourceFile(file)
    setResultBlob(null)
    setResultPreviewUrl('')

    try {
      const image = await loadImage(file)
      setSourceWidth(image.naturalWidth)
      setSourceHeight(image.naturalHeight)
      setTargetWidth(String(image.naturalWidth))
      setTargetHeight(String(image.naturalHeight))
      setOutputFormat(
        file.type === 'image/png' || file.type === 'image/webp'
          ? (file.type as OutputFormat)
          : 'image/jpeg'
      )
      await processImage(
        file,
        String(image.naturalWidth),
        String(image.naturalHeight)
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load the image file.'
      )
    }
  }

  useEffect(() => {
    if (!sourceFile || !sourceWidth || !sourceHeight || !keepAspectRatio) {
      return
    }

    const widthValue = Number(targetWidth)
    const heightValue = Number(targetHeight)

    if (Number.isFinite(widthValue) && widthValue > 0) {
      setTargetHeight(
        String(Math.round(widthValue * (sourceHeight / sourceWidth)))
      )
      return
    }

    if (Number.isFinite(heightValue) && heightValue > 0) {
      setTargetWidth(
        String(Math.round(heightValue * (sourceWidth / sourceHeight)))
      )
    }
  }, [
    keepAspectRatio,
    sourceFile,
    sourceHeight,
    sourceWidth,
    targetHeight,
    targetWidth,
  ])

  function handleDownload() {
    if (!resultBlob || !resultPreviewUrl) {
      setSnackbarMessage('Process an image before downloading.')
      return
    }

    const extension =
      outputFormat === 'image/png'
        ? 'png'
        : outputFormat === 'image/webp'
          ? 'webp'
          : 'jpg'
    const link = document.createElement('a')
    link.href = resultPreviewUrl
    link.download = `image-${targetWidth || sourceWidth}x${targetHeight || sourceHeight}.${extension}`
    link.click()
    setSnackbarMessage('Processed image downloaded.')
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
                  Image Resizer / Compressor
                </Typography>
                <ScrollToInstructionsButton />
              </Stack>
              <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Resize and compress one image directly in your browser, compare
                the before and after size, and download the result instantly.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, md: 1.75 }}>
              <Grid size={{ xs: 12, lg: 5 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={{ xs: 2, md: 1.75 }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      hidden
                      onChange={(event) => {
                        void handleFileSelect(event.target.files?.[0] ?? null)
                      }}
                    />

                    <Button
                      variant="contained"
                      startIcon={<FileUploadRoundedIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Image
                    </Button>

                    <TextField
                      fullWidth
                      size="small"
                      label="Width"
                      value={targetWidth}
                      onChange={(event) =>
                        setTargetWidth(
                          event.target.value.replace(/[^0-9]/g, '')
                        )
                      }
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Height"
                      value={targetHeight}
                      onChange={(event) =>
                        setTargetHeight(
                          event.target.value.replace(/[^0-9]/g, '')
                        )
                      }
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={keepAspectRatio}
                          onChange={(event) =>
                            setKeepAspectRatio(event.target.checked)
                          }
                        />
                      }
                      label="Keep aspect ratio"
                    />

                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Output Format"
                      value={outputFormat}
                      onChange={(event) =>
                        setOutputFormat(event.target.value as OutputFormat)
                      }
                    >
                      <MenuItem value="image/jpeg">JPEG</MenuItem>
                      <MenuItem value="image/png">PNG</MenuItem>
                      <MenuItem value="image/webp">WEBP</MenuItem>
                    </TextField>

                    <Box>
                      <Typography gutterBottom>Quality: {quality}</Typography>
                      <Slider
                        value={quality}
                        min={40}
                        max={100}
                        step={1}
                        valueLabelDisplay="auto"
                        onChange={(_, value) => setQuality(value as number)}
                        disabled={outputFormat === 'image/png'}
                      />
                    </Box>

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
                        onClick={() => {
                          setSourceFile(null)
                          setSourcePreviewUrl('')
                          if (resultPreviewUrl) {
                            URL.revokeObjectURL(resultPreviewUrl)
                          }
                          setResultPreviewUrl('')
                          setResultBlob(null)
                          setSourceWidth(0)
                          setSourceHeight(0)
                          setTargetWidth('')
                          setTargetHeight('')
                          setKeepAspectRatio(true)
                          setQuality(82)
                          setOutputFormat('image/jpeg')
                          setErrorMessage('')
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          if (sourceFile) {
                            void processImage(
                              sourceFile,
                              targetWidth,
                              targetHeight
                            )
                          }
                        }}
                        disabled={!sourceFile || isProcessing}
                      >
                        {isProcessing ? 'Processing...' : 'Apply Changes'}
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
                        Image Preview
                      </Typography>
                    </Box>

                    {errorMessage ? (
                      <Typography color="error.main">{errorMessage}</Typography>
                    ) : sourceFile ? (
                      <Grid container spacing={1.5}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Stack spacing={0.75}>
                            <Typography color="text.secondary">
                              Original
                            </Typography>
                            {sourcePreviewUrl ? (
                              <Box
                                component="img"
                                src={sourcePreviewUrl}
                                alt="Original upload preview"
                                sx={{
                                  width: '100%',
                                  height: 220,
                                  objectFit: 'contain',
                                  border: '1px solid rgba(11, 31, 51, 0.08)',
                                  backgroundColor: 'rgba(255,255,255,0.92)',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 220,
                                  display: 'grid',
                                  placeItems: 'center',
                                  border: '1px solid rgba(11, 31, 51, 0.08)',
                                  backgroundColor: 'rgba(255,255,255,0.92)',
                                }}
                              >
                                <Typography color="text.secondary">
                                  Preview unavailable
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {sourceWidth} × {sourceHeight} •{' '}
                              {formatBytes(sourceFile.size)}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Stack spacing={0.75}>
                            <Typography color="text.secondary">
                              Processed
                            </Typography>
                            {resultPreviewUrl || sourcePreviewUrl ? (
                              <Box
                                component="img"
                                src={resultPreviewUrl || sourcePreviewUrl}
                                alt="Processed image preview"
                                sx={{
                                  width: '100%',
                                  height: 220,
                                  objectFit: 'contain',
                                  border: '1px solid rgba(11, 31, 51, 0.08)',
                                  backgroundColor: 'rgba(255,255,255,0.92)',
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 220,
                                  display: 'grid',
                                  placeItems: 'center',
                                  border: '1px solid rgba(11, 31, 51, 0.08)',
                                  backgroundColor: 'rgba(255,255,255,0.92)',
                                }}
                              >
                                <Typography color="text.secondary">
                                  Preview unavailable
                                </Typography>
                              </Box>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {targetWidth || sourceWidth} ×{' '}
                              {targetHeight || sourceHeight}
                              {resultSizeText ? ` • ${resultSizeText}` : ''}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography color="text.secondary">
                        Upload an image to resize or compress it here.
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      startIcon={<DownloadRoundedIcon />}
                      onClick={handleDownload}
                      disabled={!resultBlob}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Download Image
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

export default ImageResizerCompressor
