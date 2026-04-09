import type { FoodRecord } from './foodDataset'
import {
  getCaloriesPerServing,
  getFoodNutritionForGrams,
  getFoodNutritionForServing,
} from './foodNutrition'

export type MealPlannerGoal =
  | 'weight-loss'
  | 'weight-gain'
  | 'maintenance'
  | 'muscle-gain'
  | 'healthier-eating'
  | 'high-protein'
  | 'low-calorie'
  | 'balanced-diet'

export type Gender = 'female' | 'male' | 'other'

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active'

export type DietaryPreference = 'veg' | 'non-veg' | 'vegan'

export type MealStylePreference = 'simple' | 'budget' | 'variety'

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

export type MealPlannerFormState = {
  goal: MealPlannerGoal
  age: string
  gender: Gender
  heightCm: string
  weightKg: string
  activityLevel: ActivityLevel
  dietaryPreference: DietaryPreference
  mealsPerDay: string
  allergies: string
  foodsToAvoid: string
  targetCalories: string
  likedFoods: string
  dislikedFoods: string
  mealStyle: MealStylePreference
}

export type PlannerPersonStats = {
  age: number
  gender: Gender
  heightCm: number
  weightKg: number
  activityLevel: ActivityLevel
  bmi: number
  bmr: number
  maintenanceCalories: number
  targetCalories: number
}

export type NutritionTotals = {
  calories: number
  protein: number
  fiber: number
  fat: number
}

export type NormalizedPlannerFood = FoodRecord & {
  searchText: string
  mealTags: MealSlot[]
  dietaryTags: DietaryPreference[]
  processedScore: number
  satietyScore: number
  simpleScore: number
  budgetScore: number
  categoryBucket: 'protein' | 'carb' | 'produce' | 'dairy' | 'fat' | 'treat'
  varietyFamily: string
}

export type MealFoodPortion = {
  food: NormalizedPlannerFood
  role: 'anchor' | 'support' | 'produce' | 'snack'
  servings: number
  grams: number
  servingText: string
  nutrition: NutritionTotals
}

export type MealRecommendation = {
  slot: MealSlot
  title: string
  note: string
  foods: MealFoodPortion[]
  nutrition: NutritionTotals
}

export type DailyMealPlan = {
  summary: {
    goal: MealPlannerGoal
    dietaryPreference: DietaryPreference
    mealsPerDay: number
    mealStyle: MealStylePreference
  }
  person: PlannerPersonStats
  meals: MealRecommendation[]
  nutrition: NutritionTotals
  whyThisWorks: string[]
  nutritionFacts: string[]
}

type MealSlotConfig = {
  slot: MealSlot
  title: string
  targetShare: number
  itemCount: number
}

type MealContext = {
  targetCalories: number
  input: MealPlannerFormState
  usedFoodIds: Set<string>
  usedCategoryCounts: Record<string, number>
  usedVarietyFamilyCounts: Record<string, number>
  usedVarietyFamiliesBySlot: Partial<Record<MealSlot, Set<string>>>
  generationOffset: number
}

const GOAL_LABELS: Record<MealPlannerGoal, string> = {
  'balanced-diet': 'Balanced diet',
  'healthier-eating': 'Healthier eating',
  'high-protein': 'High protein',
  maintenance: 'Maintenance',
  'low-calorie': 'Low calorie',
  'muscle-gain': 'Muscle gain',
  'weight-gain': 'Weight gain',
  'weight-loss': 'Weight loss',
}

const GOAL_DESCRIPTIONS: Record<MealPlannerGoal, string> = {
  'balanced-diet':
    'Even calorie spread with a practical mix of protein, fiber, and familiar foods.',
  'healthier-eating':
    'Higher-fiber, less processed foods with steady energy across the day.',
  'high-protein':
    'Higher protein choices across meals while keeping portions practical.',
  maintenance:
    'Balanced meals sized to stay close to your estimated maintenance needs.',
  'low-calorie':
    'Lighter meal sizing with more filling choices and fewer calorie-dense extras.',
  'muscle-gain':
    'Extra protein support and enough energy to make the day easier to sustain.',
  'weight-gain':
    'Larger portions and more calorie-dense foods without turning every meal into junk food.',
  'weight-loss':
    'Higher satiety, more fiber, and controlled portion sizes to keep calories in check.',
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
}

const GOAL_CALORIE_ADJUSTMENTS: Record<MealPlannerGoal, number> = {
  'balanced-diet': 0,
  'healthier-eating': -100,
  'high-protein': 100,
  maintenance: 0,
  'low-calorie': -350,
  'muscle-gain': 250,
  'weight-gain': 350,
  'weight-loss': -450,
}

const SIMPLE_NAME_KEYWORDS = [
  'cooked',
  'boiled',
  'plain',
  'grilled',
  'roasted',
  'brown rice',
  'white rice',
  'oats',
  'yogurt',
  'curd',
  'fruit',
]

const LIMITED_PORTION_SUBCATEGORY_KEYWORDS = [
  'condiment',
  'pickle',
  'spread',
  'dip',
  'fat',
  'oil',
]

const MEAL_SLOT_CODE_MAP: Record<string, MealSlot> = {
  B: 'breakfast',
  L: 'lunch',
  D: 'dinner',
  S: 'snacks',
}

