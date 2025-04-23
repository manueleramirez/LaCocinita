import { createSlice } from '@reduxjs/toolkit';



const IngredientSlice = createSlice({
  name: 'Ingredient',
  initialState: {
    Ingredient: null,
    selected: null,
    isEditing:false,
  },
  reducers: {
    getIngredient: (state, {payload}) => {
       state.Ingredient = payload;
    },
    selectIngredient: (state, {payload}) => {
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

export const {selectIngredient,getIngredient} = IngredientSlice.actions;
export default IngredientSlice.reducer;