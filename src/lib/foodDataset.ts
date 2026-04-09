import Papa from 'papaparse'

const FOOD_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRyAMEmHyZ3RmPJw1EumOuAnC4wyUUKE617ceFX_VnnNXs5LS8V_TAL806RoUaBGgLj0Te5Yu2wzDnt/pub?gid=0&single=true&output=csv'

type FoodCsvRow = {
  id?: string
  name?: string
  category?: string
  calories_per_100g?: string
  protein_per_100g?: string
  fiber_per_100g?: string
  serving_label?: string
  serving_grams?: string
  fat_per_100g?: string
  meal_slots?: string
}

export type FoodRecord = {
  id: string
  name: string
  category: string
  caloriesPer100g: number
  proteinPer100g: number
  fiberPer100g: number
  servingLabel: string
  servingGrams: number
  fatPer100g: number
  mealSlots: string
}

let foodDatasetPromise: Promise<FoodRecord[]> | null = null

function parseNumber(value: string | undefined) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeRow(row: FoodCsvRow): FoodRecord | null {
  const id = row.id?.trim()
  const name = row.name?.trim()
  const category = row.category?.trim()

  if (!id || !name || !category) {
    return null
  }

  return {
    id,
    name,
    category,
    caloriesPer100g: parseNumber(row.calories_per_100g),
    proteinPer100g: parseNumber(row.protein_per_100g),
    fiberPer100g: parseNumber(row.fiber_per_100g),
    servingLabel: row.serving_label?.trim() || '1 serving',
    servingGrams: parseNumber(row.serving_grams) || 100,
    fatPer100g: parseNumber(row.fat_per_100g),
    mealSlots: row.meal_slots?.trim().toUpperCase() || 'S',
  }
}

function parseFoodCsv(text: string) {
  const parsed = Papa.parse<FoodCsvRow>(text, {
    header: true,
    skipEmptyLines: true,
  })

  return parsed.data
    .map(normalizeRow)
    .filter((row): row is FoodRecord => Boolean(row))
}

async function fetchFoodCsv(url: string) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Unable to load food data from ${url}`)
  }

  return response.text()
}

export async function loadFoodDataset() {
  const primaryCsv = await fetchFoodCsv(FOOD_SHEET_CSV_URL)
  return parseFoodCsv(primaryCsv)
}

export function getFoodDataset() {
  if (!foodDatasetPromise) {
    foodDatasetPromise = loadFoodDataset()
  }

  return foodDatasetPromise
}
