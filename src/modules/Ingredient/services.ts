import { ingredientRepository } from '@/infrastructure/repository/implementations/IngredientRepository';
import type { IngredientCreate } from '@/types';

export async function getAllIngredients(userId: string) {
  return ingredientRepository.getAll(userId);
}

export async function createIngredient(data: IngredientCreate) {
  return ingredientRepository.create(data);
}

export async function updateIngredient(id: string, data: IngredientCreate) {
  return ingredientRepository.update(id, data);
}

export async function deleteIngredient(id: string) {
  return ingredientRepository.delete(id);
}
