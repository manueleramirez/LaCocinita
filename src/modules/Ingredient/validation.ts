import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  quantity: z.number().min(0, 'No puede ser negativo'),
  unitId: z.string().min(1, 'Selecciona una unidad'),
  unitPrice: z.number().min(0, 'No puede ser negativo'),
  distributorId: z.string().optional(),
  brand: z.string().max(100).optional(),
  categoryId: z.string().optional(),
  minStock: z.number().min(0, 'No puede ser negativo').optional(),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
