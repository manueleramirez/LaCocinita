import * as recipeRepo from '@/infrastructure/repository/implementations/RecipeRepository';
import type { RecipeCreate } from '@/types';

export async function getAllRecipes(userId: string) {
  return recipeRepo.getAllRecipes(userId);
}

export async function createRecipe(data: RecipeCreate) {
  return recipeRepo.createRecipe(data);
}

export async function updateRecipe(id: string, data: RecipeCreate) {
  return recipeRepo.updateRecipe(id, data);
}

export async function deleteRecipe(id: string) {
  return recipeRepo.deleteRecipe(id);
}

export async function getRecipeById(id: string) {
  return recipeRepo.getRecipeById(id);
}
