import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order, DataSliceState } from '@/types';
import { createInitialState } from '@/types';

const initialState: DataSliceState<Order> = createInitialState();

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addItem: (state, action: PayloadAction<Order>) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action: PayloadAction<Order>) => {
      const index = state.items.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    selectItem: (state, action: PayloadAction<Order | null>) => {
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
} = orderSlice.actions;
export default orderSlice.reducer;
