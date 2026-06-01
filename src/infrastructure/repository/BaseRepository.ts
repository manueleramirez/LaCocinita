import { supabase } from '@/infrastructure/supabase/client';
import type { ApiResponse } from '@/types';

export abstract class BaseRepository<T, TCreate, TUpdate = TCreate> {
  protected abstract tableName: string;
  protected abstract toModel(raw: Record<string, unknown>): T;
  protected abstract toCreateInput(data: TCreate): Record<string, unknown>;

  async getAll(userId: string): Promise<ApiResponse<T[]>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: (data ?? []).map((d) => this.toModel(d as Record<string, unknown>)) };
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: this.toModel(data as Record<string, unknown>) };
  }

  async create(input: TCreate): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(this.toCreateInput(input))
      .select()
      .single();

    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: this.toModel(data as Record<string, unknown>) };
  }

  async update(id: string, input: TUpdate): Promise<ApiResponse<T>> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(input as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single();

    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: this.toModel(data as Record<string, unknown>) };
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) return { isSuccess: false, data: null, error: error.message };
    return { isSuccess: true, data: true };
  }
}
