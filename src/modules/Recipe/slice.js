import { createSlice } from '@reduxjs/toolkit';


const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: null,
    selected: null,
    isEditing:false,
  },
  reducers: {
    setRecipes: (state,{payload}) =>{
      state.recipes = payload
    },
    selectRecipe: (state, {payload}) => {
      if(payload){
        state.selected = payload;
      }else{
        state.selected = null;
      }
    },
    setIsEditing: (state,{payload})=>{
      state.isEditing = payload
    }
  },
});

export const {selectRecipe,setIsEditing,setRecipes} = recipesSlice.actions;
export default recipesSlice.reducer;