import * as Yup from "yup";


const supplierSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    address: Yup.string().required("La dirección es requerida"),
    phone: Yup.string()
      .required("El teléfono es requerido")
      .matches(/^\d{3}\d{3}\d{4}$/, "El teléfono debe tener 10 dígitos"),
  });

export default supplierSchema;

