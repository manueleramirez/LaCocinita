import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/modules/Auth/store/authSlice';
import configSlice from '@/modules/Config/store/configSlice';
import supplierSlice from '@/modules/Supplier/store/supplierSlice';
import ingredientSlice from '@/modules/Ingredient/store/ingredientSlice';
import recipeSlice from '@/modules/Recipe/store/recipeSlice';
import orderSlice from '@/modules/Order/store/orderSlice';
import unitsSlice from '@/shared/store/unitsSlice';

export const store = configureStore({
  reducer: {
    user: authSlice,
    config: configSlice,
    supplier: supplierSlice,
    ingredient: ingredientSlice,
    recipes: recipeSlice,
    order: orderSlice,
    units: unitsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
