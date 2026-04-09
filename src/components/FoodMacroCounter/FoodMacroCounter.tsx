'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EggAltRoundedIcon from '@mui/icons-material/EggAltRounded'
import GrainRoundedIcon from '@mui/icons-material/GrainRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import ScrollToInstructionsButton from '../ScrollToInstructionsButton/ScrollToInstructionsButton'
import {
  formatNumber,
  getCalculatorPanelSx,
  getCalculatorPaperSx,
  getHealthHighlightSx,
  sanitizeNumericInput,
} from '../../lib/calculator'
import { getFoodDataset, type FoodRecord } from '../../lib/foodDataset'
import {
  getFoodNutritionForGrams,
  getFoodNutritionForServings,
} from '../../lib/foodNutrition'

type MealRow = {
  id: number
  food: FoodRecord
  servings: string
  grams: string
}

type RowTotals = {
  gramsUsed: number
  calories: number
  protein: number
  fiber: number
  fat: number
}

type MealVerdict = {
  label: 'Balanced' | 'Okay' | 'Heavy / low-balance'
  description: string
  severity: 'normal' | 'attention' | 'critical'
}

const MAX_SEARCH_RESULTS = 50
const DAILY_REFERENCE = {
  calories: 2000,
  protein: 50,
  fiber: 25,
  fat: 70,
} as const

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function getSearchTokens(value: string) {
  return normalizeSearchValue(value)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function getFilteredFoods(foods: FoodRecord[], query: string) {
  const normalizedQuery = normalizeSearchValue(query)
  const queryTokens = getSearchTokens(query)

  if (!normalizedQuery) {
    return foods.slice(0, MAX_SEARCH_RESULTS)
  }

  return [...foods]
    .map((food) => {
      const name = food.name.toLowerCase()
      const searchText =
        `${food.name} ${food.category} ${food.mealSlots}`.toLowerCase()
      const nameTokens = getSearchTokens(food.name)
      let score = 0

      if (name === normalizedQuery) {
        score = 300
      } else if (name.startsWith(normalizedQuery)) {
        score = 220
      } else if (name.includes(normalizedQuery)) {
        score = 140
      } else if (
        `${food.category} ${food.mealSlots}`
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        score = 80
      }

      if (queryTokens.length > 0) {
        const matchedTokenCount = queryTokens.filter((token) =>
          nameTokens.some((nameToken) => nameToken.includes(token))
        ).length

        const textMatchedTokenCount = queryTokens.filter((token) =>
          searchText.includes(token)
        ).length

        if (matchedTokenCount === queryTokens.length) {
          score = Math.max(score, 200 + matchedTokenCount * 18)
        } else if (textMatchedTokenCount === queryTokens.length) {
          score = Math.max(score, 150 + textMatchedTokenCount * 12)
        } else if (matchedTokenCount > 0) {
          score = Math.max(score, 70 + matchedTokenCount * 10)
        } else if (textMatchedTokenCount > 0) {
          score = Math.max(score, 45 + textMatchedTokenCount * 8)
        }
      }

      return { food, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.food.name.localeCompare(right.food.name)
    })
    .slice(0, MAX_SEARCH_RESULTS)
    .map((entry) => entry.food)
}

function getMealRowTotals(row: MealRow): RowTotals {
  const servings = Number(row.servings) || 0
  const enteredGrams = Number(row.grams) || 0
  const gramsUsed =
    enteredGrams > 0
      ? enteredGrams
      : Math.max(servings, 0) * row.food.servingGrams
  const nutrition =
    enteredGrams > 0
      ? getFoodNutritionForGrams(row.food, enteredGrams)
      : getFoodNutritionForServings(row.food, servings)

  return {
    gramsUsed,
    calories: nutrition.calories,
    protein: nutrition.protein,
    fiber: nutrition.fiber,
    fat: nutrition.fat,
  }
}

function getMealVerdict(
  totalCalories: number,
  totalProtein: number,
  totalFiber: number
): MealVerdict {
  const checks = [
    totalProtein >= 20,
    totalFiber >= 6,
    totalCalories >= 250 && totalCalories <= 800,
  ].filter(Boolean).length

  if (checks === 3) {
    return {
      label: 'Balanced',
      description:
        'This meal has a solid protein and fiber base without drifting too light or too heavy on calories.',
      severity: 'normal',
    }
  }

  if (checks === 2) {
    return {
      label: 'Okay',
      description:
        'This meal works, but one macro area still looks light compared with the others.',
      severity: 'attention',
    }
  }

  return {
    label: 'Heavy / low-balance',
    description:
      'This meal is skewed toward either low protein and fiber or a calorie load that feels less balanced.',
    severity: 'critical',
  }
}

function formatMacroValue(value: number, suffix: string) {
  return `${formatNumber(value, 'en-US', {
    maximumFractionDigits: 1,
  })}${suffix}`
}

function getPercentOfDay(value: number, target: number) {
  if (!target) {
    return 0
  }

  return (value / target) * 100
}

function getDailyMacroRead(
  label: 'Calories' | 'Protein' | 'Fiber' | 'Fats',
  percent: number
) {
  if (label === 'Calories') {
    if (percent < 15) {
      return 'Light share of a typical day'
    }

    if (percent <= 40) {
      return 'Moderate meal calorie range'
    }

    return 'Large share for one meal'
  }

  if (label === 'Protein') {
    if (percent < 20) {
      return 'Light protein contribution'
    }

    if (percent <= 45) {
      return 'Solid share of daily protein'
    }

    return 'High protein contribution'
  }

  if (label === 'Fats') {
    if (percent < 20) {
      return 'Lighter fat contribution'
    }

    if (percent <= 45) {
      return 'Moderate share of daily fats'
    }

    return 'High fat contribution'
  }

  if (percent < 15) {
    return 'Fiber is still on the lighter side'
  }

  if (percent <= 40) {
    return 'Useful bump toward daily fiber'
  }

  return 'Strong fiber contribution'
}

function FoodMacroCounter() {
  const [foods, setFoods] = useState<FoodRecord[]>([])
  const [isLoadingFoods, setIsLoadingFoods] = useState(true)
  const [foodLoadError, setFoodLoadError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedFood, setSelectedFood] = useState<FoodRecord | null>(null)
  const [mealRows, setMealRows] = useState<MealRow[]>([])

  useEffect(() => {
    let isActive = true

    async function loadFoods() {
      setIsLoadingFoods(true)
      setFoodLoadError('')

      try {
        const dataset = await getFoodDataset()

        if (!isActive) {
          return
        }

        setFoods(dataset)
      } catch {
        if (!isActive) {
          return
        }

        setFoodLoadError(
          'Food data could not be loaded right now. Try refreshing the page in a moment.'
        )
      } finally {
        if (isActive) {
          setIsLoadingFoods(false)
        }
      }
    }

    void loadFoods()

    return () => {
      isActive = false
    }
  }, [])

  const filteredFoods = useMemo(
    () => getFilteredFoods(foods, searchInput),
    [foods, searchInput]
  )

  const mealRowsWithTotals = useMemo(
    () =>
      mealRows.map((row) => ({
        row,
        totals: getMealRowTotals(row),
      })),
    [mealRows]
  )

  const mealSummary = useMemo(() => {
    const totals = mealRowsWithTotals.reduce(
      (summary, item) => ({
        calories: summary.calories + item.totals.calories,
        protein: summary.protein + item.totals.protein,
        fiber: summary.fiber + item.totals.fiber,
        fat: summary.fat + item.totals.fat,
      }),
      { calories: 0, protein: 0, fiber: 0, fat: 0 }
    )

    return {
      ...totals,
      foodCount: mealRows.length,
      verdict: getMealVerdict(totals.calories, totals.protein, totals.fiber),
      caloriePctOfDay: getPercentOfDay(
        totals.calories,
        DAILY_REFERENCE.calories
      ),
      proteinPctOfDay: getPercentOfDay(totals.protein, DAILY_REFERENCE.protein),
      fiberPctOfDay: getPercentOfDay(totals.fiber, DAILY_REFERENCE.fiber),
      fatPctOfDay: getPercentOfDay(totals.fat, DAILY_REFERENCE.fat),
    }
  }, [mealRows.length, mealRowsWithTotals])

  const handleAddFood = (foodToAdd: FoodRecord | null) => {
    if (!foodToAdd) {
      return
    }

    setMealRows((currentRows) => [
      ...currentRows,
      {
        id: Date.now() + currentRows.length,
        food: foodToAdd,
        servings: '1',
        grams: '',
      },
    ])
    setSelectedFood(null)
    setSearchInput('')
  }

  const handleRowChange = (
    rowId: number,
    field: 'servings' | 'grams',
    value: string
  ) => {
    setMealRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: sanitizeNumericInput(value, true),
            }
          : row
      )
    )
  }

  const handleRemoveRow = (rowId: number) => {
    setMealRows((currentRows) => currentRows.filter((row) => row.id !== rowId))
  }

  const handleResetMeal = () => {
    setMealRows([])
    setSelectedFood(null)
    setSearchInput('')
  }

  const summaryCards = [
    {
      label: 'Calories',
      value: formatMacroValue(mealSummary.calories, ' kcal'),
      icon: LocalFireDepartmentRoundedIcon,
      tone: '#ef6c00',
    },
    {
      label: 'Protein',
      value: formatMacroValue(mealSummary.protein, ' g'),
      icon: EggAltRoundedIcon,
      tone: '#2e7d32',
    },
    {
      label: 'Fiber',
      value: formatMacroValue(mealSummary.fiber, ' g'),
      icon: GrainRoundedIcon,
      tone: '#1565c0',
    },
    {
      label: 'Fats',
      value: formatMacroValue(mealSummary.fat, ' g'),
      icon: InsightsRoundedIcon,
      tone: '#8d6e63',
    },
  ]

  const dailyGuidanceRows = [
    {
      label: 'Calories',
      mealValue: formatMacroValue(mealSummary.calories, ' kcal'),
      targetValue: `~${DAILY_REFERENCE.calories.toLocaleString('en-US')} kcal/day`,
      percent: mealSummary.caloriePctOfDay,
      tone: '#ef6c00',
      read: getDailyMacroRead('Calories', mealSummary.caloriePctOfDay),
    },
    {
      label: 'Protein',
      mealValue: formatMacroValue(mealSummary.protein, ' g'),
      targetValue: `~${DAILY_REFERENCE.protein} g/day`,
      percent: mealSummary.proteinPctOfDay,
      tone: '#2e7d32',
      read: getDailyMacroRead('Protein', mealSummary.proteinPctOfDay),
    },
    {
      label: 'Fiber',
      mealValue: formatMacroValue(mealSummary.fiber, ' g'),
      targetValue: `~${DAILY_REFERENCE.fiber} g/day`,
      percent: mealSummary.fiberPctOfDay,
      tone: '#1565c0',
      read: getDailyMacroRead('Fiber', mealSummary.fiberPctOfDay),
    },
    {
      label: 'Fats',
      mealValue: formatMacroValue(mealSummary.fat, ' g'),
      targetValue: `~${DAILY_REFERENCE.fat} g/day`,
      percent: mealSummary.fatPctOfDay,
      tone: '#8d6e63',
      read: getDailyMacroRead('Fats', mealSummary.fatPctOfDay),
    },
  ]

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 780 }}>
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
                Meal Calories, Protein, Fiber & Fats Calculator
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Search foods, build one meal, and see how the calories, protein,
              fiber, and fats add up together.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={(theme) => ({
                  ...getCalculatorPanelSx(theme),
                  minHeight: '100%',
                })}
              >
                <Stack spacing={{ xs: 2, md: 1.75 }}>
                  <Stack spacing={{ xs: 2, md: 1.75 }}>
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Search And Add
                    </Typography>

                    <Autocomplete
                      fullWidth
                      size="small"
                      value={selectedFood}
                      inputValue={searchInput}
                      options={filteredFoods}
                      filterOptions={(options) => options}
                      loading={isLoadingFoods}
                      getOptionLabel={(option) => option.name}
                      noOptionsText={
                        searchInput
                          ? 'No matching foods found.'
                          : 'Start typing to search foods.'
                      }
                      onInputChange={(_, value) => setSearchInput(value)}
                      onChange={(_, value) => {
                        setSelectedFood(value)
                        handleAddFood(value)
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search food"
                          placeholder="Try paneer, dal tadka, oats dosa..."
                          error={Boolean(foodLoadError)}
                          helperText={
                            foodLoadError ||
                            'Choose a food and it will be added to the meal table.'
                          }
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <SearchRoundedIcon fontSize="small" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                            endAdornment: (
                              <>
                                {isLoadingFoods ? (
                                  <CircularProgress size={18} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props

                        return (
                          <Box component="li" key={key} {...optionProps}>
                            <Stack spacing={0.2}>
                              <Typography sx={{ fontWeight: 600 }}>
                                {option.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {option.category} · {option.servingLabel}
                              </Typography>
                            </Stack>
                          </Box>
                        )
                      }}
                    />

                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1.25}
                      justifyContent="space-between"
                      alignItems={{ xs: 'stretch', md: 'center' }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.92rem', maxWidth: 620 }}
                      >
                        Use servings for quick adds, or type grams for a tighter
                        portion. Build one breakfast, lunch, dinner, or snack
                        stack and let the totals update instantly.
                      </Typography>
                      <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        startIcon={<AutorenewRoundedIcon />}
                        onClick={handleResetMeal}
                        sx={{
                          borderRadius: 0,
                          width: { xs: '100%', md: 'auto' },
                          minWidth: { md: 132 },
                          flexShrink: 0,
                          alignSelf: { xs: 'stretch', md: 'center' },
                        }}
                      >
                        Clear meal
                      </Button>
                    </Stack>
                  </Stack>

                  <Box
                    sx={(theme) => ({
                      p: 1.25,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: alpha(
                        theme.palette.secondary.main,
                        theme.palette.mode === 'dark' ? 0.08 : 0.04
                      ),
                    })}
                  >
                    <Stack spacing={0.55}>
                      <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', fontWeight: 700 }}
                      >
                        Meal Snapshot
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                        {mealSummary.foodCount === 0
                          ? 'No foods added yet.'
                          : `${mealSummary.foodCount} food${
                              mealSummary.foodCount > 1 ? 's' : ''
                            } in this meal.`}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: '0.92rem' }}
                      >
                        Build your plate on the left, then use the table below
                        to tune servings or grams.
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={(theme) => ({
                  ...getCalculatorPanelSx(theme),
                  minHeight: '100%',
                })}
              >
                <Stack spacing={1.1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                  >
                    <Typography
                      variant="overline"
                      sx={{ color: 'secondary.main', fontWeight: 700 }}
                    >
                      Macro View
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: '0.8rem', textAlign: 'right' }}
                    >
                      General adult estimates
                    </Typography>
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ pt: 0.35, pb: 0.9 }}
                  >
                    {summaryCards.map((card) => {
                      const Icon = card.icon

                      return (
                        <Paper
                          key={card.label}
                          sx={(theme) => ({
                            flex: '1 1 140px',
                            minWidth: 0,
                            px: 1.35,
                            py: 1.1,
                            borderRadius: 0,
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: alpha(
                              card.tone,
                              theme.palette.mode === 'dark' ? 0.16 : 0.07
                            ),
                          })}
                        >
                          <Stack spacing={0.5}>
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                            >
                              <Icon
                                sx={{ color: card.tone }}
                                fontSize="small"
                              />
                              <Typography
                                variant="overline"
                                sx={{
                                  fontWeight: 700,
                                  color: card.tone,
                                  lineHeight: 1.2,
                                }}
                              >
                                {card.label}
                              </Typography>
                            </Stack>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.1,
                              }}
                            >
                              {card.value}
                            </Typography>
                          </Stack>
                        </Paper>
                      )
                    })}
                  </Stack>

                  <Grid container spacing={0.9}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <Box
                        sx={(theme) => ({
                          p: 1.1,
                          border: `1px solid ${theme.palette.divider}`,
                          minHeight: '100%',
                        })}
                      >
                        <Stack spacing={0.8}>
                          <Typography
                            variant="overline"
                            sx={{ color: 'secondary.main', fontWeight: 700 }}
                          >
                            Meal Vs Day
                          </Typography>

                          <Stack spacing={0.75}>
                            {dailyGuidanceRows.map((item) => (
                              <Box key={item.label}>
                                <Stack spacing={0.35}>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={1}
                                    alignItems="baseline"
                                  >
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: '0.92rem',
                                      }}
                                    >
                                      {item.label}
                                    </Typography>
                                    <Typography
                                      color="text.secondary"
                                      sx={{
                                        fontSize: '0.8rem',
                                        textAlign: 'right',
                                      }}
                                    >
                                      {formatNumber(item.percent, 'en-US', {
                                        maximumFractionDigits: 0,
                                      })}
                                      %
                                    </Typography>
                                  </Stack>
                                  <Box
                                    sx={(theme) => ({
                                      height: 7,
                                      border: `1px solid ${theme.palette.divider}`,
                                      backgroundColor: alpha(
                                        item.tone,
                                        theme.palette.mode === 'dark'
                                          ? 0.14
                                          : 0.08
                                      ),
                                    })}
                                  >
                                    <Box
                                      sx={{
                                        width: `${Math.max(
                                          0,
                                          Math.min(item.percent, 100)
                                        )}%`,
                                        height: '100%',
                                        backgroundColor: item.tone,
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    color="text.secondary"
                                    sx={{
                                      fontSize: '0.78rem',
                                      lineHeight: 1.35,
                                    }}
                                  >
                                    {item.mealValue} of {item.targetValue}
                                  </Typography>
                                </Stack>
                              </Box>
                            ))}
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                      <Box
                        sx={(theme) => ({
                          p: 1.1,
                          border: `1px solid ${theme.palette.divider}`,
                          backgroundColor: alpha(
                            theme.palette.secondary.main,
                            theme.palette.mode === 'dark' ? 0.08 : 0.04
                          ),
                          minHeight: '100%',
                        })}
                      >
                        <Stack spacing={0.65}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography
                              variant="overline"
                              sx={{ color: 'secondary.main', fontWeight: 700 }}
                            >
                              Meal Verdict
                            </Typography>
                            <Typography
                              sx={(theme) => ({
                                ...getHealthHighlightSx(
                                  theme,
                                  mealSummary.verdict.severity
                                ),
                                px: 0.9,
                                py: 0.3,
                                fontSize: '0.92rem',
                                lineHeight: 1.1,
                                whiteSpace: 'nowrap',
                              })}
                            >
                              {mealSummary.verdict.label}
                            </Typography>
                          </Stack>
                          <Box
                            sx={(theme) => ({
                              position: 'relative',
                              height: 10,
                              border: `1px solid ${theme.palette.divider}`,
                              background:
                                'linear-gradient(90deg, rgba(46,125,50,0.16) 0%, rgba(251,192,45,0.18) 55%, rgba(211,47,47,0.16) 100%)',
                            })}
                          >
                            <Box
                              sx={(theme) => ({
                                position: 'absolute',
                                top: -3,
                                left: `${Math.min(
                                  92,
                                  Math.max(
                                    8,
                                    (mealSummary.protein >= 20 ? 34 : 15) +
                                      (mealSummary.fiber >= 6 ? 26 : 8) +
                                      (mealSummary.calories >= 250 &&
                                      mealSummary.calories <= 800
                                        ? 26
                                        : 8)
                                  )
                                )}%`,
                                width: 10,
                                height: 16,
                                backgroundColor: theme.palette.text.primary,
                              })}
                            />
                          </Box>
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: '0.84rem', lineHeight: 1.4 }}
                          >
                            {mealSummary.verdict.description}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            sx={{ fontSize: '0.78rem', lineHeight: 1.35 }}
                          >
                            {mealSummary.foodCount === 0
                              ? 'Add foods to build your first meal.'
                              : `${getDailyMacroRead(
                                  'Protein',
                                  mealSummary.proteinPctOfDay
                                )}. ${getDailyMacroRead(
                                  'Fiber',
                                  mealSummary.fiberPctOfDay
                                )}.`}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
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
                      Meal Builder
                    </Typography>
                  </Box>

                  {mealRowsWithTotals.length === 0 ? (
                    <Box
                      sx={(theme) => ({
                        p: 2,
                        border: `1px dashed ${theme.palette.divider}`,
                        textAlign: 'center',
                      })}
                    >
                      <Stack spacing={0.9} alignItems="center">
                        <RestaurantRoundedIcon color="action" />
                        <Typography sx={{ fontWeight: 700 }}>
                          Start by searching for a food.
                        </Typography>
                        <Typography color="text.secondary">
                          Each selected food will appear here with serving and
                          grams controls.
                        </Typography>
                      </Stack>
                    </Box>
                  ) : (
                    <TableContainer
                      sx={{
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Food</TableCell>
                            <TableCell sx={{ minWidth: 118 }}>
                              Servings
                            </TableCell>
                            <TableCell sx={{ minWidth: 128 }}>Grams</TableCell>
                            <TableCell align="right">Calories</TableCell>
                            <TableCell align="right">Protein</TableCell>
                            <TableCell align="right">Fiber</TableCell>
                            <TableCell align="right">Fats</TableCell>
                            <TableCell align="right">Remove</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mealRowsWithTotals.map(({ row, totals }) => (
                            <TableRow key={row.id} hover>
                              <TableCell sx={{ minWidth: 220 }}>
                                <Stack spacing={0.4}>
                                  <Typography sx={{ fontWeight: 700 }}>
                                    {row.food.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {row.food.category} ·{' '}
                                    {row.food.servingLabel}
                                  </Typography>
                                  <Chip
                                    label={`${formatNumber(
                                      totals.gramsUsed,
                                      'en-US',
                                      {
                                        maximumFractionDigits: 0,
                                      }
                                    )} g used`}
                                    size="small"
                                    sx={{
                                      width: 'fit-content',
                                      borderRadius: 0,
                                    }}
                                  />
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={row.servings}
                                  onChange={(event) =>
                                    handleRowChange(
                                      row.id,
                                      'servings',
                                      event.target.value
                                    )
                                  }
                                  inputProps={{ inputMode: 'decimal' }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={row.grams}
                                  onChange={(event) =>
                                    handleRowChange(
                                      row.id,
                                      'grams',
                                      event.target.value
                                    )
                                  }
                                  inputProps={{ inputMode: 'decimal' }}
                                  placeholder={`${row.food.servingGrams}`}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {formatNumber(totals.calories, 'en-US', {
                                  maximumFractionDigits: 0,
                                })}
                              </TableCell>
                              <TableCell align="right">
                                {formatNumber(totals.protein, 'en-US', {
                                  maximumFractionDigits: 1,
                                })}
                                g
                              </TableCell>
                              <TableCell align="right">
                                {formatNumber(totals.fiber, 'en-US', {
                                  maximumFractionDigits: 1,
                                })}
                                g
                              </TableCell>
                              <TableCell align="right">
                                {formatNumber(totals.fat, 'en-US', {
                                  maximumFractionDigits: 1,
                                })}
                                g
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveRow(row.id)}
                                  aria-label={`Remove ${row.food.name}`}
                                  sx={{ borderRadius: 0 }}
                                >
                                  <DeleteOutlineRoundedIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default FoodMacroCounter
