import { BaseRepository } from '@/infrastructure/repository/BaseRepository';
import { supabase } from '@/infrastructure/supabase/client';
import type { ApiResponse, Ingredient, IngredientCreate } from '@/types';

interface RawIngredient {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit_id: string;
  unit_price: number;
  distributor_id: string | null;
  brand: string | null;
  category_id: string | null;
  min_stock: number | null;
  image_url: string | null;
  created_at: string;
}

export class IngredientRepository extends BaseRepository<Ingredient, IngredientCreate> {
  protected tableName = 'ingredients';

  protected toModel(raw: Record<string, unknown>): Ingredient {
    const r = raw as unknown as RawIngredient;
    return {
      id: r.id,
      userId: r.user_id,
      name: r.name,
      quantity: r.quantity,
      unitId: r.unit_id,
      unitPrice: r.unit_price,
      distributorId: r.distributor_id ?? undefined,
      brand: r.brand ?? undefined,
      categoryId: r.category_id ?? undefined,
      minStock: r.min_stock ?? undefined,
      imageUrl: r.image_url ?? undefined,
      createdAt: r.created_at,
    };
  }

  protected toCreateInput(data: IngredientCreate): Record<string, unknown> {
    return {
      name: data.name,
      quantity: data.quantity,
      unit_id: data.unitId,
      unit_price: data.unitPrice,
      distributor_id: data.distributorId || null,
      brand: data.brand || null,
      category_id: data.categoryId || null,
      min_stock: data.minStock ?? null,
    };
  }

  async update(id: string, data: IngredientCreate): Promise<ApiResponse<Ingredient>> {
    const { error } = await supabase
      .from(this.tableName)
      .update(this.toCreateInput(data))
      .eq('id', id);

    if (error) return { isSuccess: false, data: null, error: error.message };
    return this.getById(id);
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    const { error: relError } = await supabase.from('recipes_ingredients').delete().eq('ingredient_id', id);
    if (relError) return { isSuccess: false, data: null, error: relError.message };

    const { error: invError } = await supabase.from('inventory_movements').delete().eq('ingredient_id', id);
    if (invError) return { isSuccess: false, data: null, error: invError.message };

    return super.delete(id);
  }
}

export const ingredientRepository = new IngredientRepository();
