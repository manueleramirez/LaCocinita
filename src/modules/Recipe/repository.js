import { supabase } from "../../infrastructure/supabaseClient";

export class RecipeRepository {
  async GetRecipes(userId) {
    const { data, error } = await supabase
      .from("recipes")
      .select("*,recipes_ingredients(*)")
      .eq("userId", userId);
    if (error) {
      console.error("Error signing in ingredient:", error);
      return { isSuccess: false, data: error };
    }
    return { isSuccess: true, data: data };
  }

  async CreateRecipe(recipe){
    try {
      const ingredients  = recipe.ingredients;
      delete recipe.ingredients
      const {data,error} = await supabase
      .from('recipes')
      .insert([recipe])
      .select('id')

      if (error) { 
        return new Error(error.message)
      }

      const newRecipeId = data[0].id
  
      const newIngredientObj = ingredients.map( i => {i.recipeId = newRecipeId; return i })
  
    const {_ , err} =  await supabase
      .from('recipes_ingredients')
      .insert(newIngredientObj)
      
      if (err) { 
        return new Error(err.message)
      }
      
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }

  }
}
