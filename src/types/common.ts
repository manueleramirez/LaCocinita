export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T | null;
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type BaseEntity = {
  id: string;
  createdAt: string;
  userId: string;
};

export type TimestampedEntity = BaseEntity & {
  updatedAt?: string;
};

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';

export type ThemeMode = 'light' | 'dark' | 'system';

export type CategoryType = 'INGREDIENT' | 'RECIPE' | 'EXPENSE';

export type InventoryMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export type RecurringInterval = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type DataSliceState<T> = {
  items: T[];
  selected: T | null;
  isEditing: boolean;
  loading: boolean;
  error: string | null;
};

export function createInitialState<T>(): DataSliceState<T> {
  return {
    items: [],
    selected: null,
    isEditing: false,
    loading: false,
    error: null,
  };
}
