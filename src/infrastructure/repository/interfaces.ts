import type { ApiResponse } from '@/types';

export interface IRepository<T, TCreate, TUpdate = TCreate> {
  getAll(userId: string): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  create(data: TCreate): Promise<ApiResponse<T>>;
  update(id: string, data: TUpdate): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<boolean>>;
}
