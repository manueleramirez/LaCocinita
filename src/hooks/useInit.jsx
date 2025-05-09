/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supplierAdapter } from '../adapters/supplier.adapter';
import { SupplierRepository } from '../modules/Supplier/repository';
import { setSuppliers } from '../modules/Supplier/slice';
import { RecipeRepository } from '../modules/Recipe/repository';
import { recipeListAdapter } from '../adapters/recipe.adapter';
import { setRecipes } from '../modules/Recipe/slice';
import { getIngredient } from '../modules/Ingredients/slice';
import { IngredientRepository } from '../modules/Ingredients/repository';

export default function useInit() {
    const user = useSelector((state) => state.user.user);
    const supplierRepository = new SupplierRepository()
    const recipeRepository = new RecipeRepository()
    const ingredientRepository = new IngredientRepository()
    const dispatcher = useDispatch();

    const initData = async() =>{
        ingredientRepository.GetIngredients(user.id).then( ({data}) => dispatcher(getIngredient(data)))
        supplierRepository.GetSupplier(user.id).then(({data}) =>{
            const supplierAdapted = data.map(supplier => supplierAdapter(supplier))
            dispatcher(setSuppliers(supplierAdapted))
          })

        recipeRepository.GetRecipes(user.id).then(({data})=>{
            const recipeAdapted = data.map(recipe => recipeListAdapter(recipe));
            dispatcher(setRecipes(recipeAdapted))
        })


    }

    useEffect(()=>{
        initData()
    },[])

  
}
