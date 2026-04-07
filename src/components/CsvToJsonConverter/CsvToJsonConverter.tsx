'use client'

import type { ChangeEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Papa from 'papaparse'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'

const SAMPLE_CSV = `user.name,user.location.city,items[0].sku,items[0].qty,metadata
Anika,Mumbai,TF-101,2,"{""priority"":""high"",""tags"":[""new"",""gift""]}"
Luis,London,TF-205,1,"{""priority"":""normal"",""tags"":[""office""]}"
Maya,Singapore,TF-333,4,"{""priority"":""rush"",""tags"":[""bulk"",""intl""]}"`

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
type JsonObject = { [key: string]: JsonValue }

type PathSegment =
  | { type: 'object'; key: string }
  | { type: 'array'; index: number }

function tokenizeHeaderPath(header: string) {
  const normalizedHeader = header.trim()

  if (!normalizedHeader) {
    throw new Error('Header names cannot be blank.')
  }

  const segments: PathSegment[] = []
  const parts = normalizedHeader.split('.')

  parts.forEach((part) => {
    const trimmedPart = part.trim()

    if (!trimmedPart) {
      throw new Error(`Invalid header path "${header}".`)
    }

    const keyMatch = trimmedPart.match(/^[^[\]]+/)
    if (keyMatch) {
      segments.push({ type: 'object', key: keyMatch[0] })
    } else if (!trimmedPart.startsWith('[')) {
      throw new Error(`Invalid header path "${header}".`)
    }

    const bracketMatches = trimmedPart.matchAll(/\[(\d+)\]/g)
    let consumedLength = keyMatch ? keyMatch[0].length : 0

    for (const match of bracketMatches) {
      const matchIndex = match.index ?? 0

      if (matchIndex !== consumedLength) {
        throw new Error(`Invalid header path "${header}".`)
      }

      segments.push({ type: 'array', index: Number(match[1]) })
      consumedLength += match[0].length
    }

    if (consumedLength !== trimmedPart.length) {
      throw new Error(`Invalid header path "${header}".`)
    }
  })

  if (segments.length === 0) {
    throw new Error(`Invalid header path "${header}".`)
  }

  return segments
}

function normalizeHeaderPath(header: string) {
  return tokenizeHeaderPath(header)
    .map((segment) =>
      segment.type === 'object' ? segment.key : `[${segment.index}]`
    )
    .join('.')
}

function parseCellValue(value: string): JsonValue {
  const trimmedValue = value.trim()

  if (
    (trimmedValue.startsWith('{') && trimmedValue.endsWith('}')) ||
    (trimmedValue.startsWith('[') && trimmedValue.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmedValue) as JsonValue
    } catch {
      return value
    }
  }

  return value
}

function createContainer(nextSegment: PathSegment | undefined): JsonValue {
  return nextSegment?.type === 'array' ? [] : {}
}

function assignPathValue(target: JsonObject, header: string, value: JsonValue) {
  const segments = tokenizeHeaderPath(header)
  let current: JsonValue = target

  segments.forEach((segment, index) => {
    const isLastSegment = index === segments.length - 1
    const nextSegment = segments[index + 1]

    if (segment.type === 'object') {
      if (
        Array.isArray(current) ||
        current === null ||
        typeof current !== 'object'
      ) {
        throw new Error(`Path conflict while assigning "${header}".`)
      }

      if (isLastSegment) {
        current[segment.key] = value
        return
      }

      const existingValue = current[segment.key]

      if (existingValue == null) {
        current[segment.key] = createContainer(nextSegment)
      } else if (
        (nextSegment?.type === 'array' && !Array.isArray(existingValue)) ||
        (nextSegment?.type === 'object' &&
          (Array.isArray(existingValue) ||
            typeof existingValue !== 'object' ||
            existingValue === null))
      ) {
        throw new Error(`Path conflict while assigning "${header}".`)
      }

      current = current[segment.key]
      return
    }

    if (!Array.isArray(current)) {
      throw new Error(`Path conflict while assigning "${header}".`)
    }

    if (isLastSegment) {
      current[segment.index] = value
      return
    }

    const existingValue = current[segment.index]

    if (existingValue == null) {
      current[segment.index] = createContainer(nextSegment)
    } else if (
      (nextSegment?.type === 'array' && !Array.isArray(existingValue)) ||
      (nextSegment?.type === 'object' &&
        (Array.isArray(existingValue) ||
          typeof existingValue !== 'object' ||
          existingValue === null))
    ) {
      throw new Error(`Path conflict while assigning "${header}".`)
    }

    current = current[segment.index]
  })
}

