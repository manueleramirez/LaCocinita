import { z } from 'zod';

export const recipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, 'Selecciona un ingrediente'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  unitId: z.string().min(1, 'Selecciona una unidad'),
  cost: z.number().min(0, 'No puede ser negativo'),
});

export const recipeSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  instructions: z.string().optional(),
  preparationTime: z.number().min(0, 'No puede ser negativo').max(1440, 'Máximo 24 horas (1440 min)'),
  portionsPerRecipe: z.number().min(1, 'Debe ser al menos 1'),
  ingredients: z.array(recipeIngredientSchema).min(1, 'Agrega al menos un ingrediente'),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
