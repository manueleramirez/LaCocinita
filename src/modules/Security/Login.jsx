
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { userAdapter } from "../../adapters/user.adapter";
import Logo from "../../components/Logo";
import { UserRepository } from "../../infrastructure/repository/User.Repository";
import { login } from "./slice";

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const Service = new UserRepository();
  const dispatcher = useDispatch();
  const navigate = useNavigate()

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email invalido")
      .required("El email es requerido"),
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es requerida"),
  });

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      const {isSuccess,data} = await Service.signIn(values.email, values.password)
          if (isSuccess) {
            dispatcher(login(userAdapter(data))); 
            navigate('/recipes')
          } else {
            setErrorMessage("Usuario o contraseña incorrectos");
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
    
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
        <div className=" -ml-4 w-full flex justify-center items-center gap-3">
          <Logo/>
          <p className="text-primary font-bold text-2xl italic">LaCocinita</p>
        </div>
        <h2 className="text-center text-2xl font-semibold text-black w-full">Que gusto verte de nuevo</h2>
        

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </button>
              </div>

               {errorMessage && (
                  <div className="mt-2 text-red-500 text-center">{errorMessage}</div>
                )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
