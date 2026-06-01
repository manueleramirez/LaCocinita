import type { BaseEntity, TimestampedEntity, OrderStatus, PaymentMethod, CategoryType, InventoryMovementType, RecurringInterval, ThemeMode } from './common';

export interface Supplier extends TimestampedEntity {
  name: string;
  address?: string;
  phone?: string;
}

export interface SupplierCreate {
  name: string;
  address?: string;
  phone?: string;
}

export interface Category extends BaseEntity {
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export interface Ingredient extends BaseEntity {
  name: string;
  quantity: number;
  unitId: string;
  unitPrice: number;
  distributorId?: string;
  brand?: string;
  categoryId?: string;
  minStock?: number;
  imageUrl?: string;
}

export interface IngredientCreate {
  name: string;
  quantity: number;
  unitId: string;
  unitPrice: number;
  distributorId?: string;
  brand?: string;
  categoryId?: string;
  minStock?: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName?: string;
  quantity: number;
  unitId: string;
  cost: number;
}

export interface Recipe extends BaseEntity {
  name: string;
  description?: string;
  instructions?: string;
  preparationTime: number;
  portionsPerRecipe: number;
  categoryId?: string;
  imageUrl?: string;
  currentVersion: number;

  totalIngredientsCost: number;
  indirectSpends: number;
  personalSpends: number;
  prepareCost: number;
  revenueMargin: number;
  recommendedSalesPrice: number;
  recommendedSalesPricePerPortion: number;

  ingredients: RecipeIngredient[];
}

export interface RecipeCreate {
  name: string;
  description?: string;
  instructions?: string;
  preparationTime: number;
  portionsPerRecipe: number;
  categoryId?: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeVersion {
  id: string;
  recipeId: string;
  version: number;
  name: string;
  description?: string;
  instructions?: string;
  preparationTime?: number;
  portionsPerRecipe?: number;
  ingredients: RecipeIngredient[];
  totalIngredientsCost?: number;
  personalSpends?: number;
  indirectSpends?: number;
  prepareCost?: number;
  recommendedSalesPrice?: number;
  changeNotes?: string;
  createdAt: string;
}

export interface Menu extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  recipes: MenuRecipe[];
  totalPrice: number;
}

export interface MenuRecipe {
  recipeId: string;
  recipeName?: string;
  portionAdjustment?: number;
}

export interface Customer extends BaseEntity {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
}

export interface OrderItem {
  recipeId?: string;
  menuId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order extends BaseEntity {
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  orderDate: string;
}

export interface OrderCreate {
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  orderDate: string;
}

export interface InventoryMovement extends BaseEntity {
  ingredientId: string;
  type: InventoryMovementType;
  quantity: number;
  unitPrice?: number;
  reference?: string;
  notes?: string;
}

export interface Expense extends BaseEntity {
  description: string;
  amount: number;
  categoryId?: string;
  expenseDate: string;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval;
  notes?: string;
}

export interface BusinessConfig extends TimestampedEntity {
  workHourlyRate: number;
  profitMargin: number;
  spendMargin: number;
  currency: string;
  taxRate: number;

  theme: ThemeMode;
  primaryColor: string;
  language: string;
}
