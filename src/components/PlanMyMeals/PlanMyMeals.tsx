'use client'

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import DinnerDiningRoundedIcon from '@mui/icons-material/DinnerDiningRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import FreeBreakfastRoundedIcon from '@mui/icons-material/FreeBreakfastRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Link from '@mui/material/Link'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { alpha } from '@mui/material/styles'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
  filterFoodsForUser,
  generateMealPlan,
  getMealPlannerGoalLabel,
  getGoalDescription,
  normalizeFoodsForMealPlanner,
  type ActivityLevel,
  type DailyMealPlan,
  type DietaryPreference,
  type Gender,
  type MealPlannerFormState,
  type MealPlannerGoal,
  type MealStylePreference,
  type MealSlot,
} from '../../lib/mealPlanner'

const STEP_LABELS = ['Goal', 'Body details', 'Preferences', 'Generate', 'Plan']
const GOAL_OPTIONS: MealPlannerGoal[] = [
  'weight-loss',
  'weight-gain',
  'maintenance',
  'muscle-gain',
  'healthier-eating',
  'high-protein',
  'low-calorie',
  'balanced-diet',
]

const DEFAULT_FORM: MealPlannerFormState = {
  goal: 'balanced-diet',
  age: '28',
  gender: 'female',
  heightCm: '165',
  weightKg: '62',
  activityLevel: 'moderate',
  dietaryPreference: 'veg',
  mealsPerDay: '4',
  allergies: '',
  foodsToAvoid: '',
  targetCalories: '',
  likedFoods: '',
  dislikedFoods: '',
  mealStyle: 'simple',
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getActivityLabel(value: ActivityLevel) {
  switch (value) {
    case 'sedentary':
      return 'Sedentary'
    case 'light':
      return 'Lightly active'
    case 'moderate':
      return 'Moderately active'
    case 'active':
      return 'Active'
    case 'very-active':
      return 'Very active'
    default:
      return value
  }
}

function getDietLabel(value: DietaryPreference) {
  return value === 'non-veg' ? 'Non-veg' : value === 'veg' ? 'Veg' : 'Vegan'
}

function getMealStyleLabel(value: MealStylePreference) {
  return value === 'simple'
    ? 'Simple meals'
    : value === 'budget'
      ? 'Budget meals'
      : 'More variety'
}

function getGoalChipTone(goal: MealPlannerGoal) {
  if (goal === 'weight-loss' || goal === 'low-calorie') {
    return 'rgba(46, 125, 50, 0.12)'
  }

  if (goal === 'muscle-gain' || goal === 'high-protein') {
    return 'rgba(25, 118, 210, 0.12)'
  }

  if (goal === 'weight-gain') {
    return 'rgba(255, 122, 89, 0.14)'
  }

  return 'rgba(255, 122, 89, 0.12)'
}

function getSlotIcon(slot: MealSlot) {
  if (slot === 'breakfast') {
    return <FreeBreakfastRoundedIcon />
  }

  if (slot === 'lunch') {
    return <LunchDiningRoundedIcon />
  }

  if (slot === 'dinner') {
    return <DinnerDiningRoundedIcon />
  }

  return <FavoriteRoundedIcon />
}

function getSlotTone(slot: MealSlot) {
  if (slot === 'breakfast') {
    return {
      main: '#c86f2a',
      soft: 'rgba(200, 111, 42, 0.12)',
      border: 'rgba(200, 111, 42, 0.22)',
    }
  }

  if (slot === 'lunch') {
    return {
      main: '#3f8c4e',
      soft: 'rgba(63, 140, 78, 0.12)',
      border: 'rgba(63, 140, 78, 0.22)',
    }
  }

  if (slot === 'dinner') {
    return {
      main: '#c0573d',
      soft: 'rgba(192, 87, 61, 0.12)',
      border: 'rgba(192, 87, 61, 0.22)',
    }
  }

  return {
    main: '#4b7c73',
    soft: 'rgba(75, 124, 115, 0.12)',
    border: 'rgba(75, 124, 115, 0.2)',
  }
}

function getRecipeSearchUrl(querySource: string) {
  const query = `${querySource.trim()} recipe`

  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}

function CompactStatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: string
  icon: ReactNode
  tone: string
}) {
  return (
    <Paper
      sx={(theme) => ({
        borderRadius: 0,
        border: `1px solid ${alpha(tone, theme.palette.mode === 'dark' ? 0.42 : 0.18)}`,
        p: { xs: 1.1, md: 1.2 },
        backgroundColor: alpha(
          tone,
          theme.palette.mode === 'dark' ? 0.16 : 0.07
        ),
        minHeight: '100%',
      })}
    >
      <Stack spacing={0.45}>
        <Box
          sx={(theme) => ({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            color: tone,
            border: `1px solid ${alpha(tone, theme.palette.mode === 'dark' ? 0.5 : 0.22)}`,
            backgroundColor: alpha(
              tone,
              theme.palette.mode === 'dark' ? 0.2 : 0.1
            ),
          })}
        >
          {icon}
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1.3 }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.05rem' },
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Paper>
  )
}

