import { ErrorMessage, Field, Form, Formik } from "formik";
import { IoList } from "react-icons/io5";
import { useSelector } from "react-redux";
import Required from "../../components/Required";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { calculateCostIngredient, calculatePrice } from "./utils";
import { ingredientsSchema, recipeSchema } from "./Validation";

const RecipeForm = ({add,edit, remove,recipes }) => {
  const { selected, isEditing } = recipes;
  const handleSubmit = (values, { resetForm }) => {
    if (isEditing) {
      edit(values);
    } else {
      add(values);
    }
    resetForm();
  };

  const handleDelete = (ingredients, setFieldValue, id) => {
    const newList = ingredients.filter((i) => i.id != id);
    setFieldValue("ingredients", newList);
  };
  console.log(selected)

  return (
    <div className="w-full max-w-2xl mx-auto p-4 lg:p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl lg:text-2xl font-bold mb-6 text-center lg:text-left">
        {isEditing ? "Editar Receta" : "Agregar Receta"}
      </h1>
      <Formik
        initialValues={
          selected || {
            name: "",
            description: "",
            instructions: "",
            preparationTime: 0,
            portionPerRecipe: 0,
            totalIngredientsCost: 0,
            indirectSpends: 0,
            personalSpends: 0,
            prepareCost: 0,
            revenueMargin: 0,
            recommendedSalesPrice: 0,
            recommendedSalesPricePerPortion: 0,
            ingredients: [],
          }
        }
        enableReinitialize={true}
        validationSchema={recipeSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block font-medium text-sm lg:text-base">
                <Required />
                Nombre
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block font-medium text-sm lg:text-base">
                <Required />
                Descripción
              </label>
              <Field name="description">
                {({ field }) => (
                  <textarea
                    {...field}
                    id="description"
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                    placeholder="Describe tu receta"
                  />
                )}
              </Field>
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Instrucciones */}
            <div>
              <label htmlFor="instructions" className="block font-medium text-sm lg:text-base">
                <Required />
                Instrucciones
              </label>
              <Field name="instructions">
                {({ field }) => (
                  <textarea
                    {...field}
                    id="instructions"
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                    placeholder="Coloca los pasos de tu receta"
                  />
                )}
              </Field>
              <ErrorMessage
                name="instructions"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Campos numéricos en grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Tiempo de preparación */}
              <div>
                <label htmlFor="preparationTime" className="block font-medium text-sm lg:text-base">
                  <Required />
                  Tiempo de preparación (Horas)
                </label>
                <Field
                  type="number"
                  id="preparationTime"
                  name="preparationTime"
                  placeholder="0"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  onFocus={(e) => {
                    e.target.value == 0 && setFieldValue("preparationTime", "");
                  }}
                  onBlur={(e) => {
                    e.target.value == "" && setFieldValue("preparationTime", 0);
                  }}
                />
                <ErrorMessage
                  name="preparationTime"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Porciones */}
              <div>
                <label htmlFor="portionPerRecipe" className="block font-medium text-sm lg:text-base">
                  <Required />
                  Porciones
                </label>
                <Field
                  type="number"
                  id="portionPerRecipe"
                  name="portionPerRecipe"
                  placeholder="0"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  onFocus={(e) => {
                    e.target.value == 0 && setFieldValue("portionPerRecipe", "");
                  }}
                  onBlur={(e) => {
                    e.target.value == "" && setFieldValue("portionPerRecipe", 0);
                  }}
                />
                <ErrorMessage
                  name="portionPerRecipe"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Formulario de ingredientes */}
            <AddIngredientForm handleAdd={setFieldValue} values={values} />
            
            {/* Lista de ingredientes */}
            <IngredientsList
              ingredients={values.ingredients}
              handleDelete={(id) =>
                handleDelete(values.ingredients, setFieldValue, id)
              }
            />

            {/* Campos calculados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="totalIngredientsCost" className="block font-medium text-sm lg:text-base">
                  Costo de ingredientes
                </label>
                <Field
                  type="text"
                  id="totalIngredientsCost"
                  name="totalIngredientsCost"
                  disabled={true}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="indirectSpends" className="block font-medium text-sm lg:text-base">
                  Gastos Indirectos
                </label>
                <Field
                  type="text"
                  id="indirectSpends"
                  name="indirectSpends"
                  disabled={true}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="prepareCost" className="block font-medium text-sm lg:text-base">
                  Coste de Preparación
                </label>
                <Field
                  type="text"
                  id="prepareCost"
                  name="prepareCost"
                  disabled={true}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="personalSpends" className="block font-medium text-sm lg:text-base">
                  Gasto de Personal
                </label>
                <Field
                  type="text"
                  id="personalSpends"
                  name="personalSpends"
                  disabled={true}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="revenueMargin" className="block font-medium text-sm lg:text-base">
                  Margen de Ganancia
                </label>
                <Field
                  type="text"
                  id="revenueMargin"
                  name="revenueMargin"
                  disabled={true}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="recommendedSalesPrice" className="block font-medium text-sm lg:text-base">
                  Precio Recomendado de Venta
                </label>
                <Field
                  type="text"
                  id="recommendedSalesPrice"
                  name="recommendedSalesPrice"
                  disabled={true}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
                />
              </div>
            </div>

            {/* Precio por porción */}
            <div>
              <label htmlFor="recommendedSalesPricePerPortion" className="block font-medium text-sm lg:text-base">
                Precio Recomendado de Venta Por Porción
              </label>
              <Field
                type="text"
                id="recommendedSalesPricePerPortion"
                name="recommendedSalesPricePerPortion"
                disabled={true}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-purple-500 text-white py-2 lg:py-3 px-4 rounded-md hover:bg-purple-600 transition-colors text-sm lg:text-base font-medium"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(selected?.id)}
                    className="flex-1 bg-red-500 text-white py-2 lg:py-3 px-4 rounded-md hover:bg-red-600 transition-colors text-sm lg:text-base font-medium"
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-500 text-white py-2 lg:py-3 px-4 rounded-md hover:bg-purple-600 transition-colors text-sm lg:text-base font-medium"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const IngredientsList = ({ ingredients = [], handleDelete }) => {
  const Ingredient = useSelector((state) => state.Ingredient.Ingredient);
  const units = useSelector((state) => state.units.units);
  return (
    <div className="border-2 border-purple-200 p-4 rounded-lg bg-purple-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-700">
          Listado de Ingredientes
        </h3>
      </div>
      <hr className="h-px my-2 bg-purple-300 border-0" />
      {ingredients.length > 0 ? (
        <div className="space-y-3">
          {ingredients.map((item) => (
            <div
              key={item.id}
              className="border border-purple-200 rounded-lg bg-white overflow-hidden"
            >
              <div className="bg-purple-500 p-3 flex justify-between items-center">
                <p className="font-semibold text-white text-sm lg:text-base truncate">
                  {Ingredient.find((u) => u.id == item.ingredientId)?.name || 'Ingrediente no encontrado'}
                </p>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="text-white font-bold hover:bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="px-4 py-3 text-sm lg:text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="font-semibold text-slate-700">
                    Cantidad: <span className="text-purple-600">{item.quantity} {units.find((u) => u.code == item.unitId)?.code || 'unidad'}</span>
                  </p>
                  <p className="font-semibold text-slate-700">
                    Costo: <span className="text-purple-600">${item.cost?.toLocaleString('es-DO')} pesos</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center p-8">
          <IoList className="text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500 text-center font-medium text-sm lg:text-base">
            No se ha agregado ningún ingrediente
          </p>
        </div>
      )}
    </div>
  );
};

const AddIngredientForm = ({ handleAdd, values: formValues }) => {
  const Ingredient = useSelector((state) => state.Ingredient.Ingredient);
  const units = useSelector((state) => state.units.units);
  const config = useSelector((state) => state.config);

  // Function to get available units for conversion based on selected ingredient
  // This ensures only units that can be converted from the ingredient's base unit are shown
  const getAvailableUnits = (ingredientId) => {
    if (!ingredientId) return units;
    
    const selectedIngredient = Ingredient.find(ing => ing.id === ingredientId);
    if (!selectedIngredient) return units;
    
    const ingredientUnit = units.find(unit => unit.code === selectedIngredient.unitId);
    if (!ingredientUnit) return units;
    
    // Get units that can be converted from the ingredient's unit
    const availableUnits = [ingredientUnit]; // Include the ingredient's own unit
    
    // Add units that have conversion factors from the ingredient's unit
    ingredientUnit.conversions.forEach(conversion => {
      const convertedUnit = units.find(unit => unit.code === conversion.code);
      if (convertedUnit) {
        availableUnits.push(convertedUnit);
      }
    });
    
    return availableUnits;
  };

  useEffect(() => {
    if (formValues.ingredients.length > 0) {
      const totalCost = formValues.ingredients.reduce(
        (result, item) => result + item.cost,
        0
      );
      const data = calculatePrice(
        totalCost,
        formValues.preparationTime,
        config.WorkHourlyRate,
        formValues.portionPerRecipe
      );
      handleAdd("totalIngredientsCost", Math.round(totalCost));
      handleAdd("indirectSpends", Math.round(data.indirectSpends));
      handleAdd("personalSpends", Math.round(data.personalSpend));
      handleAdd("prepareCost", Math.round(data.preparationCost));
      handleAdd("revenueMargin", Math.round(data.profitMargin));
      handleAdd(
        "recommendedSalesPrice",
        Math.round(data.recommendedSalesPrice)
      );
      handleAdd(
        "recommendedSalesPricePerPortion",
        Math.round(data.recommendedSalesPricePerPortion)
      );
    } else {
      handleAdd("totalIngredientsCost", 0);
      handleAdd("indirectSpends", 0);
      handleAdd("personalSpends", 0);
      handleAdd("prepareCost", 0);
      handleAdd("revenueMargin", 0);
      handleAdd("recommendedSalesPrice", 0);
      handleAdd("recommendedSalesPricePerPortion", 0);
    }
  }, [formValues.ingredients]);

  return (
    <div className="border-2 border-blue-200 p-4 rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold text-blue-700 mb-4">
        Agregar Ingrediente
      </h3>
      <Formik
        initialValues={{
          id: uuidv4(),
          ingredientId: "",
          unitId: "",
          quantity: "",
          cost: "",
        }}
        enableReinitialize={true}
        validationSchema={ingredientsSchema}
        onSubmit={(values, { resetForm }) => {
          const newList = [values, ...formValues.ingredients];
          handleAdd("ingredients", newList);
          resetForm();
        }}
      >
        {({
          isSubmitting,
          handleSubmit,
          setFieldValue,
          values,
          setFieldError,
        }) => (
          <div className="space-y-4">
            {/* Ingrediente */}
            <div>
              <label htmlFor="ingredientId" className="block font-medium text-sm lg:text-base text-blue-700">
                Ingrediente
              </label>
              <Field
                as="select"
                id="ingredientId"
                name="ingredientId"
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  setFieldValue("ingredientId", e.target.value);
                  setFieldValue("unitId", ""); // Clear unit selection when ingredient changes
                  setFieldValue("quantity", ""); // Clear quantity when ingredient changes
                  setFieldValue("cost", ""); // Clear cost when ingredient changes
                }}
              >
                <option value="" label="Selecciona un ingrediente" />
                {Ingredient.length > 0
                  ? Ingredient?.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}
                      </option>
                    ))
                  : null}
              </Field>
              <ErrorMessage
                name="ingredientId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Grid para unidad y cantidad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unidad */}
              <div>
                <label htmlFor="unitId" className="block font-medium text-sm lg:text-base text-blue-700">
                  Unidad
                </label>
                <Field
                  as="select"
                  id="unitId"
                  name="unitId"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" label="Selecciona la unidad" />
                  {values.ingredientId ? (
                    getAvailableUnits(values.ingredientId).map((unit) => (
                      <option key={unit.code} value={unit.code}>
                        {unit.pluralName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Primero selecciona un ingrediente
                    </option>
                  )}
                </Field>
                {values.ingredientId && (
                  <p className="text-xs text-blue-600 mt-1">
                    Unidades disponibles para conversión: {getAvailableUnits(values.ingredientId).length}
                  </p>
                )}
                <ErrorMessage
                  name="unitId"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Cantidad */}
              <div>
                <label htmlFor="quantity" className="block font-medium text-sm lg:text-base text-blue-700">
                  Cantidad
                </label>
                <Field
                  type="number"
                  id="quantity"
                  name="quantity"
                  placeholder="0"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    setFieldValue("quantity", e.target.value);
                    try {
                      setFieldValue(
                        "cost",
                        calculateCostIngredient(
                          values.ingredientId,
                          values.unitId,
                          e.target.value,
                          Ingredient,
                          units
                        )
                      );
                      setFieldError("quantity", "test");
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                />
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Costo */}
            <div>
              <label htmlFor="cost" className="block font-medium text-sm lg:text-base text-blue-700">
                Costo
              </label>
              <Field
                type="text"
                id="cost"
                name="cost"
                placeholder="0"
                disabled={true}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border rounded-md text-sm lg:text-base bg-gray-100"
              />
              <ErrorMessage
                name="cost"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Botón agregar */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 lg:py-3 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm lg:text-base font-medium"
            >
              {isSubmitting ? "Agregando..." : "Agregar Ingrediente"}
            </button>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default RecipeForm;
