import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from "uuid";
const Ingredient = [
  {
    id:uuidv4(),
    "name": "Harina de trigo",
    "quantity": 5,
    "unitId": "kg",
    "price": 250.00,
    "distributorId": "001",
    "brand": "Molinos del Sol"
  },
  {
    id:uuidv4(),
    "name": "Azúcar crema",
    "quantity": 3,
    "unitId": "kg",
    "price": 180.00,
    "distributorId": "002",
    "brand": "Central Romana"
  },
  {
    id:uuidv4(),
    "name": "Mantequilla sin sal",
    "quantity": 1,
    "unitId": "lb",
    "price": 120.00,
    "distributorId": "003",
    "brand": "La Dominicana"
  },
  {
    id:uuidv4(),
    "name": "Leche evaporada",
    "quantity": 12,
    "unitId": "oz",
    "price": 85.00,
    "distributorId": "004",
    "brand": "Carnation"
  },
  {
    id:uuidv4(),
    "name": "Chocolate en polvo",
    "quantity": 500,
    "unitId": "g",
    "price": 350.00,
    "distributorId": "005",
    "brand": "Rizek Cacao"
  },
  {
    id:uuidv4(),
    "name": "Vainilla líquida",
    "quantity": 250,
    "unitId": "ml",
    "price": 95.00,
    "distributorId": "006",
    "brand": "Induveca"
  }
];

const IngredientSlice = createSlice({
  name: 'Ingredient',
  initialState: {
    Ingredient: Ingredient,
    selected: null,
    isEditing:false,
  },
  reducers: {
    addIngredient: (state, {payload}) => {
      console.log(payload)
      state.Ingredient.push({id:uuidv4(),...payload});
    },
    deleteIngredient: (state, {payload}) => {
      state.Ingredient = state.Ingredient.filter((Ingredient) => Ingredient.id !== payload);
    },
    updateIngredient: (state, {payload}) => {
      const { id, Brand,
        distributorId,
        name,
        price,
        quantity,
        unitId} = payload;
      const IngredientIndex = state.Ingredient.findIndex((Ingredient) => Ingredient.id === id);
      if (IngredientIndex !== -1) {
        state.Ingredient[IngredientIndex] = { id, Brand,
          distributorId,
          name,
          price,
          quantity,
          unitId};
      }
      state.isEditing = false;
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

export const {addIngredient, deleteIngredient, updateIngredient,selectIngredient} = IngredientSlice.actions;
export default IngredientSlice.reducer;