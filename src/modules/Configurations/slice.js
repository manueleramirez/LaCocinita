import { createSlice } from '@reduxjs/toolkit';



const configureSlice = createSlice({
  name: 'config',
  initialState: {
    WorkHourlyRate: 230,
    profitMargin: 0.7,
    spendMargin: 0.15
  },
  reducers: {
    setSuppliers: (state, {payload}) => {
      state.suppliers = payload;
    },
    selectSupplier: (state, {payload}) => {
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

export const {selectSupplier,setSuppliers} = configureSlice.actions;
export default configureSlice.reducer;