export function getMealPlannerGoalLabel(goal: MealPlannerGoal) {
  return GOAL_LABELS[goal]
}

export function getGoalDescription(goal: MealPlannerGoal) {
  return GOAL_DESCRIPTIONS[goal]
}

export function parsePreferenceTokens(value: string) {
  return value
    .toLowerCase()
    .split(/[\n,;/]+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function roundTo(value: number, precision = 1) {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getCategoryKey(category: string) {
  return category.trim().toLowerCase().replace(/\s+/g, '_')
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function getMealSlots(mealsPerDay: number): MealSlotConfig[] {
  if (mealsPerDay <= 3) {
    return [
      {
        slot: 'breakfast',
        title: 'Breakfast',
        targetShare: 0.28,
        itemCount: 2,
      },
      { slot: 'lunch', title: 'Lunch', targetShare: 0.38, itemCount: 3 },
      { slot: 'dinner', title: 'Dinner', targetShare: 0.34, itemCount: 3 },
    ]
  }

  if (mealsPerDay >= 5) {
    return [
      {
        slot: 'breakfast',
        title: 'Breakfast',
        targetShare: 0.22,
        itemCount: 2,
      },
      { slot: 'lunch', title: 'Lunch', targetShare: 0.3, itemCount: 3 },
      { slot: 'dinner', title: 'Dinner', targetShare: 0.28, itemCount: 3 },
      { slot: 'snacks', title: 'Snacks', targetShare: 0.2, itemCount: 3 },
    ]
  }

  return [
    { slot: 'breakfast', title: 'Breakfast', targetShare: 0.24, itemCount: 2 },
    { slot: 'lunch', title: 'Lunch', targetShare: 0.33, itemCount: 3 },
    { slot: 'dinner', title: 'Dinner', targetShare: 0.28, itemCount: 3 },
    { slot: 'snacks', title: 'Snacks', targetShare: 0.15, itemCount: 2 },
  ]
}

function getActivityMultiplier(level: ActivityLevel) {
  return ACTIVITY_MULTIPLIERS[level]
}

export function estimateBodyMetrics(
  input: MealPlannerFormState
): PlannerPersonStats {
  const age = Number(input.age) || 0
  const heightCm = Number(input.heightCm) || 0
  const weightKg = Number(input.weightKg) || 0
  const bmi = heightCm > 0 ? weightKg / (heightCm / 100) ** 2 : 0
  const genderOffset =
    input.gender === 'male' ? 5 : input.gender === 'female' ? -161 : -78
  const bmr =
    age > 0 && heightCm > 0 && weightKg > 0
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset
      : 0

  const maintenanceCalories = Math.max(
    1400,
    Math.round(bmr * getActivityMultiplier(input.activityLevel))
  )
  const calorieOverride = Number(input.targetCalories) || 0
  const targetCalories = calorieOverride
    ? calorieOverride
    : Math.max(1200, maintenanceCalories + GOAL_CALORIE_ADJUSTMENTS[input.goal])

  return {
    age,
    gender: input.gender,
    heightCm,
    weightKg,
    activityLevel: input.activityLevel,
    bmi: roundTo(bmi),
    bmr: Math.round(bmr),
    maintenanceCalories,
    targetCalories,
  }
}

function parseMealTags(mealSlots: string) {
  const tags = new Set<MealSlot>()

  for (const code of mealSlots.toUpperCase()) {
    const tag = MEAL_SLOT_CODE_MAP[code]

    if (tag) {
      tags.add(tag)
    }
  }

  if (tags.size === 0) {
    tags.add('snacks')
  }

  return [...tags]
}

function getVarietyFamily(food: FoodRecord) {
  const category = getCategoryKey(food.category)
  const name = normalizeSearchValue(food.name)
  const mealSlots = food.mealSlots.toUpperCase()

  if (category === 'fruits') {
    return 'fruit'
  }

  if (category === 'nuts_seeds') {
    return 'nuts-seeds'
  }

  if (category === 'beverages') {
    if (name.includes('shake') || name.includes('smoothie')) {
      return 'drink-smoothie'
    }

    if (name.includes('tea') || name.includes('coffee')) {
      return 'drink-hot'
    }

    return 'drink-cold'
  }

  if (category === 'dairy') {
    if (name.includes('yogurt') || name.includes('curd')) {
      return 'dairy-yogurt'
    }

    if (name.includes('milk')) {
      return 'dairy-milk'
    }

    if (name.includes('paneer') || name.includes('cheese')) {
      return 'dairy-cheese'
    }

    return 'dairy-other'
  }

  if (category === 'eggs') {
    if (name.includes('omelette') || name.includes('omelet')) {
      return 'eggs-omelette'
    }

    if (name.includes('scrambled') || name.includes('bhurji')) {
      return 'eggs-scramble'
    }

    if (name.includes('sandwich')) {
      return 'eggs-sandwich'
    }

    return 'eggs-basic'
  }

  if (category === 'grains') {
    if (
      name.includes('oats') ||
      name.includes('muesli') ||
      name.includes('cornflakes') ||
      name.includes('cereal')
    ) {
      return mealSlots.includes('B') ? 'breakfast-grain' : 'grain-cereal'
    }

    if (
      name.includes('poha') ||
      name.includes('idli') ||
      name.includes('upma')
    ) {
      return 'breakfast-indian'
    }

    if (
      name.includes('rice') ||
      name.includes('quinoa') ||
      name.includes('barley')
    ) {
      return 'grain-rice-base'
    }

    if (
      name.includes('bread') ||
      name.includes('chapati') ||
      name.includes('naan') ||
      name.includes('roti')
    ) {
      return 'grain-bread-base'
    }

    if (name.includes('pasta') || name.includes('noodle')) {
      return 'grain-pasta-noodle'
    }

    return mealSlots.includes('B') ? 'breakfast-grain' : 'grain-main'
  }

  if (category === 'legumes') {
    if (mealSlots.includes('B')) {
      return 'legume-breakfast'
    }

    if (
      name.includes('curry') ||
      name.includes('dal') ||
      name.includes('rajma')
    ) {
      return 'legume-curry'
    }

    return 'legume-main'
  }

  if (category === 'vegetables') {
    if (name.includes('salad')) {
      return 'vegetable-salad'
    }

    if (name.includes('soup')) {
      return 'vegetable-soup'
    }

    if (
      name.includes('curry') ||
      name.includes('bharta') ||
      name.includes('gobi') ||
      name.includes('paneer')
    ) {
      return 'vegetable-main'
    }

    return mealSlots.includes('S') ? 'vegetable-light' : 'vegetable-main'
  }

  if (category === 'meat') {
    if (name.includes('chicken')) {
      return 'meat-chicken'
    }

    if (name.includes('sausage')) {
      return 'meat-processed'
    }

    return 'meat-red'
  }

  if (category === 'seafood') {
    return name.includes('prawn') ||
      name.includes('shrimp') ||
      name.includes('crab')
      ? 'seafood-shellfish'
      : 'seafood-fish'
  }

  if (category === 'packaged_foods') {
    if (name.includes('bar')) {
      return 'snack-bar'
    }

    if (name.includes('biscuit') || name.includes('cracker')) {
      return 'snack-cracker'
    }

    if (mealSlots.includes('B')) {
      return 'breakfast-packaged'
    }

    return 'snack-packaged'
  }

  if (category === 'snacks_desserts') {
    if (
      name.includes('chips') ||
      name.includes('nacho') ||
      name.includes('popcorn')
    ) {
      return 'snack-salty'
    }

    return 'snack-sweet'
  }

  if (category === 'fast_food') {
    if (name.includes('burger') || name.includes('sandwich')) {
      return 'fastfood-burger-sandwich'
    }

    if (name.includes('pizza')) {
      return 'fastfood-pizza'
    }

    if (name.includes('wrap') || name.includes('shawarma')) {
      return 'fastfood-wrap'
    }

    return mealSlots.includes('S') ? 'fastfood-snack' : 'fastfood-main'
  }

  if (category === 'oils_fats') {
    return 'added-fat'
  }

  return category
}

function inferDietaryTags(food: FoodRecord) {
  const category = getCategoryKey(food.category)
  const searchText = `${food.name} ${food.category}`.toLowerCase()

  if (category === 'meat' || category === 'seafood') {
    return ['non-veg'] as DietaryPreference[]
  }

  if (category === 'eggs') {
    return ['non-veg'] as DietaryPreference[]
  }

  if (
    searchText.includes('chicken') ||
    searchText.includes('beef') ||
    searchText.includes('mutton') ||
    searchText.includes('fish') ||
    searchText.includes('prawn') ||
    searchText.includes('egg')
  ) {
    return ['non-veg'] as DietaryPreference[]
  }

  if (category === 'dairy') {
    return ['veg', 'non-veg'] as DietaryPreference[]
  }

  return ['veg', 'vegan', 'non-veg'] as DietaryPreference[]
}

function getProcessedScore(food: FoodRecord) {
  const category = getCategoryKey(food.category)
  const searchText = `${food.name} ${food.category}`.toLowerCase()

  if (category === 'fast_food') {
    return 1
  }

  if (category === 'packaged_foods' || category === 'snacks_desserts') {
    return 0.8
  }

  if (searchText.includes('fried') || searchText.includes('dessert')) {
    return 0.7
  }

  if (category === 'oils_fats') {
    return 0.55
  }

  return 0.15
}

function getCategoryBucket(
  food: FoodRecord
): NormalizedPlannerFood['categoryBucket'] {
  const category = getCategoryKey(food.category)
  const searchText = `${food.name} ${food.category}`.toLowerCase()

  if (
    category === 'meat' ||
    category === 'seafood' ||
    category === 'eggs' ||
    category === 'legumes'
  ) {
    return 'protein'
  }

  if (category === 'fruits' || category === 'vegetables') {
    return 'produce'
  }

  if (category === 'dairy') {
    return 'dairy'
  }

  if (category === 'oils_fats' || category === 'nuts_seeds') {
    return 'fat'
  }

  if (
    category === 'snacks_desserts' ||
    category === 'fast_food' ||
    searchText.includes('dessert')
  ) {
    return 'treat'
  }

  return 'carb'
}

export function normalizeFoodsForMealPlanner(foods: FoodRecord[]) {
  return foods.map<NormalizedPlannerFood>((food) => {
    const searchText = normalizeSearchValue(
      `${food.name} ${food.category} ${food.servingLabel} ${food.mealSlots}`
    )
    const caloriesDensity = food.caloriesPer100g / 100
    const proteinDensity = food.proteinPer100g / 10
    const fiberDensity = food.fiberPer100g / 5
    const processedScore = getProcessedScore(food)

    return {
      ...food,
      searchText,
      mealTags: parseMealTags(food.mealSlots),
      dietaryTags: inferDietaryTags(food),
      processedScore,
      satietyScore:
        caloriesDensity < 1.9
          ? fiberDensity + proteinDensity
          : fiberDensity + proteinDensity * 0.85,
      simpleScore: SIMPLE_NAME_KEYWORDS.some((keyword) =>
        searchText.includes(keyword)
      )
        ? 1
        : processedScore < 0.3
          ? 0.8
          : 0.45,
      budgetScore:
        getCategoryKey(food.category) === 'legumes' ||
        getCategoryKey(food.category) === 'grains' ||
        getCategoryKey(food.category) === 'vegetables' ||
        getCategoryKey(food.category) === 'fruits' ||
        getCategoryKey(food.category) === 'eggs'
          ? 1
          : getCategoryKey(food.category) === 'seafood' ||
              getCategoryKey(food.category) === 'fast_food'
            ? 0.25
            : 0.55,
      categoryBucket: getCategoryBucket(food),
      varietyFamily: getVarietyFamily(food),
    }
  })
}

function matchesToken(text: string, tokens: string[]) {
  return tokens.some((token) => text.includes(token))
}

function isFoodAllowed(
  food: NormalizedPlannerFood,
  input: MealPlannerFormState
) {
  if (!food.dietaryTags.includes(input.dietaryPreference)) {
    return false
  }

  const blockedTokens = [
    ...parsePreferenceTokens(input.allergies),
    ...parsePreferenceTokens(input.foodsToAvoid),
    ...parsePreferenceTokens(input.dislikedFoods),
  ]

  if (
    blockedTokens.length > 0 &&
    matchesToken(food.searchText, blockedTokens)
  ) {
    return false
  }

  return true
}

export function filterFoodsForUser(
  foods: NormalizedPlannerFood[],
  input: MealPlannerFormState
) {
  return foods.filter((food) => isFoodAllowed(food, input))
}

function getPreferenceBonus(
  food: NormalizedPlannerFood,
  input: MealPlannerFormState
) {
  const likedTokens = parsePreferenceTokens(input.likedFoods)

  if (likedTokens.length === 0) {
    return 0
  }

  return likedTokens.reduce((score, token) => {
    if (!token) {
      return score
    }

    if (food.searchText.includes(token)) {
      return score + 8
    }

    if (
      food.category.includes(token) ||
      food.mealSlots.toLowerCase().includes(token)
    ) {
      return score + 4
    }

    return score
  }, 0)
}

export function scoreFoodForGoal(
  food: NormalizedPlannerFood,
  input: MealPlannerFormState,
  slot: MealSlot,
  targetCalories: number,
  usedFoodIds: Set<string>,
  usedCategoryCounts: Record<string, number>,
  usedVarietyFamilyCounts: Record<string, number>,
  usedVarietyFamiliesBySlot: Partial<Record<MealSlot, Set<string>>>,
  generationOffset: number
) {
  const servingNutrition = getFoodNutritionForServing(food)
  const caloriesPerServing = servingNutrition.calories
  const proteinPerServing = servingNutrition.protein
  const fiberPerServing = servingNutrition.fiber
  const fatPerServing = servingNutrition.fat
  const mealTagBonus = food.mealTags.includes(slot) ? 14 : -8
  const duplicationPenalty = usedFoodIds.has(food.id) ? 24 : 0
  const categoryPenalty = (usedCategoryCounts[food.categoryBucket] ?? 0) * 5
  const varietyPenalty = (usedVarietyFamilyCounts[food.varietyFamily] ?? 0) * 9
  const adjacentSlotPenalty = Object.entries(usedVarietyFamiliesBySlot).reduce(
    (penalty, [trackedSlot, families]) => {
      if (!families?.has(food.varietyFamily)) {
        return penalty
      }

      if (trackedSlot === slot) {
        return penalty + 6
      }

      if (
        (trackedSlot === 'breakfast' && slot === 'snacks') ||
        (trackedSlot === 'snacks' && slot === 'breakfast') ||
        (trackedSlot === 'lunch' && slot === 'dinner') ||
        (trackedSlot === 'dinner' && slot === 'lunch')
      ) {
        return penalty + 8
      }

      return penalty + 4
    },
    0
  )
  const targetDistancePenalty =
    Math.abs(targetCalories - caloriesPerServing) * 0.03
  const preferenceBonus = getPreferenceBonus(food, input)
  const rotationPenalty = Math.abs(generationOffset % 5)

  let score =
    mealTagBonus +
    preferenceBonus -
    duplicationPenalty -
    categoryPenalty -
    varietyPenalty -
    adjacentSlotPenalty

  if (input.mealStyle === 'simple') {
    score += food.simpleScore * 8
  } else if (input.mealStyle === 'budget') {
    score += food.budgetScore * 10
  } else {
    score +=
      (1 - Math.min(1, (usedCategoryCounts[food.categoryBucket] ?? 0) * 0.35)) *
      6
  }

  if (slot === 'breakfast') {
    const category = getCategoryKey(food.category)
    score += category === 'fruits' || category === 'dairy' ? 6 : 0
  }

  if (slot === 'snacks') {
    const category = getCategoryKey(food.category)
    score += category === 'fruits' || category === 'nuts_seeds' ? 7 : 0
    if (
      food.varietyFamily === 'snack-packaged' ||
      food.varietyFamily === 'snack-salty' ||
      food.varietyFamily === 'snack-sweet'
    ) {
      score -= (usedVarietyFamilyCounts[food.varietyFamily] ?? 0) * 10
    }
  }

  switch (input.goal) {
    case 'weight-loss':
      score += proteinPerServing * 1.25 + fiberPerServing * 2.6
      score -= caloriesPerServing * 0.035
      score -= food.processedScore * 12
      break
    case 'weight-gain':
      score += caloriesPerServing * 0.05 + proteinPerServing * 1.1
      score += fatPerServing * 0.35
      score -= food.processedScore * 4
      break
    case 'muscle-gain':
      score += proteinPerServing * 1.65
      score += caloriesPerServing * 0.02
      score -= food.processedScore * 5
      break
    case 'high-protein':
      score += proteinPerServing * 1.75
      score += fiberPerServing * 0.8
      score -= food.processedScore * 6
      break
    case 'low-calorie':
      score += fiberPerServing * 2.2 + food.satietyScore * 4
      score -= caloriesPerServing * 0.05
      score -= food.processedScore * 8
      break
    case 'healthier-eating':
      score += proteinPerServing + fiberPerServing * 1.7 + food.satietyScore * 3
      score -= food.processedScore * 9
      break
    case 'balanced-diet':
    case 'maintenance':
    default:
      score += proteinPerServing * 1.15 + fiberPerServing * 1.2
      score -= food.processedScore * 6
      break
  }

  if (
    getCategoryKey(food.category) === 'fast_food' ||
    getCategoryKey(food.category) === 'snacks_desserts'
  ) {
    score -=
      input.goal === 'weight-gain' ? 4 : input.goal === 'maintenance' ? 10 : 18
  }

  score -= targetDistancePenalty
  score -= rotationPenalty * 0.2

  return score
}

function getRoleOrder(slot: MealSlot) {
  if (slot === 'breakfast') {
    return ['anchor', 'produce'] as const
  }

  if (slot === 'snacks') {
    return ['snack'] as const
  }

  return ['anchor', 'support', 'produce'] as const
}

function scoreRoleFit(
  food: NormalizedPlannerFood,
  slot: MealSlot,
  role: MealFoodPortion['role']
) {
  if (role === 'anchor') {
    if (food.categoryBucket === 'protein' || food.categoryBucket === 'carb') {
      return 10
    }

    if (food.categoryBucket === 'dairy' && slot === 'breakfast') {
      return 8
    }

    return -4
  }

  if (role === 'support') {
    if (food.categoryBucket === 'protein' || food.categoryBucket === 'carb') {
      return 6
    }

    if (food.categoryBucket === 'dairy') {
      return 5
    }

    return 0
  }

  if (role === 'produce') {
    return food.categoryBucket === 'produce'
      ? 10
      : getCategoryKey(food.category) === 'dairy' && slot === 'breakfast'
        ? 4
        : -5
  }

  if (
    getCategoryKey(food.category) === 'fruits' ||
    getCategoryKey(food.category) === 'nuts_seeds'
  ) {
    return 10
  }

  if (
    getCategoryKey(food.category) === 'dairy' ||
    getCategoryKey(food.category) === 'beverages'
  ) {
    return 7
  }

  if (getCategoryKey(food.category) === 'packaged_foods') {
    return 2
  }

  return -6
}

function chooseServingSizeForMeal(
  food: NormalizedPlannerFood,
  slot: MealSlot,
  role: MealFoodPortion['role'],
  targetCalories: number,
  goal: MealPlannerGoal
) {
  const caloriesPerBaseServing = getCaloriesPerServing(food)
  const roleShare =
    role === 'anchor'
      ? 0.52
      : role === 'support'
        ? 0.28
        : role === 'produce'
          ? 0.2
          : 0.75
  const desiredCalories = Math.max(40, targetCalories * roleShare)

  let minServings = slot === 'snacks' ? 0.45 : 0.65
  let maxServings = slot === 'snacks' ? 1.2 : 1.8

  if (
    getCategoryKey(food.category) === 'nuts_seeds' ||
    LIMITED_PORTION_SUBCATEGORY_KEYWORDS.some((keyword) =>
      food.searchText.includes(keyword)
    )
  ) {
    minServings = 0.25
    maxServings = slot === 'snacks' ? 0.75 : 0.6
  }

  if (goal === 'weight-gain' || goal === 'muscle-gain') {
    maxServings += 0.25
  }

  if (goal === 'weight-loss' || goal === 'low-calorie') {
    const category = getCategoryKey(food.category)
    maxServings -= category === 'fruits' || category === 'vegetables' ? 0 : 0.2
  }

  const servings =
    caloriesPerBaseServing > 0
      ? clamp(
          desiredCalories / caloriesPerBaseServing,
          minServings,
          maxServings
        )
      : minServings
  const roundedServings =
    servings < 1 ? roundTo(servings, 2) : Math.round(servings * 4) / 4
  const grams = Math.max(5, Math.round(roundedServings * food.servingGrams))
  const nutrition = getFoodNutritionForGrams(food, grams)

  return {
    servings: roundedServings,
    grams,
    nutrition: {
      calories: roundTo(nutrition.calories),
      protein: roundTo(nutrition.protein),
      fiber: roundTo(nutrition.fiber),
      fat: roundTo(nutrition.fat),
    },
  }
}

function formatServingText(
  food: NormalizedPlannerFood,
  servings: number,
  grams: number
) {
  const roundedServings =
    servings % 1 === 0
      ? String(servings)
      : servings.toFixed(servings < 1 ? 2 : 1)
  const servingWord =
    servings <= 1
      ? food.servingLabel
      : `${roundedServings} x ${food.servingLabel}`

  return `${servingWord} (${grams} g)`
}

function buildMealNote(
  slot: MealSlot,
  goal: MealPlannerGoal,
  meal: MealRecommendation
) {
  const totalProtein = meal.nutrition.protein
  const totalFiber = meal.nutrition.fiber

  if (slot === 'snacks') {
    return totalProtein >= 12
      ? 'A steadier snack choice with extra protein.'
      : 'A lighter snack slot to keep the day easier to sustain.'
  }

  if (goal === 'weight-loss' || goal === 'low-calorie') {
    return totalFiber >= 8
      ? 'Built to feel more filling for the calories.'
      : 'Kept lighter while still giving the meal a proper anchor.'
  }

  if (goal === 'muscle-gain' || goal === 'high-protein') {
    return totalProtein >= 25
      ? 'Protein-forward meal to support your goal across the day.'
      : 'Balanced around an easy protein source and a practical side.'
  }

  if (goal === 'weight-gain') {
    return 'Portions lean a little larger so the day is easier to finish.'
  }

  return 'Sized to keep your day balanced without relying on one very heavy meal.'
}

function rotateRankedFoods<T>(items: T[], rotationSeed: number, count: number) {
  if (items.length <= 1) {
    return items
  }

  const rotationWindow = Math.min(items.length, Math.max(count * 6, 12))
  const rotationIndex = rotationSeed % rotationWindow

  if (rotationIndex === 0) {
    return items
  }

  return [
    ...items.slice(rotationIndex, rotationWindow),
    ...items.slice(0, rotationIndex),
    ...items.slice(rotationWindow),
  ]
}

function pickTopFoods(
  foods: NormalizedPlannerFood[],
  input: MealPlannerFormState,
  slot: MealSlot,
  mealTargetCalories: number,
  role: MealFoodPortion['role'],
  count: number,
  context: MealContext,
  excludedFoodIds: Set<string>
) {
  const ranked = foods
    .filter((food) => !excludedFoodIds.has(food.id))
    .map((food) => ({
      food,
      score:
        scoreFoodForGoal(
          food,
          input,
          slot,
          mealTargetCalories / Math.max(1, count),
          context.usedFoodIds,
          context.usedCategoryCounts,
          context.usedVarietyFamilyCounts,
          context.usedVarietyFamiliesBySlot,
          context.generationOffset
        ) + scoreRoleFit(food, slot, role),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.food.name.localeCompare(right.food.name)
    })
  const slotSalt =
    slot === 'breakfast' ? 1 : slot === 'lunch' ? 3 : slot === 'dinner' ? 5 : 7
  const roleSalt =
    role === 'anchor' ? 2 : role === 'support' ? 4 : role === 'produce' ? 6 : 8
  const rotationSeed = context.generationOffset * 3 + slotSalt + roleSalt
  const rotationWindow = Math.min(ranked.length, Math.max(count * 6, 12))
  const rotatedRanked =
    rotationWindow > 1
      ? [
          ...rotateRankedFoods(
            ranked.slice(0, rotationWindow),
            rotationSeed,
            count
          ),
          ...ranked.slice(rotationWindow),
        ]
      : ranked

  const selected: NormalizedPlannerFood[] = []
  const selectedFamilies = new Set<string>()

  const pickFromRanked = (allowFamilyReuse: boolean) => {
    for (const entry of rotatedRanked) {
      if (selected.some((item) => item.id === entry.food.id)) {
        continue
      }

      if (!allowFamilyReuse && selectedFamilies.has(entry.food.varietyFamily)) {
        continue
      }

      if (
        role === 'support' &&
        selected.some(
          (item) => item.categoryBucket === entry.food.categoryBucket
        )
      ) {
        continue
      }

      selected.push(entry.food)
      selectedFamilies.add(entry.food.varietyFamily)

      if (selected.length >= count) {
        return true
      }
    }

    return false
  }

  if (!pickFromRanked(false) && selected.length < count) {
    pickFromRanked(true)
  }

  return selected
}

function getFoodsBySlot(foods: NormalizedPlannerFood[], slot: MealSlot) {
  return foods.filter((food) => food.mealTags.includes(slot))
}

export function groupFoodsByMealType(foods: NormalizedPlannerFood[]) {
  return {
    breakfast: getFoodsBySlot(foods, 'breakfast'),
    lunch: getFoodsBySlot(foods, 'lunch'),
    dinner: getFoodsBySlot(foods, 'dinner'),
    snacks: getFoodsBySlot(foods, 'snacks'),
  }
}

function createMealPortions(
  pickedFoods: NormalizedPlannerFood[],
  slot: MealSlot,
  role: MealFoodPortion['role'],
  mealTargetCalories: number,
  goal: MealPlannerGoal
) {
  return pickedFoods.map<MealFoodPortion>((food) => {
    const portion = chooseServingSizeForMeal(
      food,
      slot,
      role,
      mealTargetCalories,
      goal
    )

    return {
      food,
      role,
      servings: portion.servings,
      grams: portion.grams,
      servingText: formatServingText(food, portion.servings, portion.grams),
      nutrition: portion.nutrition,
    }
  })
}

function sumNutrition(values: NutritionTotals[]) {
  return values.reduce<NutritionTotals>(
    (totals, current) => ({
      calories: totals.calories + current.calories,
      protein: totals.protein + current.protein,
      fiber: totals.fiber + current.fiber,
      fat: totals.fat + current.fat,
    }),
    {
      calories: 0,
      protein: 0,
      fiber: 0,
      fat: 0,
    }
  )
}

function compactNutrition(totals: NutritionTotals): NutritionTotals {
  return {
    calories: Math.round(totals.calories),
    protein: roundTo(totals.protein),
    fiber: roundTo(totals.fiber),
    fat: roundTo(totals.fat),
  }
}

function buildMealForSlot(
  slotConfig: MealSlotConfig,
  foods: NormalizedPlannerFood[],
  input: MealPlannerFormState,
  context: MealContext
) {
  const slotFoods = getFoodsBySlot(foods, slotConfig.slot)
  const title = slotConfig.title
  const portions: MealFoodPortion[] = []
  const mealFoodIds = new Set<string>()

  const roleOrder = getRoleOrder(slotConfig.slot)

  for (const role of roleOrder) {
    const count =
      slotConfig.slot === 'snacks'
        ? slotConfig.itemCount
        : role === 'anchor'
          ? 1
          : 1
    const picked = pickTopFoods(
      slotFoods,
      input,
      slotConfig.slot,
      slotConfig.targetShare * context.targetCalories,
      role,
      role === 'snack' ? slotConfig.itemCount : count,
      context,
      mealFoodIds
    )

    if (picked.length === 0 && mealFoodIds.size > 0) {
      const fallbackPicked = pickTopFoods(
        slotFoods,
        input,
        slotConfig.slot,
        slotConfig.targetShare * context.targetCalories,
        role,
        role === 'snack' ? slotConfig.itemCount : count,
        context,
        new Set<string>()
      )
      picked.push(...fallbackPicked)
    }

    const rolePortions = createMealPortions(
      picked,
      slotConfig.slot,
      role,
      slotConfig.targetShare * context.targetCalories,
      input.goal
    )

    rolePortions.forEach((portion) => {
      portions.push(portion)
      mealFoodIds.add(portion.food.id)
      context.usedFoodIds.add(portion.food.id)
      context.usedCategoryCounts[portion.food.categoryBucket] =
        (context.usedCategoryCounts[portion.food.categoryBucket] ?? 0) + 1
      context.usedVarietyFamilyCounts[portion.food.varietyFamily] =
        (context.usedVarietyFamilyCounts[portion.food.varietyFamily] ?? 0) + 1
      if (!context.usedVarietyFamiliesBySlot[slotConfig.slot]) {
        context.usedVarietyFamiliesBySlot[slotConfig.slot] = new Set<string>()
      }
      context.usedVarietyFamiliesBySlot[slotConfig.slot]?.add(
        portion.food.varietyFamily
      )
    })

    if (slotConfig.slot === 'snacks') {
      break
    }
  }

  const trimmedPortions = portions.slice(0, slotConfig.itemCount)
  const nutrition = compactNutrition(
    sumNutrition(trimmedPortions.map((item) => item.nutrition))
  )

  const meal: MealRecommendation = {
    slot: slotConfig.slot,
    title,
    note: '',
    foods: trimmedPortions,
    nutrition,
  }

  meal.note = buildMealNote(slotConfig.slot, input.goal, meal)

  return meal
}

export function balanceDailyNutrition(
  meals: MealRecommendation[],
  targetCalories: number
) {
  const currentTotals = sumNutrition(meals.map((meal) => meal.nutrition))
  const calorieGap = targetCalories - currentTotals.calories

  if (Math.abs(calorieGap) <= 140) {
    return meals
  }

  return meals.map((meal) => {
    if (meal.foods.length === 0) {
      return meal
    }

    const isMainMeal = meal.slot === 'lunch' || meal.slot === 'dinner'
    const adjustment = isMainMeal ? calorieGap / 2 : calorieGap / 4
    const anchor = meal.foods[0]
    const caloriesPerGram = anchor.food.caloriesPer100g / 100

    if (!caloriesPerGram) {
      return meal
    }

    const nextGrams = clamp(
      anchor.grams + adjustment / caloriesPerGram,
      getCategoryKey(anchor.food.category) === 'nuts_seeds'
        ? anchor.food.servingGrams * 0.4
        : anchor.food.servingGrams * 0.65,
      anchor.food.servingGrams * 2
    )
    const roundedGrams = Math.round(nextGrams)
    const nutrition = getFoodNutritionForGrams(anchor.food, roundedGrams)
    const updatedAnchor: MealFoodPortion = {
      ...anchor,
      grams: roundedGrams,
      servings: roundTo(
        roundedGrams / Math.max(1, anchor.food.servingGrams),
        2
      ),
      servingText: formatServingText(
        anchor.food,
        roundTo(roundedGrams / Math.max(1, anchor.food.servingGrams), 2),
        roundedGrams
      ),
      nutrition: {
        calories: roundTo(nutrition.calories),
        protein: roundTo(nutrition.protein),
        fiber: roundTo(nutrition.fiber),
        fat: roundTo(nutrition.fat),
      },
    }

    const foods = [updatedAnchor, ...meal.foods.slice(1)]

    return {
      ...meal,
      foods,
      nutrition: compactNutrition(
        sumNutrition(foods.map((item) => item.nutrition))
      ),
    }
  })
}

export function buildWhyThisWorks(
  plan: DailyMealPlan,
  input: MealPlannerFormState
) {
  const lines = [
    GOAL_DESCRIPTIONS[input.goal],
    `Calories are spread across ${plan.meals.length} meal slots so one meal does not have to do all the work.`,
  ]

  if (plan.nutrition.protein >= plan.person.weightKg * 1.1) {
    lines.push(
      'Protein stays fairly steady across the day, which helps the plan feel more practical and satisfying.'
    )
  }

  if (plan.nutrition.fiber >= 22) {
    lines.push(
      'Fiber stays solid through fruits, vegetables, legumes, or grains, which supports fullness and a steadier day.'
    )
  }

  if (input.mealStyle === 'budget') {
    lines.push(
      'The food mix leans toward accessible staples like grains, legumes, eggs, fruit, and simpler mains.'
    )
  } else if (input.mealStyle === 'simple') {
    lines.push(
      'The meal structure avoids overcomplicated combinations and keeps portions easier to follow.'
    )
  }

  return lines.slice(0, 4)
}

export function buildNutritionFacts(plan: DailyMealPlan) {
  const allFoods = plan.meals.flatMap((meal) => meal.foods)
  const highestProtein = [...allFoods].sort(
    (left, right) => right.nutrition.protein - left.nutrition.protein
  )[0]
  const highestFiber = [...allFoods].sort(
    (left, right) => right.nutrition.fiber - left.nutrition.fiber
  )[0]
  const highestFat = [...allFoods].sort(
    (left, right) => right.nutrition.fat - left.nutrition.fat
  )[0]
  const fruitVegCount = allFoods.filter(
    (item) =>
      getCategoryKey(item.food.category) === 'fruits' ||
      getCategoryKey(item.food.category) === 'vegetables'
  ).length

  const facts = []

  if (highestProtein) {
    facts.push(
      `${highestProtein.food.name} is the strongest protein contributor in this plan at about ${highestProtein.nutrition.protein} g in the suggested portion.`
    )
  }

  if (highestFiber) {
    facts.push(
      `${highestFiber.food.name} adds one of the stronger fiber bumps in the day at about ${highestFiber.nutrition.fiber} g in the planned serving.`
    )
  }

  if (highestFat) {
    facts.push(
      `${highestFat.food.name} contributes the most fats in this version of the plan, which can help with fullness or calorie density depending on your goal.`
    )
  }

  if (fruitVegCount >= 3) {
    facts.push(
      'The day includes multiple fruit or vegetable picks, which helps spread fiber and variety instead of relying on one heavy item.'
    )
  }

  return facts.slice(0, 4)
}

export function generateMealPlan(
  foods: FoodRecord[],
  input: MealPlannerFormState,
  generationOffset = 0
) {
  const normalizedFoods = normalizeFoodsForMealPlanner(foods)
  const filteredFoods = filterFoodsForUser(normalizedFoods, input)
  const person = estimateBodyMetrics(input)
  const slots = getMealSlots(Math.max(3, Number(input.mealsPerDay) || 4))

  const context: MealContext = {
    targetCalories: person.targetCalories,
    input,
    usedFoodIds: new Set<string>(),
    usedCategoryCounts: {},
    usedVarietyFamilyCounts: {},
    usedVarietyFamiliesBySlot: {},
    generationOffset,
  }

  const meals = slots.map((slotConfig, index) =>
    buildMealForSlot(slotConfig, filteredFoods, input, {
      ...context,
      generationOffset: generationOffset + index,
    })
  )
  const balancedMeals = balanceDailyNutrition(meals, person.targetCalories)
  const nutrition = compactNutrition(
    sumNutrition(balancedMeals.map((meal) => meal.nutrition))
  )

  const plan: DailyMealPlan = {
    summary: {
      goal: input.goal,
      dietaryPreference: input.dietaryPreference,
      mealsPerDay: Math.max(3, Number(input.mealsPerDay) || 4),
      mealStyle: input.mealStyle,
    },
    person,
    meals: balancedMeals,
    nutrition,
    whyThisWorks: [],
    nutritionFacts: [],
  }

  plan.whyThisWorks = buildWhyThisWorks(plan, input)
  plan.nutritionFacts = buildNutritionFacts(plan)

  return plan
}
