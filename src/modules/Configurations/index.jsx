import { ErrorMessage, Field, Form, Formik } from 'formik';
import configSchema from './validation';
import NumericField from '../../components/NumericField';

export default function Config() {
    const handleSubmit = (values) => {
      console.log(values)
    }

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-white shadow-md rounded-lg">
    <h1 className="text-xl font-bold mb-4">Configuración</h1>
    <Formik
      initialValues= {{
        workHourlyRate: 0,
        profitMargin: 0,
        spendMargin: 0
      } }
      enableReinitialize={true}
      validationSchema={configSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting,setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor='workHourlyRate' className="block font-medium">
              Precio de trabajo por hora
            </label>
            <NumericField id={'workHourlyRate'} setFieldValue={setFieldValue}/>
            <ErrorMessage
              name='workHourlyRate'
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="profitMargin" className="block font-medium">
              margen de ganancia
            </label>
            <NumericField id={'profitMargin'} setFieldValue={setFieldValue}/>
            <ErrorMessage
              name="profitMargin"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="spendMargin" className="block font-medium">
              Margen de gastos
            </label>
            <NumericField id={'spendMargin'} setFieldValue={setFieldValue}/>
            <ErrorMessage
              name="spendMargin"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
         
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          
        </Form>
      )}
    </Formik>
  </div>
);
}
