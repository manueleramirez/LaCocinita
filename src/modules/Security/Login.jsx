import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
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

  //verificar si el usuario ya está autenticado
useEffect(() => {
  const validateSession = async () => {
    const {isSuccess,data} = await Service.validateSession();
    if (isSuccess) {
      dispatcher(login(userAdapter(data)));
      navigate('/recipes')
    }
  };
  validateSession();
},[])


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 lg:p-8 shadow-lg">
        {/* Logo y título */}
        <div className="flex justify-center items-center gap-3">
          <Logo/>
          <p className="text-primary font-bold text-xl lg:text-2xl italic">LaCocinita</p>
        </div>
        
        <h2 className="text-center text-xl lg:text-2xl font-semibold text-gray-900">
          Que gusto verte de nuevo
        </h2>
        

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
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base"
                  placeholder="tu@email.com"
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
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 lg:py-3 text-sm lg:text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Ingresando...
                    </div>
                  ) : (
                    "Ingresar"
                  )}
                </button>
              </div>

               {errorMessage && (
                  <div className="mt-2 p-3 text-red-500 text-center bg-red-50 rounded-md text-sm">
                    {errorMessage}
                  </div>
                )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignIn;
