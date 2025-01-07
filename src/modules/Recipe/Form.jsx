import { ErrorMessage, Field, Form, Formik } from "formik";
import { IoList } from "react-icons/io5";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import Required from "../../components/Required";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { calculateCostIngredient, calculatePrice } from "./utils";

const RecipeForm = ({ remove }) => {
  const { recipes } = useSelector((state) => state);
  const { selected, isEditing } = recipes;
  

  const validationSchema = Yup.object({
    preparationTime: Yup.number().min(1,'Requerido').required('requerido'),
    portionPerRecipe: Yup.number().min(1,'Requerido').required("Requerido"),
    description: Yup.string().required("Requerido"),
    instructions: Yup.string().required("Requerido"),
    name: Yup.string().required("Requerido"),
  });

  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleDelete = (ingredients,setFieldValue,id) => {
      const newList = ingredients.filter(i => i.id != id );
      setFieldValue('ingredients',newList)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Agregar Receta</h1>
      <Formik
        initialValues={
          selected || {
            name: "",
            description: "",
            instructions: "",
            phone: "",
            preparationTime: 0,
            portionPerRecipe: 0,
            totalIngredientsCost: 0,
            indirectSpends:0,
            personalSpends:0,
            prepareCost:0,
            revenueMargin:0,
            recommendedSalesPrice: 0,
            recommendedSalesPricePerPortion: 0,
            ingredients: []
          }
        }
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting,setFieldValue,values}) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">
                <Required />
                Nombre
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block font-medium">
                <Required />
                Descripción
              </label>
              <Field
                type="textarea"
                id="instructions"
                render={
                  ()=><textarea className="py-3 px-4  border rounded-md block w-full border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" rows="3" placeholder="Coloca los pasos de tu receta"></textarea>
                }
                name="instructions"
                className="w-full px-4 border rounded-md"
              />
              <ErrorMessage
                name="instructions"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block font-medium">
                <Required />
                Instrucciones
              </label>
              <Field
                type="textarea"
                id="instructions"
                render={
                  ()=><textarea className="py-3 px-4  border rounded-md block w-full border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" rows="3" placeholder="Coloca los pasos de tu receta"></textarea>
                }
                name="instructions"
                className="w-full px-4 border rounded-md"
              />
              <ErrorMessage
                name="instructions"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="preparationTime" className="block font-medium">
                <Required />
                Tiempo de preparación (Horas)
              </label>
              <Field
                type="text"
                id="preparationTime"
                name="preparationTime"
                placeholder='0'
                className="w-full px-4 py-2 border rounded-md"
                onFocus={e=>{
                  e.target.value == 0 && setFieldValue("preparationTime",'')
                }}
                onBlur={e=>{
                  e.target.value == '' && setFieldValue("preparationTime",0)
                }}
              />
              <ErrorMessage
                name="preparationTime"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="portionPerRecipe" className="block font-medium">
                <Required />
                Porciones
              </label>
              <Field
                type="text"
                id="portionPerRecipe"
                name="portionPerRecipe"
                placeholder='0'
                className="w-full px-4 py-2 border rounded-md"
                onFocus={e=>{
                  e.target.value == 0 && setFieldValue("portionPerRecipe",'')
                }}
                onBlur={e=>{
                  e.target.value == '' && setFieldValue("portionPerRecipe",0)
                }}
              />
              <ErrorMessage
                name="portionPerRecipe"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <AddIngredientForm handleAdd={setFieldValue} values={values}/>
            <IngredientsList ingredients={values.ingredients} handleDelete={(id)=>handleDelete(values.ingredients,setFieldValue,id)}/>
            <div>
              <label htmlFor="totalIngredientsCost" className="block font-medium">
                Costo de ingredientes
              </label>
              <Field
                type="text"
                id="totalIngredientsCost"
                name="totalIngredientsCost"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="totalIngredientsCost"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="indirectSpends" className="block font-medium">
              Gastos Indirectos
              </label>
              <Field
                type="text"
                id="indirectSpends"
                name="indirectSpends"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="indirectSpends"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="prepareCost" className="block font-medium">
              coste De Preparación
              </label>
              <Field
                type="text"
                id="prepareCost"
                name="prepareCost"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="prepareCost"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="personalSpends" className="block font-medium">
              Gasto de Personal
              </label>
              <Field
                type="text"
                id="personalSpends"
                name="personalSpends"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="personalSpends"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="revenueMargin" className="block font-medium">
              Margen de Ganancia
              </label>
              <Field
                type="text"
                id="revenueMargin"
                name="revenueMargin"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="revenueMargin"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="recommendedSalesPrice" className="block font-medium">
              precio Recomendado De Venta
              </label>
              <Field
                type="text"
                id="recommendedSalesPrice"
                name="recommendedSalesPrice"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="recommendedSalesPrice"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="recommendedSalesPricePerPortion" className="block font-medium">
              precio Recomendado De Venta Por Porción
              </label>
              <Field
                type="text"
                id="recommendedSalesPricePerPortion"
                name="recommendedSalesPricePerPortion"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="recommendedSalesPricePerPortion"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
                >
                  {isSubmitting ? "Enviando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(selected?.id)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
              >
                {isSubmitting ? "Enviando..." : "Guardar"}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

const IngredientsList = ({ ingredients = [],handleDelete }) => {
  const Ingredient = useSelector(state => state.Ingredient.Ingredient)
  const units = useSelector(state => state.units.units)
  return (
    <div className="border-2 p-4 rounded-lg max-h-30">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-purple-500">
          listado de Ingredientes
        </h3>
      </div>
      <hr className="h-px my-2 bg-purple-800 border-0 " />
      {ingredients.length > 0 ? ingredients.map( item =>
        (<div key={item.id} className="border-2  rounded-lg flex flex-col justify-between items-center">
        <div className="bg-green-500 p-4 w-full flex justify-between">
          <p className="font-semibold text-white">{Ingredient.find(u => u.id == item.ingredientId).name}</p>
          <button onClick={()=>handleDelete(item.id)}><span  className="text-white font-bold">X</span></button>
        </div>
        <div className="px-6 text-start w-full">
          <p className="font-semibold">Cantidad: {item.quantity} {units.find(u => u.code == item.unitId).code}</p>
          <p className="font-semibold">Costo: ${item.cost} pesos</p>
        </div>
        </div>)
      ) : (
                <div className="flex flex-col justify-center items-center p-12">
                  <IoList className="text-4xl text-gray-400" />
                  <p className="text-lg text-gray-400 text-center font-semibold ">
                    No se a agregado ningún ingrediente
                  </p>
                </div>
              )}
     
    </div>
  );
};

const AddIngredientForm = ({handleAdd,values:formValues}) =>{
  const Ingredient = useSelector(state => state.Ingredient.Ingredient)
  const units = useSelector(state => state.units.units)
  const config = useSelector(state => state.config)
  const ingredientsSchema = Yup.object({
      id: Yup.string(),
      ingredientId: Yup.string(),
      quantity: Yup.number(),
      cost: Yup.number(),
    })

    useEffect(()=>{

      if(formValues.ingredients.length > 0)
        { 
      const totalCost = formValues.ingredients.reduce((result,item)=>result + item.cost,0)
      const data = calculatePrice(totalCost,formValues.preparationTime,config.WorkHourlyRate,formValues.portionPerRecipe)
      handleAdd('totalIngredientsCost',Math.round(totalCost));
      handleAdd('indirectSpends',Math.round(data.indirectSpends));
      handleAdd('personalSpends',Math.round(data.personalSpend));
      handleAdd('prepareCost',Math.round(data.preparationCost));
      handleAdd('revenueMargin',Math.round(data.profitMargin));
      handleAdd('recommendedSalesPrice',Math.round(data.recommendedSalesPrice));
      handleAdd('recommendedSalesPricePerPortion',Math.round(data.recommendedSalesPricePerPortion));
    }
      else{
        handleAdd('totalIngredientsCost',0);
        handleAdd('indirectSpends',0);
        handleAdd('personalSpends', 0);
        handleAdd('prepareCost',0);
        handleAdd('revenueMargin',0);
        handleAdd('recommendedSalesPrice',0);
        handleAdd('recommendedSalesPricePerPortion',0);
      }
      
    },[formValues.ingredients])



  return(<div className="border-2 p-4 rounded-lg max-h-30">
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
        onSubmit={(values)=>{
          const newList = [values,...formValues.ingredients]
          handleAdd('ingredients',newList)
          
        }}
        
      >
        {({ isSubmitting,handleSubmit,setFieldValue,values,setFieldError }) => (

        <>
            <div>
              <label htmlFor="ingredientId" className="block font-medium">Ingrediente</label>
              <Field
                as="select"
                id="ingredientId"
                name="ingredientId"
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" label="Selecciona un ingrediente" />
                {Ingredient.length > 0 ? Ingredient?.map((ingredient) => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </option>
                )) : null }
              </Field>
              <ErrorMessage
                name="ingredientId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="unitId" className="block font-medium">unidad</label>
              <Field
                as="select"
                id="unitId"
                name="unitId"
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" label="Selecciona la unidad" />
                {units.length > 0 ? units?.map((unit) => (
                  <option key={unit.code} value={unit.code}>
                    {unit.pluralName}
                  </option>
                )) : null }
              </Field>
              <ErrorMessage
                name="unitId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block font-medium">Cantidad</label>
              <Field
                type="text"
                id="quantity"
                name="quantity"
                placeholder="0"
                className="w-full px-4 py-2 border rounded-md"
                onChange={(e)=>{
                  setFieldValue('quantity',e.target.value);
                  try {
                   setFieldValue('cost',calculateCostIngredient(values.ingredientId,values.unitId,e.target.value,Ingredient,units));
                   setFieldError('quantity','test')
                    
                  } catch (error) {
                    console.log(error)
                  }

                }}
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="cost" className="block font-medium">Costo</label>
              <Field
                type="text"
                id="cost"
                name="cost"
                placeholder="0"
                disabled={true}
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="cost"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>


            

              <button
                type="button"
                onClick={handleSubmit}
                disabled={formValues.portionPerRecipe == 0  || formValues.preparationTime == 0 }
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
              >
                {isSubmitting ? "Enviando..." : "Agregar"}
              </button>
          </>
        )}
      </Formik>
  </div>)
}

export default RecipeForm;
