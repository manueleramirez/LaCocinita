import { supabase } from '@/infrastructure/supabase/client';
import type { ApiResponse, Recipe, RecipeCreate, RecipeIngredient } from '@/types';

interface RawRecipe {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  preparation_time: number;
  portions_per_recipe: number;
  category_id: string | null;
  image_url: string | null;
  current_version: number;
  total_ingredients_cost: number;
  indirect_spends: number;
  personal_spends: number;
  prepare_cost: number;
  revenue_margin: number;
  recommended_sales_price: number;
  recommended_sales_price_per_portion: number;
  created_at: string;
}

function toModel(raw: RawRecipe, ingredients: RecipeIngredient[] = []): Recipe {
  return {
    id: raw.id,
    userId: raw.user_id,
    name: raw.name,
    description: raw.description ?? undefined,
    instructions: raw.instructions ?? undefined,
    preparationTime: raw.preparation_time,
    portionsPerRecipe: raw.portions_per_recipe,
    categoryId: raw.category_id ?? undefined,
    imageUrl: raw.image_url ?? undefined,
    currentVersion: raw.current_version,
    totalIngredientsCost: raw.total_ingredients_cost,
    indirectSpends: raw.indirect_spends,
    personalSpends: raw.personal_spends,
    prepareCost: raw.prepare_cost,
    revenueMargin: raw.revenue_margin,
    recommendedSalesPrice: raw.recommended_sales_price,
    recommendedSalesPricePerPortion: raw.recommended_sales_price_per_portion,
    createdAt: raw.created_at,
    ingredients,
  };
}

export async function getAllRecipes(userId: string): Promise<ApiResponse<Recipe[]>> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipes_ingredients(*)')
      .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { isSuccess: false, data: null, error: error.message };

  const recipes = (data ?? []).map((raw: Record<string, unknown>) => {
    const r = raw as unknown as RawRecipe & { recipes_ingredients: Array<Record<string, unknown>> };
    const ingredients = (r.recipes_ingredients ?? []).map((ri: Record<string, unknown>) => ({
      ingredientId: ri.ingredient_id as string,
      quantity: ri.quantity as number,
      unitId: ri.unit_id as string,
      cost: ri.cost as number,
    }));
    return toModel(r, ingredients);
  });

  return { isSuccess: true, data: recipes };
}

export async function getRecipeById(id: string): Promise<ApiResponse<Recipe>> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipes_ingredients(*)')
    .eq('id', id)
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };

  const r = data as unknown as RawRecipe & { recipes_ingredients: Array<Record<string, unknown>> };
  const ingredients = (r.recipes_ingredients ?? []).map((ri) => ({
    ingredientId: ri.ingredient_id as string,
    quantity: ri.quantity as number,
    unitId: ri.unit_id as string,
    cost: ri.cost as number,
  }));

  return { isSuccess: true, data: toModel(r, ingredients) };
}

export async function createRecipe(recipe: RecipeCreate): Promise<ApiResponse<Recipe>> {
  const { ingredients, ...recipeData } = recipe;

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      name: recipeData.name,
      description: recipeData.description ?? null,
      instructions: recipeData.instructions ?? null,
      preparation_time: recipeData.preparationTime,
      portions_per_recipe: recipeData.portionsPerRecipe,
    })
    .select()
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };

  if (ingredients.length > 0) {
    const { error: relError } = await supabase.from('recipes_ingredients').insert(
      ingredients.map((ing) => ({
        recipe_id: (data as RawRecipe).id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
        unit_id: ing.unitId,
        cost: ing.cost,
      }))
    );

    if (relError) return { isSuccess: false, data: null, error: relError.message };
  }

  return getRecipeById((data as RawRecipe).id);
}

export async function updateRecipe(id: string, recipe: RecipeCreate): Promise<ApiResponse<Recipe>> {
  const { ingredients, ...recipeData } = recipe;

  const { error: updateError } = await supabase
    .from('recipes')
    .update({
      name: recipeData.name,
      description: recipeData.description ?? null,
      instructions: recipeData.instructions ?? null,
      preparation_time: recipeData.preparationTime,
      portions_per_recipe: recipeData.portionsPerRecipe,
    })
    .eq('id', id);

  if (updateError) return { isSuccess: false, data: null, error: updateError.message };

  const { error: deleteError } = await supabase
    .from('recipes_ingredients')
    .delete()
    .eq('recipe_id', id);

  if (deleteError) return { isSuccess: false, data: null, error: deleteError.message };

  if (ingredients.length > 0) {
    const { error: relError } = await supabase.from('recipes_ingredients').insert(
      ingredients.map((ing) => ({
        recipe_id: id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
        unit_id: ing.unitId,
        cost: ing.cost,
      }))
    );

    if (relError) return { isSuccess: false, data: null, error: relError.message };
  }

  return getRecipeById(id);
}

export async function deleteRecipe(id: string): Promise<ApiResponse<boolean>> {
  const { error: relError } = await supabase.from('recipes_ingredients').delete().eq('recipe_id', id);
  if (relError) return { isSuccess: false, data: null, error: relError.message };

  const { error: verError } = await supabase.from('recipe_versions').delete().eq('recipe_id', id);
  if (verError) return { isSuccess: false, data: null, error: verError.message };

  const { error: menuError } = await supabase.from('menu_recipes').delete().eq('recipe_id', id);
  if (menuError) return { isSuccess: false, data: null, error: menuError.message };

  const { error } = await supabase.from('recipes').delete().eq('id', id);
  if (error) return { isSuccess: false, data: null, error: error.message };
  return { isSuccess: true, data: true };
}
