import { createSlice } from '@reduxjs/toolkit';



const configureSlice = createSlice({
  name: 'config',
  initialState: {
    WorkHourlyRate: 150,
    profitMargin: 0.4,
    spendMargin: 0.2
  },
  reducers: {
    setConfig: (state, {payload}) => {
      return payload;
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