function validateHeaders(headers: string[]) {
  if (headers.length === 0) {
    throw new Error('Add a header row and at least one data row.')
  }

  const normalizedHeaders = headers.map((header) => normalizeHeaderPath(header))
  const duplicateHeader = normalizedHeaders.find(
    (header, index) => normalizedHeaders.indexOf(header) !== index
  )

  if (duplicateHeader) {
    throw new Error(
      `Duplicate header path "${duplicateHeader}" would overwrite data.`
    )
  }
}

function convertCsvToJson(text: string) {
  const parsed = Papa.parse<string[]>(text, {
    delimiter: '',
    skipEmptyLines: 'greedy',
  })

  if (parsed.errors.length > 0) {
    const firstError = parsed.errors[0]
    throw new Error(firstError.message || 'Unable to parse CSV input.')
  }

  const rows = parsed.data

  if (rows.length < 2) {
    throw new Error('Add a header row and at least one data row.')
  }

  const [headers, ...dataRows] = rows
  validateHeaders(headers)

  return dataRows.map((row, rowIndex) => {
    if (row.length > headers.length) {
      throw new Error(
        `Row ${rowIndex + 2} has more values than the header row.`
      )
    }

    const record: JsonObject = {}

    headers.forEach((header, columnIndex) => {
      assignPathValue(record, header, parseCellValue(row[columnIndex] ?? ''))
    })

    return record
  })
}

function CsvToJsonConverter() {
  const [input, setInput] = useState(SAMPLE_CSV)
  const [importError, setImportError] = useState('')
  const [selectedFileName, setSelectedFileName] = useState('')
  const [copyLabel, setCopyLabel] = useState('Copy JSON')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const copyTimeoutRef = useRef<number | null>(null)

  const result = useMemo(() => {
    if (importError) {
      return {
        error: importError,
        output: '',
      }
    }

    try {
      return {
        error: '',
        output: JSON.stringify(convertCsvToJson(input), null, 2),
      }
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to convert CSV to JSON.',
        output: '',
      }
    }
  }, [importError, input])

  const handleImportButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : ''
      setInput(content)
      setSelectedFileName(file.name)
      setImportError('')
    }

    reader.onerror = () => {
      setImportError('Unable to read the selected CSV file.')
      setSelectedFileName('')
    }

    reader.readAsText(file)
    event.target.value = ''
  }

  const handleReset = () => {
    setInput(SAMPLE_CSV)
    setImportError('')
    setSelectedFileName('')
  }

  const handleCopyJson = async () => {
    if (result.error || !result.output) {
      return
    }

    try {
      await navigator.clipboard.writeText(result.output)
      setCopyLabel('Copied')

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopyLabel('Copy JSON')
      }, 2000)
    } catch {
      setCopyLabel('Copy failed')

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopyLabel('Copy JSON')
      }, 2000)
    }
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
                CSV to JSON Converter
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Paste CSV or import a local file to convert header-based rows into
              formatted JSON, including nested objects or arrays from path-style
              columns.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                <Stack spacing={1.5}>
                  <Typography
                    variant="overline"
                    sx={{ color: 'secondary.main', fontWeight: 700 }}
                  >
                    CSV Input
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value)
                      setImportError('')
                    }}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv,.txt"
                    onChange={handleFileChange}
                    hidden
                  />
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<UploadFileRoundedIcon />}
                      onClick={handleImportButtonClick}
                      sx={{
                        alignSelf: { xs: 'stretch', sm: 'flex-start' },
                        borderRadius: 0,
                      }}
                    >
                      Import CSV
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<AutorenewRoundedIcon />}
                      onClick={handleReset}
                      sx={{
                        alignSelf: { xs: 'stretch', sm: 'flex-start' },
                        borderRadius: 0,
                      }}
                    >
                      Reset
                    </Button>
                  </Stack>
                  {selectedFileName ? (
                    <Typography variant="body2" color="text.secondary">
                      Imported file: {selectedFileName}
                    </Typography>
                  ) : null}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
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
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      JSON Output
                    </Typography>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      startIcon={<ContentCopyRoundedIcon />}
                      onClick={handleCopyJson}
                      disabled={Boolean(result.error) || !result.output}
                      sx={{
                        alignSelf: { xs: 'stretch', sm: 'flex-start' },
                        borderRadius: 0,
                      }}
                    >
                      {copyLabel}
                    </Button>
                  </Stack>
                  <TextField
                    fullWidth
                    multiline
                    minRows={12}
                    value={result.error ? result.error : result.output}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    error={Boolean(result.error)}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default CsvToJsonConverter
