import { configureStore } from '@reduxjs/toolkit';
import modalSlice from './Slices/modal.slice';
import unitsSlice from './Slices/units.slice';
import authSlice from '../modules/Security/slice'
import supplierSlice from '../modules/Supplier/slice';
import IngredientSlice from '../modules/Ingredients/slice'
import recipesSlice from '../modules/Recipe/slice'
import configSlice from '../modules/Configurations/slice'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    user:authSlice,
    supplier:supplierSlice,
    Ingredient:IngredientSlice,
    units: unitsSlice,
    recipes: recipesSlice,
    config:configSlice
  },
});