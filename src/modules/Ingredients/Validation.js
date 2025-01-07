import * as Yup from "yup";

const IngredientSchema = Yup.object({
  name: Yup.string().required("el nombre del producto es requerido"),
  quantity: Yup.number()
    .required("la cantidad es requerida")
    .positive("la cantidad debe ser mayor a 0"),
  unitId: Yup.string().required("Debe seleccionar una unidad"),
  price: Yup.number()
    .required("El precio es requerido")
    .positive("el precio debe ser mayor a 0"),
  distributorId: Yup.string().required("Debe seleccionar un distribuidor"),
  Brand: Yup.string().nullable(),
});
export default IngredientSchema;

