import type { FoodRecord } from './foodDataset'

export type FoodNutritionTotals = {
  calories: number
  protein: number
  fiber: number
  fat: number
}

function getServingBaseGrams(food: FoodRecord) {
  return Math.max(food.servingGrams || 0, 1)
}

function scaleNutrition(food: FoodRecord, factor: number): FoodNutritionTotals {
  return {
    calories: food.caloriesPer100g * factor,
    protein: food.proteinPer100g * factor,
    fiber: food.fiberPer100g * factor,
    fat: food.fatPer100g * factor,
  }
}

export function getFoodNutritionForServing(food: FoodRecord) {
  return scaleNutrition(food, getServingBaseGrams(food) / 100)
}

export function getFoodNutritionForServings(
  food: FoodRecord,
  servings: number
) {
  return scaleNutrition(
    food,
    (getServingBaseGrams(food) * Math.max(servings, 0)) / 100
  )
}

export function getFoodNutritionForGrams(food: FoodRecord, grams: number) {
  return scaleNutrition(food, Math.max(grams, 0) / 100)
}

export function getCaloriesPerServing(food: FoodRecord) {
  return getFoodNutritionForServing(food).calories
}
