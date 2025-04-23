export const recipeListAdapter = (data) =>{ 
    const ingredients = data.recipes_ingredients
    delete data.recipes_ingredients
    return {...data,ingredients}

}