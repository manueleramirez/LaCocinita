import * as Yup from "yup";  
  
  export const ingredientsSchema = Yup.object({
    id: Yup.string(),
    ingredientId: Yup.string(),
    quantity: Yup.number(),
    cost: Yup.number(),
  });

  export const recipeSchema = Yup.object({
    preparationTime: Yup.number().min(1, "El valor debe ser mayor a 0").required("requerido"),
    portionPerRecipe: Yup.number().min(1, "El valor debe ser mayor a 0").required("Requerido"),
    description: Yup.string().required("Requerido"),
    instructions: Yup.string().required("Requerido"),
    name: Yup.string().required("Requerido"),
  });