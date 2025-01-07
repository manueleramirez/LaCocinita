import { Formik, Form, Field, ErrorMessage } from "formik";
import supplierSchema from "./Validation";
import { useSelector } from "react-redux";

const SupplierForm = ({ add, edit, remove }) => {
  const {selected, isEditing} = useSelector((state) => state.supplier);
  const handleSubmit = (values, { resetForm }) => {
    if (isEditing) {
      edit(values);
    } else {
      add(values);
    }
    resetForm();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">Agregar suplidor</h1>
      <Formik
        initialValues= {selected ||{
          name: "",
          address: "",
          phone: "",
        } }
        enableReinitialize={true}
        validationSchema={supplierSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium">
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
              <label htmlFor="address" className="block font-medium">
                Dirección
              </label>
              <Field
                type="text"
                id="address"
                name="address"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium">
                Teléfono
              </label>
              <Field
                type="text"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 border rounded-md"
              />
              <ErrorMessage
                name="phone"
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

export default SupplierForm;
