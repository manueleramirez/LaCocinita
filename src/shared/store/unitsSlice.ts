import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Unit {
  id: string;
  label: string;
  category: 'weight' | 'volume' | 'unit';
}

interface UnitsState {
  units: Unit[];
  transformedValue: number | null;
}

const initialState: UnitsState = {
  units: [
    { id: 'kg', label: 'Kilogramo (kg)', category: 'weight' },
    { id: 'g', label: 'Gramo (g)', category: 'weight' },
    { id: 'lb', label: 'Libra (lb)', category: 'weight' },
    { id: 'oz', label: 'Onza (oz)', category: 'weight' },
    { id: 'l', label: 'Litro (l)', category: 'volume' },
    { id: 'ml', label: 'Mililitro (ml)', category: 'volume' },
    { id: 'un', label: 'Unidad', category: 'unit' },
    { id: 'doc', label: 'Docena', category: 'unit' },
    { id: 'paq', label: 'Paquete', category: 'unit' },
  ],
  transformedValue: null,
};

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    transform: (state, action: PayloadAction<{ value: number; from: string; to: string }>) => {
      const conversions: Record<string, Record<string, number>> = {
        kg: { g: 1000, lb: 2.20462, oz: 35.274 },
        g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
        lb: { kg: 0.453592, g: 453.592, oz: 16 },
        oz: { kg: 0.0283495, g: 28.3495, lb: 0.0625 },
        l: { ml: 1000 },
        ml: { l: 0.001 },
      };

      if (action.payload.from === action.payload.to) {
        state.transformedValue = action.payload.value;
        return;
      }

      const factor = conversions[action.payload.from]?.[action.payload.to];
      if (factor) {
        state.transformedValue = action.payload.value * factor;
      } else {
        state.transformedValue = null;
      }
    },
    resetTransform: (state) => {
      state.transformedValue = null;
    },
  },
});

export const { transform, resetTransform } = unitsSlice.actions;
export default unitsSlice.reducer;
