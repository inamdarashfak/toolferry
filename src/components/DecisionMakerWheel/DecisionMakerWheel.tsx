'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  getCalculatorPanelSx,
  getCalculatorPaperSx,
} from '../../lib/calculator'
import { trackEvent } from '../../lib/analytics'

type WheelOption = {
  id: number
  label: string
  color: string
}

type SpinResult = {
  id: number
  label: string
  color: string
}

const STORAGE_KEY = 'toolferry-decision-maker-recents'
const MAX_RECENT_LISTS = 5
const FULL_TURNS = 6
const SPIN_DURATION_MS = 4600
const DEFAULT_OPTIONS = ['Pizza', 'Burgers', 'Sushi', 'Tacos', 'Pasta']
const YES_NO_OPTIONS = ['Yes', 'No']
const PRESET_GROUPS = [
  {
    label: 'Lunch',
    values: ['Pizza', 'Burgers', 'Sushi', 'Tacos', 'Pasta'],
  },
  {
    label: 'Movie Night',
    values: ['Action', 'Comedy', 'Thriller', 'Drama', 'Animation'],
  },
  {
    label: 'Weekend Plan',
    values: ['Stay in', 'Go out', 'Road trip', 'Movie', 'Cafe hop'],
  },
]

const COLOR_PALETTE = [
  '#0f8b8d',
  '#0b1f33',
  '#ff7a59',
  '#f4b942',
  '#4c956c',
  '#d1495b',
  '#457b9d',
  '#7b2cbf',
  '#2a9d8f',
  '#e76f51',
  '#355070',
  '#6d597a',
]

function normalizeOption(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function getDuplicateKey(value: string) {
  return normalizeOption(value).toLowerCase()
}

function buildRecentKey(values: string[]) {
  return values.map(getDuplicateKey).join('|')
}

function shufflePalette(seed: number) {
  const palette = [...COLOR_PALETTE]

  for (let index = palette.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 7) % (index + 1)
    const current = palette[index]
    palette[index] = palette[swapIndex]
    palette[swapIndex] = current
  }

  return palette
}

function buildOptions(labels: string[], seed = Date.now()) {
  const palette = shufflePalette(seed)

  return labels.map((label, index) => ({
    id: seed + index + 1,
    label: normalizeOption(label),
    color: palette[index % palette.length],
  }))
}

function loadRecentLists() {
  if (typeof window === 'undefined') {
    return [] as string[][]
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (entry): entry is string[] =>
        Array.isArray(entry) &&
        entry.length >= 2 &&
        entry.every((value) => typeof value === 'string')
    )
  } catch {
    return []
  }
}

function saveRecentLists(nextLists: string[][]) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLists))
  } catch {
    return
  }
}

function getSegmentColorString(options: WheelOption[]) {
  if (!options.length) {
    return 'transparent'
  }

  const sliceAngle = 360 / options.length

  return `conic-gradient(${options
    .map((option, index) => {
      const start = Number((index * sliceAngle).toFixed(4))
      const end = Number(((index + 1) * sliceAngle).toFixed(4))
      return `${option.color} ${start}deg ${end}deg`
    })
    .join(', ')})`
}

