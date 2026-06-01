import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@/types';

export interface ConfigState {
  workHourlyRate: number;
  profitMargin: number;
  spendMargin: number;
  currency: string;
  taxRate: number;
  theme: ThemeMode;
  primaryColor: string;
  language: string;
  loading: boolean;
  error: string | null;
}

const initialState: ConfigState = {
  workHourlyRate: 10,
  profitMargin: 30,
  spendMargin: 10,
  currency: 'EUR',
  taxRate: 0,
  theme: 'system',
  primaryColor: '#690375',
  language: 'es',
  loading: false,
  error: null,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<ConfigState>>) => {
      return { ...state, ...action.payload };
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

export const { setConfig, setLoading, setError } = configSlice.actions;
export default configSlice.reducer;
