import { supabase } from '@/infrastructure/supabase/client';
import type { ApiResponse, Menu, MenuRecipe } from '@/types';

interface RawMenu {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  valid_from: string | null;
  valid_to: string | null;
  total_price: number;
  created_at: string;
}

function toModel(raw: RawMenu, recipes: MenuRecipe[] = []): Menu {
  return {
    id: raw.id,
    userId: raw.user_id,
    name: raw.name,
    description: raw.description ?? undefined,
    isActive: raw.is_active,
    validFrom: raw.valid_from ?? undefined,
    validTo: raw.valid_to ?? undefined,
    totalPrice: raw.total_price,
    createdAt: raw.created_at,
    recipes,
  };
}

export async function getAllMenus(userId: string): Promise<ApiResponse<Menu[]>> {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return { isSuccess: false, data: null, error: error.message };
  const menus = (data ?? []).map((r) => toModel(r as RawMenu));
  return { isSuccess: true, data: menus };
}

export async function getMenuById(id: string): Promise<ApiResponse<Menu>> {
  const { data, error } = await supabase
    .from('menus')
    .select('*, menu_recipes(*)')
    .eq('id', id)
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };
  const r = data as unknown as RawMenu & { menu_recipes: Array<Record<string, unknown>> };
  const recipes = (r.menu_recipes ?? []).map((mr) => ({
    recipeId: mr.recipe_id as string,
    portionAdjustment: mr.portion_adjustment as number,
  }));
  return { isSuccess: true, data: toModel(r, recipes) };
}

export async function createMenu(menu: { name: string; description?: string; recipes: MenuRecipe[] }): Promise<ApiResponse<Menu>> {
  const { data, error } = await supabase
    .from('menus')
    .insert({ name: menu.name, description: menu.description ?? null })
    .select()
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };

  if (menu.recipes.length > 0) {
    const { error: relError } = await supabase.from('menu_recipes').insert(
      menu.recipes.map((r) => ({
        menu_id: (data as RawMenu).id,
        recipe_id: r.recipeId,
        portion_adjustment: r.portionAdjustment ?? 1,
      }))
    );
    if (relError) return { isSuccess: false, data: null, error: relError.message };
  }

  return getMenuById((data as RawMenu).id);
}

export async function updateMenu(id: string, menu: { name: string; description?: string; recipes: MenuRecipe[] }): Promise<ApiResponse<Menu>> {
  const { error: updateError } = await supabase
    .from('menus')
    .update({ name: menu.name, description: menu.description ?? null })
    .eq('id', id);

  if (updateError) return { isSuccess: false, data: null, error: updateError.message };

  await supabase.from('menu_recipes').delete().eq('menu_id', id);

  if (menu.recipes.length > 0) {
    const { error: relError } = await supabase.from('menu_recipes').insert(
      menu.recipes.map((r) => ({
        menu_id: id,
        recipe_id: r.recipeId,
        portion_adjustment: r.portionAdjustment ?? 1,
      }))
    );
    if (relError) return { isSuccess: false, data: null, error: relError.message };
  }

  return getMenuById(id);
}

export async function deleteMenu(id: string): Promise<ApiResponse<boolean>> {
  const { error: relError } = await supabase.from('menu_recipes').delete().eq('menu_id', id);
  if (relError) return { isSuccess: false, data: null, error: relError.message };

  const { error } = await supabase.from('menus').delete().eq('id', id);
  if (error) return { isSuccess: false, data: null, error: error.message };
  return { isSuccess: true, data: true };
}