function DecisionMakerWheel() {
  const nextIdRef = useRef(1000)
  const [options, setOptions] = useState<WheelOption[]>(() =>
    buildOptions(DEFAULT_OPTIONS, 101)
  )
  const [draftInput, setDraftInput] = useState('')
  const [editingOptionId, setEditingOptionId] = useState<number | null>(null)
  const [editingDraft, setEditingDraft] = useState('')
  const [selectedResult, setSelectedResult] = useState<SpinResult | null>(null)
  const [rotationDegrees, setRotationDegrees] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [removeAfterSpin, setRemoveAfterSpin] = useState(false)
  const [recentLists, setRecentLists] = useState<string[][]>([])

  useEffect(() => {
    const storedRecents = loadRecentLists()
    setRecentLists(storedRecents)
  }, [])

  const wheelGradient = useMemo(() => getSegmentColorString(options), [options])
  const sliceAngle = options.length ? 360 / options.length : 0
  const showWheelLabels = options.length > 0 && options.length <= 10
  const spinEnabled = options.length >= 2 && !isSpinning

  const updateRecentLists = (labels: string[]) => {
    const normalized = labels.map(normalizeOption).filter(Boolean)

    if (normalized.length < 2) {
      return
    }

    const nextEntryKey = buildRecentKey(normalized)
    const deduped = [
      normalized,
      ...recentLists.filter((entry) => buildRecentKey(entry) !== nextEntryKey),
    ].slice(0, MAX_RECENT_LISTS)

    setRecentLists(deduped)
    saveRecentLists(deduped)
  }

  const clearOutcomeState = () => {
    setSelectedResult(null)
    setValidationMessage('')
  }

  const replaceOptions = (labels: string[]) => {
    const seed = nextIdRef.current
    const nextOptions = buildOptions(labels, seed)
    nextIdRef.current = seed + nextOptions.length + 1
    setOptions(nextOptions)
    setDraftInput('')
    setEditingOptionId(null)
    setEditingDraft('')
    setRotationDegrees(0)
    clearOutcomeState()
  }

  const validateOptionValue = (value: string, ignoreId?: number) => {
    const normalized = normalizeOption(value)

    if (!normalized) {
      return 'Enter a non-empty option.'
    }

    const duplicateExists = options.some(
      (option) =>
        option.id !== ignoreId &&
        getDuplicateKey(option.label) === getDuplicateKey(normalized)
    )

    if (duplicateExists) {
      return 'That option already exists.'
    }

    return ''
  }

  const handleAddOption = () => {
    const nextLabel = normalizeOption(draftInput)
    const validationError = validateOptionValue(nextLabel)

    if (validationError) {
      setValidationMessage(validationError)
      return
    }

    const colorPalette = shufflePalette(nextIdRef.current)
    const nextOption: WheelOption = {
      id: nextIdRef.current,
      label: nextLabel,
      color: colorPalette[options.length % colorPalette.length],
    }

    nextIdRef.current += 1
    setOptions((current) => [...current, nextOption])
    setDraftInput('')
    clearOutcomeState()
  }

  const handleDeleteOption = (optionId: number) => {
    setOptions((current) => current.filter((option) => option.id !== optionId))
    if (editingOptionId === optionId) {
      setEditingOptionId(null)
      setEditingDraft('')
    }
    setValidationMessage('')
  }

  const handleStartEdit = (option: WheelOption) => {
    setEditingOptionId(option.id)
    setEditingDraft(option.label)
    setValidationMessage('')
  }

  const handleSaveEdit = () => {
    if (editingOptionId === null) {
      return
    }

    const validationError = validateOptionValue(editingDraft, editingOptionId)

    if (validationError) {
      setValidationMessage(validationError)
      return
    }

    setOptions((current) =>
      current.map((option) =>
        option.id === editingOptionId
          ? {
              ...option,
              label: normalizeOption(editingDraft),
            }
          : option
      )
    )
    setEditingOptionId(null)
    setEditingDraft('')
    clearOutcomeState()
  }

  const handleCancelEdit = () => {
    setEditingOptionId(null)
    setEditingDraft('')
    setValidationMessage('')
  }

  const handleReset = () => {
    replaceOptions(DEFAULT_OPTIONS)
    setRemoveAfterSpin(false)
    trackEvent('decision_maker_reset', {})
  }

  const handleClearAll = () => {
    setOptions([])
    setDraftInput('')
    setEditingOptionId(null)
    setEditingDraft('')
    setSelectedResult(null)
    setRotationDegrees(0)
    setValidationMessage('')
  }

  const handleUsePreset = (labels: string[], label: string) => {
    replaceOptions(labels)
    trackEvent('decision_maker_preset', {
      preset_name: label,
      option_count: labels.length,
    })
  }

  const handleRestoreRecent = (labels: string[]) => {
    replaceOptions(labels)
    trackEvent('decision_maker_recent_restore', {
      option_count: labels.length,
    })
  }

  const handleSpin = () => {
    if (options.length < 2 || isSpinning) {
      setValidationMessage('Add at least two options before spinning.')
      return
    }

    const winnerIndex = Math.floor(Math.random() * options.length)
    const winner = options[winnerIndex]
    const targetSegmentCenter = winnerIndex * sliceAngle + sliceAngle / 2
    const normalizedRotation = ((rotationDegrees % 360) + 360) % 360
    const additionalRotation =
      FULL_TURNS * 360 +
      ((360 - targetSegmentCenter - normalizedRotation + 360) % 360)

    updateRecentLists(options.map((option) => option.label))
    setIsSpinning(true)
    setSelectedResult(null)
    setValidationMessage('')
    setRotationDegrees((current) => current + additionalRotation)

    trackEvent('decision_maker_spin', {
      option_count: options.length,
      remove_after_spin: removeAfterSpin,
    })

    window.setTimeout(() => {
      setIsSpinning(false)
      setSelectedResult({
        id: winner.id,
        label: winner.label,
        color: winner.color,
      })

      trackEvent('decision_maker_result', {
        option_count: options.length,
        selected_label: winner.label,
      })

      if (removeAfterSpin) {
        setOptions((current) =>
          current.filter((option) => option.id !== winner.id)
        )
      }
    }, SPIN_DURATION_MS)
  }

  useEffect(() => {
    if (options.length === 0) {
      setSelectedResult(null)
      return
    }
  }, [options.length])

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
                Decision Maker (Spin the Wheel)
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Add custom options, spin the wheel, and let one random answer
              break the tie.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={{ xs: 1.5, md: 1.25 }}>
                <Paper
                  sx={(theme) => ({
                    ...getCalculatorPanelSx(theme),
                    p: { xs: 1.5, md: 1.35 },
                  })}
                >
                  <Stack spacing={1.1}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Add Options
                    </Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={0.8}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="New option"
                        placeholder="Add one option"
                        value={draftInput}
                        onChange={(event) => {
                          setDraftInput(event.target.value)
                          setValidationMessage('')
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            handleAddOption()
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddRoundedIcon />}
                        onClick={handleAddOption}
                        sx={{ borderRadius: 0, minWidth: { sm: 104 } }}
                      >
                        Add
                      </Button>
                    </Stack>

                    {validationMessage ? (
                      <Typography color="error" sx={{ fontSize: '0.88rem' }}>
                        {validationMessage}
                      </Typography>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: '0.84rem', lineHeight: 1.5 }}
                      >
                        Enter one option at a time. Duplicates and blank entries
                        are blocked.
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={0.75}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        onClick={() =>
                          handleUsePreset(YES_NO_OPTIONS, 'Yes / No')
                        }
                        sx={{ borderRadius: 0 }}
                      >
                        Yes / No
                      </Button>
                      {PRESET_GROUPS.map((preset) => (
                        <Button
                          key={preset.label}
                          size="small"
                          variant="outlined"
                          color="inherit"
                          onClick={() =>
                            handleUsePreset(preset.values, preset.label)
                          }
                          sx={{ borderRadius: 0 }}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  sx={(theme) => ({
                    ...getCalculatorPanelSx(theme),
                    p: { xs: 1.5, md: 1.35 },
                  })}
                >
                  <Stack spacing={1.1}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1}
                    >
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Current Options
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: '0.84rem' }}
                      >
                        {options.length}{' '}
                        {options.length === 1 ? 'option' : 'options'}
                      </Typography>
                    </Stack>

                    {options.length ? (
                      <Stack spacing={0.8}>
                        {options.map((option) => {
                          const isEditing = editingOptionId === option.id

                          return (
                            <Box
                              key={option.id}
                              sx={(theme) => ({
                                p: 0.85,
                                border: `1px solid ${theme.palette.divider}`,
                                backgroundColor:
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.03)'
                                    : 'rgba(255,255,255,0.9)',
                              })}
                            >
                              <Stack spacing={0.7}>
                                <Stack
                                  direction="row"
                                  spacing={0.8}
                                  alignItems="center"
                                >
                                  <Box
                                    sx={{
                                      width: 14,
                                      height: 14,
                                      flexShrink: 0,
                                      backgroundColor: option.color,
                                      border: '1px solid rgba(0,0,0,0.12)',
                                    }}
                                  />
                                  {isEditing ? (
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={editingDraft}
                                      onChange={(event) => {
                                        setEditingDraft(event.target.value)
                                        setValidationMessage('')
                                      }}
                                      onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                          event.preventDefault()
                                          handleSaveEdit()
                                        }
                                        if (event.key === 'Escape') {
                                          event.preventDefault()
                                          handleCancelEdit()
                                        }
                                      }}
                                    />
                                  ) : (
                                    <Typography
                                      sx={{
                                        flex: 1,
                                        minWidth: 0,
                                        fontSize: '0.94rem',
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {option.label}
                                    </Typography>
                                  )}
                                  <Stack direction="row" spacing={0.15}>
                                    {isEditing ? (
                                      <>
                                        <Tooltip title="Save option">
                                          <IconButton
                                            size="small"
                                            aria-label="Save option"
                                            onClick={handleSaveEdit}
                                            sx={{ borderRadius: 0 }}
                                          >
                                            <CheckRoundedIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Cancel edit">
                                          <IconButton
                                            size="small"
                                            aria-label="Cancel edit"
                                            onClick={handleCancelEdit}
                                            sx={{ borderRadius: 0 }}
                                          >
                                            <CloseRoundedIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </>
                                    ) : (
                                      <>
                                        <Tooltip title="Edit option">
                                          <IconButton
                                            size="small"
                                            aria-label={`Edit ${option.label}`}
                                            onClick={() =>
                                              handleStartEdit(option)
                                            }
                                            sx={{ borderRadius: 0 }}
                                          >
                                            <EditOutlinedIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete option">
                                          <IconButton
                                            size="small"
                                            aria-label={`Delete ${option.label}`}
                                            onClick={() =>
                                              handleDeleteOption(option.id)
                                            }
                                            sx={{ borderRadius: 0 }}
                                          >
                                            <DeleteOutlineRoundedIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </>
                                    )}
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Box>
                          )
                        })}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Add at least two options to make the wheel useful.
                      </Typography>
                    )}

                    <Divider />

                    <Stack spacing={1}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={removeAfterSpin}
                            onChange={(event) =>
                              setRemoveAfterSpin(event.target.checked)
                            }
                          />
                        }
                        label="Remove selected option after spin"
                      />

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={0.8}
                      >
                        <Button
                          variant="outlined"
                          color="inherit"
                          startIcon={<AutorenewRoundedIcon />}
                          onClick={handleReset}
                          sx={{ borderRadius: 0 }}
                        >
                          Reset examples
                        </Button>
                        <Button
                          variant="outlined"
                          color="inherit"
                          startIcon={<ReplayRoundedIcon />}
                          onClick={handleClearAll}
                          sx={{ borderRadius: 0 }}
                        >
                          Clear all
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>

                <Paper
                  sx={(theme) => ({
                    ...getCalculatorPanelSx(theme),
                    p: { xs: 1.5, md: 1.35 },
                  })}
                >
                  <Stack spacing={1}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Recent Lists
                    </Typography>
                    {recentLists.length ? (
                      <Stack spacing={0.8}>
                        {recentLists.map((recent, index) => (
                          <Box
                            key={`${buildRecentKey(recent)}-${index}`}
                            sx={(theme) => ({
                              p: 0.85,
                              border: `1px solid ${theme.palette.divider}`,
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255,255,255,0.03)'
                                  : 'rgba(255,255,255,0.9)',
                            })}
                          >
                            <Stack spacing={0.6}>
                              <Typography
                                sx={{ fontWeight: 600, fontSize: '0.92rem' }}
                              >
                                {recent.slice(0, 3).join(', ')}
                                {recent.length > 3
                                  ? ` +${recent.length - 3} more`
                                  : ''}
                              </Typography>
                              <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                startIcon={<SaveRoundedIcon />}
                                onClick={() => handleRestoreRecent(recent)}
                                sx={{
                                  borderRadius: 0,
                                  alignSelf: 'flex-start',
                                }}
                              >
                                Restore list
                              </Button>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Recent lists appear here after you spin the wheel.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack spacing={{ xs: 1.5, md: 1.25 }}>
                <Paper
                  sx={(theme) => ({
                    ...getCalculatorPanelSx(theme),
                    p: { xs: 1.6, md: 1.45 },
                  })}
                >
                  <Stack spacing={1.15} alignItems="center">
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Spin Wheel
                    </Typography>

                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: 392,
                        aspectRatio: '1 / 1',
                      }}
                    >
                      <Box
                        aria-hidden="true"
                        sx={(theme) => ({
                          position: 'absolute',
                          top: -2,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '14px solid transparent',
                          borderRight: '14px solid transparent',
                          borderTop: `26px solid ${theme.palette.secondary.main}`,
                          zIndex: 3,
                          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))',
                        })}
                      />

                      <Box
                        sx={(theme) => ({
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          background: wheelGradient,
                          border: `10px solid ${
                            theme.palette.mode === 'dark'
                              ? '#0b1f33'
                              : '#ffffff'
                          }`,
                          boxShadow:
                            theme.palette.mode === 'dark'
                              ? '0 24px 48px rgba(0,0,0,0.26)'
                              : '0 24px 48px rgba(11,31,51,0.12)',
                          transform: `rotate(${rotationDegrees}deg)`,
                          transition: isSpinning
                            ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
                            : 'none',
                          overflow: 'hidden',
                        })}
                      >
                        {showWheelLabels
                          ? options.map((option, index) => {
                              const angle = index * sliceAngle + sliceAngle / 2
                              const radius = 34

                              return (
                                <Box
                                  key={option.id}
                                  sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '43%',
                                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}%)`,
                                    transformOrigin: 'center center',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  <Typography
                                    sx={(theme) => ({
                                      maxWidth: '86%',
                                      mx: 'auto',
                                      color: theme.palette.common.white,
                                      fontSize: {
                                        xs: '0.68rem',
                                        sm: '0.76rem',
                                      },
                                      fontWeight: 700,
                                      lineHeight: 1.15,
                                      textAlign: 'center',
                                      textShadow: '0 1px 3px rgba(0,0,0,0.42)',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                    })}
                                  >
                                    {option.label}
                                  </Typography>
                                </Box>
                              )
                            })
                          : null}

                        <Box
                          sx={(theme) => ({
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: { xs: 74, sm: 82 },
                            height: { xs: 74, sm: 82 },
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            backgroundColor:
                              theme.palette.mode === 'dark'
                                ? 'rgba(11,19,32,0.96)'
                                : 'rgba(255,255,255,0.97)',
                            border: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            px: 1,
                            zIndex: 2,
                          })}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              lineHeight: 1.15,
                            }}
                          >
                            {isSpinning ? 'Spinning…' : 'Spin'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={0.8}
                      width="100%"
                    >
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={<PlayArrowRoundedIcon />}
                        onClick={handleSpin}
                        disabled={!spinEnabled}
                        sx={{ borderRadius: 0, flex: 1 }}
                      >
                        {isSpinning ? 'Spinning...' : 'Spin the wheel'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() =>
                          handleUsePreset(YES_NO_OPTIONS, 'Yes / No')
                        }
                        sx={{ borderRadius: 0 }}
                      >
                        Quick Yes / No
                      </Button>
                    </Stack>

                    <Typography
                      color="text.secondary"
                      sx={{
                        textAlign: 'center',
                        maxWidth: 540,
                        fontSize: '0.9rem',
                      }}
                    >
                      {options.length < 2
                        ? 'Add at least two options to unlock the spin button.'
                        : showWheelLabels
                          ? 'The wheel shows your labels directly. Edit the list any time before spinning.'
                          : 'With many options, the wheel keeps labels compact and the full list stays readable on the left.'}
                    </Typography>
                  </Stack>
                </Paper>

                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                      sx={(theme) => ({
                        ...getCalculatorPanelSx(theme),
                        p: { xs: 1.5, md: 1.35 },
                        minHeight: '100%',
                      })}
                    >
                      <Stack spacing={1}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          Result
                        </Typography>
                        <Box
                          aria-live="polite"
                          sx={(theme) => ({
                            p: { xs: 1.35, md: 1.55 },
                            border: `1px solid ${
                              selectedResult
                                ? alpha(theme.palette.secondary.main, 0.45)
                                : theme.palette.divider
                            }`,
                            background: selectedResult
                              ? theme.palette.mode === 'dark'
                                ? `linear-gradient(180deg, ${alpha(
                                    theme.palette.secondary.main,
                                    0.18
                                  )} 0%, rgba(255,255,255,0.03) 100%)`
                                : `linear-gradient(180deg, ${alpha(
                                    theme.palette.secondary.main,
                                    0.12
                                  )} 0%, rgba(255,255,255,0.96) 100%)`
                              : theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.03)'
                                : 'rgba(255,255,255,0.92)',
                            boxShadow: selectedResult
                              ? theme.palette.mode === 'dark'
                                ? `0 16px 34px ${alpha(
                                    theme.palette.secondary.main,
                                    0.16
                                  )}`
                                : `0 16px 34px ${alpha(
                                    theme.palette.secondary.main,
                                    0.12
                                  )}`
                              : 'none',
                          })}
                        >
                          {selectedResult ? (
                            <Stack spacing={0.9}>
                              <Chip
                                label="Winner"
                                size="small"
                                sx={(theme) => ({
                                  alignSelf: 'flex-start',
                                  borderRadius: 0,
                                  fontWeight: 800,
                                  color: theme.palette.secondary.main,
                                  backgroundColor: alpha(
                                    theme.palette.secondary.main,
                                    theme.palette.mode === 'dark' ? 0.18 : 0.12
                                  ),
                                })}
                              />
                              <Typography
                                color="text.secondary"
                                sx={{ letterSpacing: '0.01em' }}
                              >
                                Selected option
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 18,
                                    height: 18,
                                    flexShrink: 0,
                                    backgroundColor: selectedResult.color,
                                    border: '1px solid rgba(0,0,0,0.12)',
                                    boxShadow:
                                      '0 0 0 3px rgba(255,255,255,0.2)',
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: { xs: '1.4rem', md: '1.7rem' },
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                  }}
                                >
                                  {selectedResult.label}
                                </Typography>
                              </Stack>
                              <Typography
                                color="text.secondary"
                                sx={{ fontSize: '0.9rem', lineHeight: 1.65 }}
                              >
                                The wheel landed on this option.
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography color="text.secondary">
                              Spin the wheel to reveal one random result.
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                      sx={(theme) => ({
                        ...getCalculatorPanelSx(theme),
                        p: { xs: 1.5, md: 1.35 },
                        minHeight: '100%',
                      })}
                    >
                      <Stack spacing={0.9}>
                        <Typography
                          variant="overline"
                          sx={{ color: 'secondary.main', fontWeight: 700 }}
                        >
                          Option Snapshot
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Chip
                            label={`${options.length} total`}
                            sx={{ borderRadius: 0, fontWeight: 700 }}
                          />
                          <Chip
                            label={
                              removeAfterSpin
                                ? 'Remove after spin: on'
                                : 'Remove after spin: off'
                            }
                            sx={{ borderRadius: 0, fontWeight: 700 }}
                          />
                        </Stack>
                        <Typography
                          color="text.secondary"
                          sx={{ lineHeight: 1.7 }}
                        >
                          Keep the list short for the clearest wheel labels, or
                          add more options and use the left panel as the
                          readable source of truth.
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default DecisionMakerWheel
