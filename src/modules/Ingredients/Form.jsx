import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import IngredientSchema from "./Validation";



const IngredientForm = ({ add, edit, remove }) => {

  const suppliers = useSelector((state) => state.supplier.suppliers);
  const {selected, isEditing} = useSelector((state) => state.Ingredient);
  const units = useSelector((state) => state.units.units);


  const handleSubmit = (values, { resetForm }) => {
    console.log(values)
    if (isEditing) {
      edit(values);
    } else {
      add(values);
    }
    resetForm();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Agregar producto</h1>

      <Formik
        initialValues={isEditing ? selected : {
          name: "",
          quantity: "",
          unitId: "",
          price: "",
          distributorId: "",
          Brand: "",
        }}
        enableReinitialize={true}
        validationSchema={IngredientSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">Producto</label>
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
              <label htmlFor="quantity" className="block font-medium">Cantidad</label>
              <Field
                type="text"
                id="quantity"
                name="quantity"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="unitId" className="block font-medium">Unidad</label>
              <Field
                as="select"
                id="unitId"
                name="unitId"
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" label="Seleccione una unidad" />
                {units.map((unit) => (
                  <option key={unit.code} value={unit.code}>
                    {unit.pluralName}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="unitId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="price" className="block font-medium">Precio</label>
              <Field
                type="number"
                id="price"
                name="price"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="distributorId" className="block font-medium">Distribuidor</label>
              <Field
                as="select"
                id="distributorId"
                name="distributorId"
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="" label="Selecciona un distribuidor" />
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="distributorId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="Brand" className="block font-medium">Marca (Opcional)</label>
              <Field
                type="text"
                id="Brand"
                name="Brand"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="Brand"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  {isSubmitting ? "Enviando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={()=> remove(selected?.id)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  Delete Supplier
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                {isSubmitting ? "Enviando..." : "Agregar"}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default IngredientForm;