function MiniStatPill({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: string
}) {
  return (
    <Box
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.45,
        px: 0.75,
        py: 0.45,
        borderRadius: 0,
        border: `1px solid ${alpha(tone, theme.palette.mode === 'dark' ? 0.45 : 0.18)}`,
        backgroundColor: alpha(
          tone,
          theme.palette.mode === 'dark' ? 0.16 : 0.08
        ),
      })}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ lineHeight: 1 }}
      >
        {label}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: tone, fontWeight: 700, lineHeight: 1 }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function buildPrintMarkup(plan: DailyMealPlan, form: MealPlannerFormState) {
  const mealsMarkup = plan.meals
    .map(
      (meal) => `
        <section class="meal">
          <div class="meal-header">
            <div>
              <div class="eyebrow">${escapeHtml(meal.title)}</div>
              <h2>${escapeHtml(meal.note)}</h2>
            </div>
            <div class="meal-totals">
              <strong>${formatNumber(meal.nutrition.calories, 'en-US', { maximumFractionDigits: 0 })} kcal</strong>
              <span>${formatNumber(meal.nutrition.protein, 'en-US', { maximumFractionDigits: 1 })} g protein</span>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th>Serving</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Fiber</th>
                <th>Fats</th>
              </tr>
            </thead>
            <tbody>
              ${meal.foods
                .map(
                  (item) => `
                    <tr>
                      <td>${escapeHtml(item.food.name)}</td>
                      <td>${escapeHtml(item.servingText)}</td>
                      <td>${formatNumber(item.nutrition.calories, 'en-US', { maximumFractionDigits: 0 })}</td>
                      <td>${formatNumber(item.nutrition.protein, 'en-US', { maximumFractionDigits: 1 })} g</td>
                      <td>${formatNumber(item.nutrition.fiber, 'en-US', { maximumFractionDigits: 1 })} g</td>
                      <td>${formatNumber(item.nutrition.fat, 'en-US', { maximumFractionDigits: 1 })} g</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </section>
      `
    )
    .join('')

  const whyMarkup = plan.whyThisWorks
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')
  const factsMarkup = plan.nutritionFacts
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('')

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Plan My Meals</title>
        <style>
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          body { margin: 0; color: #0b1f33; font-family: Arial, Helvetica, sans-serif; }
          .page { display: grid; gap: 18px; }
          .top { display: grid; gap: 12px; padding-bottom: 14px; border-bottom: 1px solid #dde4ea; }
          .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6a7683; }
          h1 { margin: 4px 0 0; font-size: 28px; line-height: 1.1; }
          h2 { margin: 4px 0 0; font-size: 16px; line-height: 1.35; }
          .sub { font-size: 13px; line-height: 1.6; color: #334658; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .summary-card { border: 1px solid #dde4ea; padding: 10px 12px; }
          .summary-card strong { display: block; margin-top: 4px; font-size: 15px; }
          .meal { border: 1px solid #dde4ea; padding: 12px; }
          .meal-header { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; margin-bottom: 10px; }
          .meal-totals { display: grid; gap: 3px; text-align: right; font-size: 12px; color: #4b5b6c; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border-top: 1px solid #e9eef2; font-size: 12px; text-align: left; vertical-align: top; }
          th { color: #637181; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
          ul { margin: 8px 0 0; padding-left: 18px; }
          li { margin: 0 0 6px; font-size: 13px; line-height: 1.55; }
          .note { font-size: 11px; color: #667586; }
        </style>
      </head>
      <body>
        <div class="page">
          <section class="top">
            <div class="eyebrow">ToolFerry meal planner</div>
            <div>
              <h1>Plan My Meals</h1>
              <div class="sub">${escapeHtml(getGoalDescription(form.goal))}</div>
            </div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="eyebrow">Goal</div>
                <strong>${escapeHtml(getMealPlannerGoalLabel(form.goal))}</strong>
                <div class="sub">${escapeHtml(getDietLabel(form.dietaryPreference))} • ${Number(form.mealsPerDay) || 4} meals • ${escapeHtml(getMealStyleLabel(form.mealStyle))}</div>
              </div>
              <div class="summary-card">
                <div class="eyebrow">Body details</div>
                <strong>${plan.person.weightKg} kg • ${plan.person.heightCm} cm • BMI ${formatNumber(plan.person.bmi, 'en-US', { maximumFractionDigits: 1 })}</strong>
                <div class="sub">${escapeHtml(getActivityLabel(form.activityLevel))} • ${formatNumber(plan.person.targetCalories, 'en-US', { maximumFractionDigits: 0 })} kcal target</div>
              </div>
              <div class="summary-card">
                <div class="eyebrow">Daily estimate</div>
                <strong>${formatNumber(plan.nutrition.calories, 'en-US', { maximumFractionDigits: 0 })} kcal</strong>
                <div class="sub">${formatNumber(plan.nutrition.protein, 'en-US', { maximumFractionDigits: 1 })} g protein • ${formatNumber(plan.nutrition.fiber, 'en-US', { maximumFractionDigits: 1 })} g fiber • ${formatNumber(plan.nutrition.fat, 'en-US', { maximumFractionDigits: 1 })} g fats</div>
              </div>
              <div class="summary-card">
                <div class="eyebrow">Preferences</div>
                <strong>${escapeHtml(form.likedFoods || 'No specific likes')}</strong>
                <div class="sub">Avoid: ${escapeHtml(form.foodsToAvoid || form.dislikedFoods || 'Not specified')}</div>
              </div>
            </div>
          </section>
          ${mealsMarkup}
          <section class="meal">
            <div class="eyebrow">Why this plan works</div>
            <ul>${whyMarkup}</ul>
          </section>
          <section class="meal">
            <div class="eyebrow">Interesting nutrition facts</div>
            <ul>${factsMarkup}</ul>
            <div class="note">Meal suggestions are based on your goal, meal timing, and the serving guidance in this plan.</div>
          </section>
        </div>
      </body>
    </html>
  `
}

function PlanMyMeals() {
  const [foods, setFoods] = useState<FoodRecord[]>([])
  const [isLoadingFoods, setIsLoadingFoods] = useState(true)
  const [foodLoadError, setFoodLoadError] = useState('')
  const [form, setForm] = useState<MealPlannerFormState>(DEFAULT_FORM)
  const [activeStep, setActiveStep] = useState(0)
  const [validationMessage, setValidationMessage] = useState('')
  const [generationOffset, setGenerationOffset] = useState(0)
  const [plan, setPlan] = useState<DailyMealPlan | null>(null)

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
      } catch (error) {
        if (!isActive) {
          return
        }

        setFoodLoadError(
          error instanceof Error
            ? error.message
            : 'Unable to load the food dataset right now.'
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

  const filteredFoodCount = useMemo(() => {
    if (foods.length === 0) {
      return 0
    }

    return filterFoodsForUser(normalizeFoodsForMealPlanner(foods), form).length
  }, [foods, form])

  const personPreview = useMemo(() => {
    if (!plan) {
      return null
    }

    return plan.person
  }, [plan])

  const updateField = <Key extends keyof MealPlannerFormState>(
    field: Key,
    value: MealPlannerFormState[Key]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    setValidationMessage('')
  }

  const validateStep = (step = activeStep) => {
    if (step === 0 && !form.goal) {
      return 'Select a goal to continue.'
    }

    if (step === 1) {
      const age = Number(form.age)
      const height = Number(form.heightCm)
      const weight = Number(form.weightKg)
      const mealsPerDay = Number(form.mealsPerDay)

      if (!age || age < 12 || age > 100) {
        return 'Enter an age between 12 and 100.'
      }

      if (!height || height < 120 || height > 230) {
        return 'Enter height in centimeters between 120 and 230.'
      }

      if (!weight || weight < 30 || weight > 250) {
        return 'Enter weight in kilograms between 30 and 250.'
      }

      if (!mealsPerDay || mealsPerDay < 3 || mealsPerDay > 5) {
        return 'Choose 3, 4, or 5 meals per day.'
      }
    }

    if (step === 2 && filteredFoodCount < 8) {
      return 'Your current restrictions remove too many foods. Relax one or two avoid rules and try again.'
    }

    return ''
  }

  const handleNext = () => {
    const nextMessage = validateStep()

    if (nextMessage) {
      setValidationMessage(nextMessage)
      return
    }

    setValidationMessage('')
    setActiveStep((current) => Math.min(current + 1, STEP_LABELS.length - 2))
  }

  const handleBack = () => {
    setValidationMessage('')
    setActiveStep((current) => Math.max(current - 1, 0))
  }

  const handleReset = () => {
    setForm(DEFAULT_FORM)
    setValidationMessage('')
    setPlan(null)
    setActiveStep(0)
    setGenerationOffset(0)
  }

  const handleGenerate = (nextOffset = generationOffset) => {
    const stepMessage = validateStep(0) || validateStep(1) || validateStep(2)

    if (stepMessage) {
      setValidationMessage(stepMessage)
      setActiveStep(
        stepMessage.includes('goal')
          ? 0
          : stepMessage.includes('restrictions')
            ? 2
            : 1
      )
      return
    }

    if (foods.length === 0) {
      setValidationMessage('Food data is still loading. Try again in a moment.')
      return
    }

    setValidationMessage('')
    setActiveStep(3)

    window.setTimeout(() => {
      const nextPlan = generateMealPlan(foods, form, nextOffset)
      const hasMeals = nextPlan.meals.some((meal) => meal.foods.length > 0)

      if (!hasMeals) {
        setValidationMessage(
          'A practical plan could not be built from the current filters. Try fewer avoid rules or switch to more meal variety.'
        )
        setActiveStep(2)
        return
      }

      setPlan(nextPlan)
      setGenerationOffset(nextOffset)
      setActiveStep(4)
    }, 280)
  }

  const handleRegenerate = () => {
    const nextOffset = generationOffset + 1
    handleGenerate(nextOffset)
  }

  const handlePrint = () => {
    if (!plan) {
      setValidationMessage('Generate a meal plan before printing.')
      return
    }

    const printFrame = document.createElement('iframe')
    printFrame.style.position = 'fixed'
    printFrame.style.right = '0'
    printFrame.style.bottom = '0'
    printFrame.style.width = '0'
    printFrame.style.height = '0'
    printFrame.style.border = '0'
    document.body.appendChild(printFrame)

    const frameWindow = printFrame.contentWindow

    if (!frameWindow) {
      document.body.removeChild(printFrame)
      setValidationMessage('Unable to open the print preview right now.')
      return
    }

    const cleanup = () => {
      window.setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame)
        }
      }, 1200)
    }

    frameWindow.document.open()
    frameWindow.document.write(buildPrintMarkup(plan, form))
    frameWindow.document.close()
    frameWindow.onload = () => {
      window.setTimeout(() => {
        frameWindow.focus()
        frameWindow.print()
        cleanup()
      }, 250)
    }
  }

  const handleViewRecipe = (querySource: string) => {
    window.open(
      getRecipeSearchUrl(querySource),
      '_blank',
      'noopener,noreferrer'
    )
  }

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Stack spacing={{ xs: 2, md: 1.8 }}>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.7, maxWidth: 760 }}
          >
            Start with the goal you want the meal plan to optimize for. This
            changes calorie targets, portion sizing, and how foods get scored.
          </Typography>
          <Grid container spacing={{ xs: 1.25, md: 1.15 }}>
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = form.goal === goal

              return (
                <Grid key={goal} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Button
                    fullWidth
                    variant={isSelected ? 'contained' : 'outlined'}
                    color={isSelected ? 'secondary' : 'inherit'}
                    onClick={() => updateField('goal', goal)}
                    sx={(theme) => ({
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      minHeight: 112,
                      borderRadius: 0,
                      px: 1.5,
                      py: 1.35,
                      borderColor: isSelected
                        ? 'secondary.main'
                        : theme.palette.divider,
                    })}
                  >
                    <Stack spacing={0.55}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {getMealPlannerGoalLabel(goal)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.55,
                          color: isSelected ? 'inherit' : 'text.secondary',
                          whiteSpace: 'normal',
                        }}
                      >
                        {getGoalDescription(goal)}
                      </Typography>
                    </Stack>
                  </Button>
                </Grid>
              )
            })}
          </Grid>
        </Stack>
      )
    }

    if (activeStep === 1) {
      return (
        <Grid container spacing={{ xs: 2, md: 1.6 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Age"
              value={form.age}
              onChange={(event) =>
                updateField('age', sanitizeNumericInput(event.target.value))
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Gender"
              value={form.gender}
              onChange={(event) =>
                updateField('gender', event.target.value as Gender)
              }
            >
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Height (cm)"
              value={form.heightCm}
              onChange={(event) =>
                updateField(
                  'heightCm',
                  sanitizeNumericInput(event.target.value)
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Weight (kg)"
              value={form.weightKg}
              onChange={(event) =>
                updateField(
                  'weightKg',
                  sanitizeNumericInput(event.target.value, true)
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Activity level"
              value={form.activityLevel}
              onChange={(event) =>
                updateField(
                  'activityLevel',
                  event.target.value as ActivityLevel
                )
              }
            >
              <MenuItem value="sedentary">Sedentary</MenuItem>
              <MenuItem value="light">Lightly active</MenuItem>
              <MenuItem value="moderate">Moderately active</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="very-active">Very active</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Dietary preference"
              value={form.dietaryPreference}
              onChange={(event) =>
                updateField(
                  'dietaryPreference',
                  event.target.value as DietaryPreference
                )
              }
            >
              <MenuItem value="veg">Veg</MenuItem>
              <MenuItem value="non-veg">Non-veg</MenuItem>
              <MenuItem value="vegan">Vegan</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Meals per day"
              value={form.mealsPerDay}
              onChange={(event) =>
                updateField('mealsPerDay', event.target.value)
              }
            >
              <MenuItem value="3">3 meals</MenuItem>
              <MenuItem value="4">4 meals</MenuItem>
              <MenuItem value="5">5 meals</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Target calories (optional)"
              placeholder="Leave blank to use the goal-based estimate"
              value={form.targetCalories}
              onChange={(event) =>
                updateField(
                  'targetCalories',
                  sanitizeNumericInput(event.target.value)
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Meal style"
              value={form.mealStyle}
              onChange={(event) =>
                updateField(
                  'mealStyle',
                  event.target.value as MealStylePreference
                )
              }
            >
              <MenuItem value="simple">Simple meals</MenuItem>
              <MenuItem value="budget">Budget meals</MenuItem>
              <MenuItem value="variety">More variety</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      )
    }

    if (activeStep === 2) {
      return (
        <Grid container spacing={{ xs: 2, md: 1.6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Allergic Foods"
              placeholder="Example: peanuts, shellfish"
              value={form.allergies}
              onChange={(event) => updateField('allergies', event.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Foods to avoid"
              placeholder="Example: fried foods, paneer, sugary drinks"
              value={form.foodsToAvoid}
              onChange={(event) =>
                updateField('foodsToAvoid', event.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Foods you like"
              placeholder="Example: yogurt, dal, banana"
              value={form.likedFoods}
              onChange={(event) =>
                updateField('likedFoods', event.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label="Foods you dislike"
              placeholder="Example: mushrooms, cauliflower"
              value={form.dislikedFoods}
              onChange={(event) =>
                updateField('dislikedFoods', event.target.value)
              }
            />
          </Grid>
        </Grid>
      )
    }

    if (activeStep === 3) {
      return (
        <Stack
          spacing={1.6}
          alignItems="center"
          sx={{ py: { xs: 2, md: 2.5 } }}
        >
          <CircularProgress size={40} thickness={5} />
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}
          >
            Building your daily meal plan
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.7, maxWidth: 620, textAlign: 'center' }}
          >
            Matching foods, adjusting serving sizes, and balancing breakfast,
            lunch, dinner, and snacks for your goal.
          </Typography>
        </Stack>
      )
    }

    if (!plan) {
      return null
    }

    const calorieProgress = Math.min(
      100,
      Math.max(
        0,
        (plan.nutrition.calories / Math.max(1, plan.person.targetCalories)) *
          100
      )
    )

    return (
      <Stack spacing={{ xs: 1.5, md: 1.5 }}>
        <Paper
          sx={(theme) => ({
            ...getCalculatorPanelSx(theme),
            p: { xs: 1.45, md: 1.6 },
            overflow: 'hidden',
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.22)} 0%, ${alpha(theme.palette.secondary.main, 0.12)} 100%)`
                : `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.06)} 0%, ${alpha(theme.palette.background.paper, 0.92)} 100%)`,
          })}
        >
          <Stack spacing={{ xs: 1.25, md: 1.2 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'flex-start' }}
            >
              <Stack spacing={0.8} sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Chip
                    label={getMealPlannerGoalLabel(form.goal)}
                    sx={{
                      borderRadius: 0,
                      backgroundColor: getGoalChipTone(form.goal),
                      color: 'text.primary',
                      fontWeight: 700,
                    }}
                  />
                  <Chip
                    label={`${Number(form.mealsPerDay) || 4} meals`}
                    variant="outlined"
                    sx={{ borderRadius: 0 }}
                  />
                  <Chip
                    label={getMealStyleLabel(form.mealStyle)}
                    variant="outlined"
                    sx={{ borderRadius: 0 }}
                  />
                </Stack>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.08rem', md: '1.22rem' },
                    fontWeight: 800,
                  }}
                >
                  Your meal plan
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ lineHeight: 1.55, maxWidth: 760 }}
                >
                  {getGoalDescription(form.goal)}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.75}
                  alignItems="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Typography variant="body2" color="text.secondary">
                    {personPreview?.weightKg} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {personPreview?.heightCm} cm
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getDietLabel(form.dietaryPreference)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getActivityLabel(form.activityLevel)}
                  </Typography>
                  <Box
                    component="span"
                    sx={(theme) =>
                      getHealthHighlightSx(
                        theme,
                        personPreview && personPreview.bmi >= 30
                          ? 'critical'
                          : personPreview && personPreview.bmi >= 25
                            ? 'attention'
                            : 'normal'
                      )
                    }
                  >
                    BMI{' '}
                    {formatNumber(personPreview?.bmi ?? 0, 'en-US', {
                      maximumFractionDigits: 1,
                    })}
                  </Box>
                </Stack>
              </Stack>

              <Stack
                direction={{ xs: 'row', sm: 'row' }}
                spacing={0.8}
                flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
                useFlexGap
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={handleReset}
                  sx={{
                    borderRadius: 0,
                    minWidth: { xs: 'calc(50% - 4px)', sm: 'auto' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Start again
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  startIcon={<AutorenewRoundedIcon />}
                  onClick={handleRegenerate}
                  sx={{
                    borderRadius: 0,
                    minWidth: { xs: 'calc(50% - 4px)', sm: 'auto' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Regenerate
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PrintRoundedIcon />}
                  onClick={handlePrint}
                  sx={{
                    borderRadius: 0,
                    minWidth: { xs: '100%', sm: 'auto' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Print / Save as PDF
                </Button>
              </Stack>
            </Stack>

            <Paper
              sx={(theme) => ({
                borderRadius: 0,
                border: `1px solid ${theme.palette.divider}`,
                p: { xs: 1, md: 1.1 },
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.04)'
                    : alpha(theme.palette.background.paper, 0.88),
              })}
            >
              <Stack spacing={0.75}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={1}
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.95rem', md: '1rem' },
                    }}
                  >
                    Daily target alignment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(plan.nutrition.calories, 'en-US', {
                      maximumFractionDigits: 0,
                    })}{' '}
                    /{' '}
                    {formatNumber(plan.person.targetCalories, 'en-US', {
                      maximumFractionDigits: 0,
                    })}{' '}
                    kcal
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={calorieProgress}
                  sx={(theme) => ({
                    height: 7,
                    borderRadius: 0,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.12),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 0,
                      background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.light, 0.92)} 100%)`,
                    },
                  })}
                />
              </Stack>
            </Paper>

            <Grid
              container
              spacing={{ xs: 0.9, md: 1 }}
              sx={{
                mt: { xs: 0.2, md: 0.3 },
                px: { xs: 0.2, md: 0.25 },
              }}
            >
              <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
                <CompactStatCard
                  label="Calories"
                  value={`${formatNumber(plan.nutrition.calories, 'en-US', { maximumFractionDigits: 0 })} kcal`}
                  icon={
                    <LocalFireDepartmentRoundedIcon sx={{ fontSize: 16 }} />
                  }
                  tone="#ff7a59"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
                <CompactStatCard
                  label="Protein"
                  value={`${formatNumber(plan.nutrition.protein, 'en-US', { maximumFractionDigits: 1 })} g`}
                  icon={<FitnessCenterRoundedIcon sx={{ fontSize: 16 }} />}
                  tone="#2b6cb0"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 4, lg: 2.4 }}>
                <CompactStatCard
                  label="Fiber"
                  value={`${formatNumber(plan.nutrition.fiber, 'en-US', { maximumFractionDigits: 1 })} g`}
                  icon={<FavoriteRoundedIcon sx={{ fontSize: 16 }} />}
                  tone="#3f8c4e"
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 6, lg: 2.4 }}>
                <CompactStatCard
                  label="Fats"
                  value={`${formatNumber(plan.nutrition.fat, 'en-US', { maximumFractionDigits: 1 })} g`}
                  icon={<InsightsRoundedIcon sx={{ fontSize: 16 }} />}
                  tone="#9a6c2f"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
                <CompactStatCard
                  label="Plan setup"
                  value={`${getDietLabel(form.dietaryPreference)} • ${Number(form.mealsPerDay) || 4}`}
                  icon={<RestaurantRoundedIcon sx={{ fontSize: 16 }} />}
                  tone="#4b7c73"
                />
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        <Grid container spacing={{ xs: 1.35, md: 1.15 }}>
          <Grid size={{ xs: 12, xl: 8.2 }}>
            <Stack spacing={{ xs: 1.15, md: 1.05 }}>
              {plan.meals.map((meal) => {
                const tone = getSlotTone(meal.slot)

                return (
                  <Paper
                    key={meal.slot}
                    sx={(theme) => ({
                      ...getCalculatorPanelSx(theme),
                      p: { xs: 1.1, md: 1.2 },
                      borderLeft: `4px solid ${tone.main}`,
                    })}
                  >
                    <Stack spacing={1}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={0.9}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.9}
                          alignItems="flex-start"
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={(theme) => ({
                              display: 'inline-flex',
                              color: tone.main,
                              width: 34,
                              height: 34,
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${alpha(tone.main, theme.palette.mode === 'dark' ? 0.5 : 0.24)}`,
                              backgroundColor: alpha(
                                tone.main,
                                theme.palette.mode === 'dark' ? 0.2 : 0.08
                              ),
                              flexShrink: 0,
                            })}
                          >
                            {getSlotIcon(meal.slot)}
                          </Box>
                          <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: { xs: '0.98rem', md: '1.02rem' },
                                fontWeight: 800,
                              }}
                            >
                              {meal.title}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              sx={{
                                lineHeight: 1.5,
                                fontSize: { xs: '0.9rem', md: '0.92rem' },
                              }}
                            >
                              {meal.note}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Chip
                          label={`${formatNumber(meal.nutrition.calories, 'en-US', { maximumFractionDigits: 0 })} kcal`}
                          sx={{
                            borderRadius: 0,
                            backgroundColor: tone.soft,
                            color: tone.main,
                            fontWeight: 700,
                          }}
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={0.65}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <MiniStatPill
                          label="Protein"
                          value={`${formatNumber(meal.nutrition.protein, 'en-US', { maximumFractionDigits: 1 })} g`}
                          tone={tone.main}
                        />
                        <MiniStatPill
                          label="Fiber"
                          value={`${formatNumber(meal.nutrition.fiber, 'en-US', { maximumFractionDigits: 1 })} g`}
                          tone={tone.main}
                        />
                        <MiniStatPill
                          label="Fats"
                          value={`${formatNumber(meal.nutrition.fat, 'en-US', { maximumFractionDigits: 1 })} g`}
                          tone={tone.main}
                        />
                        <MiniStatPill
                          label="Items"
                          value={String(meal.foods.length)}
                          tone={tone.main}
                        />
                      </Stack>

                      <Grid container spacing={{ xs: 0.85, md: 0.9 }}>
                        {meal.foods.map((item, index) => (
                          <Grid
                            key={`${meal.slot}-${item.food.id}-${index}`}
                            size={{
                              xs: 12,
                              md: meal.foods.length === 1 ? 12 : 6,
                            }}
                          >
                            <Paper
                              sx={(theme) => ({
                                borderRadius: 0,
                                border: `1px solid ${alpha(tone.main, theme.palette.mode === 'dark' ? 0.35 : 0.16)}`,
                                p: { xs: 1, md: 1.05 },
                                backgroundColor:
                                  theme.palette.mode === 'dark'
                                    ? alpha(tone.main, 0.08)
                                    : alpha(
                                        theme.palette.background.paper,
                                        0.88
                                      ),
                                minHeight: '100%',
                              })}
                            >
                              <Stack spacing={0.7}>
                                <Stack
                                  direction="row"
                                  spacing={0.75}
                                  justifyContent="space-between"
                                  alignItems="flex-start"
                                >
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      lineHeight: 1.35,
                                      pr: 1,
                                    }}
                                  >
                                    {item.food.name}
                                  </Typography>
                                  <Box
                                    sx={(theme) => ({
                                      flexShrink: 0,
                                      px: 0.6,
                                      py: 0.35,
                                      border: `1px solid ${alpha(tone.main, theme.palette.mode === 'dark' ? 0.44 : 0.18)}`,
                                      backgroundColor: tone.soft,
                                      color: tone.main,
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      lineHeight: 1,
                                    })}
                                  >
                                    {formatNumber(
                                      item.nutrition.calories,
                                      'en-US',
                                      {
                                        maximumFractionDigits: 0,
                                      }
                                    )}{' '}
                                    kcal
                                  </Box>
                                </Stack>
                                <Typography
                                  variant="body2"
                                  sx={(theme) => ({
                                    color: theme.palette.text.secondary,
                                    px: 0.8,
                                    py: 0.55,
                                    border: `1px solid ${theme.palette.divider}`,
                                    backgroundColor:
                                      theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.03)'
                                        : 'rgba(255,255,255,0.74)',
                                  })}
                                >
                                  Serving: {item.servingText}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={0.55}
                                  flexWrap="wrap"
                                  useFlexGap
                                >
                                  <MiniStatPill
                                    label="Protein"
                                    value={`${formatNumber(item.nutrition.protein, 'en-US', { maximumFractionDigits: 1 })} g`}
                                    tone={tone.main}
                                  />
                                  <MiniStatPill
                                    label="Fiber"
                                    value={`${formatNumber(item.nutrition.fiber, 'en-US', { maximumFractionDigits: 1 })} g`}
                                    tone={tone.main}
                                  />
                                  <MiniStatPill
                                    label="Fats"
                                    value={`${formatNumber(item.nutrition.fat, 'en-US', { maximumFractionDigits: 1 })} g`}
                                    tone={tone.main}
                                  />
                                </Stack>
                                <Link
                                  component="button"
                                  type="button"
                                  underline="hover"
                                  color="secondary"
                                  onClick={() =>
                                    handleViewRecipe(item.food.name)
                                  }
                                  sx={{
                                    alignSelf: 'flex-start',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.45,
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    textDecorationThickness: '0.08em',
                                  }}
                                >
                                  View recipe
                                  <LaunchRoundedIcon sx={{ fontSize: 14 }} />
                                </Link>
                              </Stack>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, xl: 3.8 }}>
            <Stack spacing={{ xs: 1.15, md: 1.05 }}>
              <Paper
                sx={(theme) => ({
                  ...getCalculatorPanelSx(theme),
                  p: { xs: 1.15, md: 1.2 },
                })}
              >
                <Stack spacing={0.85}>
                  <Stack direction="row" spacing={0.7} alignItems="center">
                    <TipsAndUpdatesRoundedIcon
                      fontSize="small"
                      color="secondary"
                    />
                    <Typography sx={{ fontWeight: 700 }}>
                      Why this plan works
                    </Typography>
                  </Stack>
                  {plan.whyThisWorks.map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      spacing={0.7}
                      alignItems="flex-start"
                      sx={(theme) => ({
                        p: 0.8,
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(255,255,255,0.78)',
                      })}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          color: 'secondary.main',
                          mt: 0.2,
                        }}
                      >
                        <TipsAndUpdatesRoundedIcon sx={{ fontSize: 15 }} />
                      </Box>
                      <Typography
                        color="text.secondary"
                        sx={{ lineHeight: 1.55, fontSize: '0.92rem' }}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>

              <Paper
                sx={(theme) => ({
                  ...getCalculatorPanelSx(theme),
                  p: { xs: 1.15, md: 1.2 },
                })}
              >
                <Stack spacing={0.85}>
                  <Stack direction="row" spacing={0.7} alignItems="center">
                    <InsightsRoundedIcon fontSize="small" color="secondary" />
                    <Typography sx={{ fontWeight: 700 }}>
                      Interesting nutrition facts
                    </Typography>
                  </Stack>
                  {plan.nutritionFacts.map((item) => (
                    <Stack
                      key={item}
                      spacing={0.45}
                      sx={(theme) => ({
                        p: 0.8,
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.03)'
                            : 'rgba(255,255,255,0.78)',
                      })}
                    >
                      <Typography
                        color="text.secondary"
                        sx={{ lineHeight: 1.55, fontSize: '0.92rem' }}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.55, fontSize: '0.85rem' }}
                  >
                    Meal suggestions are tuned to your goal, meal timing, and
                    the serving guidance in this plan.
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    )
  }

  return (
    <Stack spacing={{ xs: 2.5, md: 2 }}>
      <Paper sx={(theme) => getCalculatorPaperSx(theme)}>
        <Stack spacing={{ xs: 3, md: 2.5 }}>
          <Box sx={{ maxWidth: 840 }}>
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
                Plan My Meals
              </Typography>
              <ScrollToInstructionsButton />
            </Stack>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: { xs: 1.8, md: 1.68 } }}
            >
              Build a practical day of meals based on your goal, body details,
              and food preferences. Get serving guidance, nutrition estimates,
              and a print-friendly PDF export path in one clean flow.
            </Typography>
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              display: { xs: 'none', md: 'flex' },
              '& .MuiStepLabel-label': { fontSize: '0.86rem' },
            }}
          >
            {STEP_LABELS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              display: { xs: 'flex', md: 'none' },
              overflowX: 'auto',
              pb: 0.25,
            }}
          >
            {STEP_LABELS.map((label, index) => (
              <Chip
                key={label}
                label={label}
                color={index <= activeStep ? 'secondary' : 'default'}
                variant={index === activeStep ? 'filled' : 'outlined'}
                sx={{ borderRadius: 0, flexShrink: 0 }}
              />
            ))}
          </Stack>

          {foodLoadError ? (
            <Alert severity="error" sx={{ borderRadius: 0 }}>
              {foodLoadError}
            </Alert>
          ) : null}

          {validationMessage ? (
            <Alert severity="warning" sx={{ borderRadius: 0 }}>
              {validationMessage}
            </Alert>
          ) : null}

          <Grid container spacing={{ xs: 2, md: 1.75 }}>
            <Grid size={{ xs: 12, xl: 8 }}>
              <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                {isLoadingFoods ? (
                  <Stack
                    spacing={1.1}
                    alignItems="center"
                    sx={{ py: { xs: 2, md: 2.25 } }}
                  >
                    <CircularProgress size={34} thickness={5} />
                    <Typography color="text.secondary">
                      Loading the food dataset for meal planning...
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={{ xs: 2, md: 1.85 }}>
                    {renderStepContent()}

                    {activeStep < 4 ? (
                      <>
                        <Divider />
                        <Stack
                          direction={{ xs: 'column-reverse', sm: 'row' }}
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1}
                          >
                            <Button
                              variant="outlined"
                              color="inherit"
                              size="small"
                              startIcon={<AutorenewRoundedIcon />}
                              onClick={handleReset}
                              sx={{ borderRadius: 0 }}
                            >
                              Reset
                            </Button>
                            {activeStep > 0 ? (
                              <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                onClick={handleBack}
                                sx={{ borderRadius: 0 }}
                              >
                                Back
                              </Button>
                            ) : null}
                          </Stack>

                          {activeStep < 2 ? (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleNext}
                              sx={{ borderRadius: 0 }}
                            >
                              Continue
                            </Button>
                          ) : activeStep === 2 ? (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleGenerate(generationOffset)}
                              sx={{ borderRadius: 0 }}
                            >
                              Generate plan
                            </Button>
                          ) : null}
                        </Stack>
                      </>
                    ) : null}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, xl: 4 }}>
              <Stack spacing={{ xs: 2, md: 1.5 }}>
                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontWeight: 700 }}>
                      Current setup
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Goal: {getMealPlannerGoalLabel(form.goal)}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {getDietLabel(form.dietaryPreference)} •{' '}
                      {Number(form.mealsPerDay) || 4} meals/day
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {getActivityLabel(form.activityLevel)} •{' '}
                      {getMealStyleLabel(form.mealStyle)}
                    </Typography>
                  </Stack>
                </Paper>

                <Paper sx={(theme) => getCalculatorPanelSx(theme)}>
                  <Stack spacing={1}>
                    <Typography sx={{ fontWeight: 700 }}>
                      What the planner considers
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Goal-based calorie targeting, protein and fiber bias, food
                      restrictions, serving size per meal, and practical
                      meal-slot matching.
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Foods are filtered into a practical daily plan with
                      calories, protein, fiber, and fats shown clearly in the
                      results.
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  )
}

export default PlanMyMeals
