import { createSlice } from '@reduxjs/toolkit';



const supplierSlice = createSlice({
  name: 'suppliers',
  initialState: {
    suppliers: [],
    selected: null,
    isEditing:false,
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

export const {selectSupplier,setSuppliers} = supplierSlice.actions;
export default supplierSlice.reducer;