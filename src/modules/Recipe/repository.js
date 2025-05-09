import { supabase } from "../../infrastructure/supabaseClient";

export class RecipeRepository {
  async GetRecipes(userId) {
    const { data, error } = await supabase
      .from("recipes")
      .select("*,recipes_ingredients(*,ingredients(name))")
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

  async UpdateRecipe(recipe) {
    const ingredients  = recipe.ingredients;
    delete recipe.ingredients
    const { __, error } = await supabase
      .from("recipes")
      .update(recipe)
      .eq("id", recipe.id);
    if (error) {
      console.error("Error updating recipe:", error);
      return { isSuccess: false, data: error };
    }
  
    const newIngredientObj = ingredients.map( i => {i.recipeId = recipe.id; delete i.name; delete i.unit; return i })

    const {_ , err} =  await supabase
    .from('recipes_ingredients')
    .upsert(newIngredientObj, {conflict: 'id'})
    
    if (err) { 
      return new Error(err.message)
    }

    return { isSuccess: true };
  }

  async DeleteRecipe(recipeId) {
    const {error2} = await supabase
    .from('recipes_ingredients')
    .delete()
    .eq('recipeId', recipeId)

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", recipeId);
    if (error || error2) {
      console.error("Error deleting recipe:", error || error2);
      return { isSuccess: false, data: error || error2 };
    }
    return { isSuccess: true, data: null };
  }
}
