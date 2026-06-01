import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Recipe, DataSliceState } from '@/types';
import { createInitialState } from '@/types';

const initialState: DataSliceState<Recipe> = createInitialState();

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Recipe[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addItem: (state, action: PayloadAction<Recipe>) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action: PayloadAction<Recipe>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    selectItem: (state, action: PayloadAction<Recipe | null>) => {
      state.selected = action.payload;
    },
    clearSelection: (state) => {
      state.selected = null;
      state.isEditing = false;
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setItems, addItem, updateItem, removeItem,
  selectItem, clearSelection, setEditing,
  setLoading, setError,
} = recipeSlice.actions;
export default recipeSlice.reducer;
