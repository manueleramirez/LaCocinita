export const recipeListAdapter = (data) =>{
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        instructions: data.instructions,
        preparationTime: data.preparationTime,
        recommendedSalesPrice: data.recommendedSalesPrice,
        recommendedSalesPricePerPortion: data.recommendedSalesPricePerPortion,
        portionPerRecipe: data.portionPerRecipe,
        totalIngredientsCost: data.totalIngredientsCost,
        prepareCost: data.prepareCost,
        revenueMargin: data.revenueMargin,
        indirectSpends: data.indirectSpends,
        ingredients: data.recipes_ingredients.map(ingredient => ({
            id: ingredient.id,
            ingredientId: ingredient.ingredientId,
            name: ingredient.ingredients.name,
            quantity: ingredient.quantity,
            unitId: ingredient.unitId,
            unit: ingredient.unit,
            cost: ingredient.cost,  
        }))
    }

}