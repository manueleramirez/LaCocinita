import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from "uuid";

const recipes = [
    { id: uuidv4(), name: "huevos revueltos", recipe: "123 Main St", preparationTime: 12,ingredients: [ {
        id: 1,
        ingredientId: 1,
        quantity: 20,
        Cost: 0,
      },
      {
        id: 2,
        ingredientId: 2,
        name: "Eggs",
        quantity: 5,
        Cost: 0,
      }] },

  ];

const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: recipes,
    selected: null,
    isEditing:false,
  },
  reducers: {
    addRecipe: (state, {payload}) => {
      state.recipes.push(payload);
    },
    deleteRecipe: (state, {payload}) => {
      state.recipes = state.recipes.filter((supplier) => supplier.id !== payload);
    },
    updateRecipe: (state, {payload}) => {
      const { id, name, address, phone } = payload;
      const recipeIndex = state.recipes.findIndex((supplier) => supplier.id === id);
      if (recipeIndex !== -1) {
        state.recipes[recipeIndex] = { id, name, address, phone };
      }
      state.isEditing = false;
    },
    selectRecipe: (state, {payload}) => {
      if(payload){
        state.selected = payload;
        state.isEditing = true;
      }else{
        state.selected = null;
        state.isEditing = false;
      }
    }
  },
});

export const {addRecipe} = recipesSlice.actions;
export default recipesSlice.reducer;