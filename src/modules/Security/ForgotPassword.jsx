import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Logo from "../../components/Logo";
import { UserRepository } from "../../infrastructure/repository/User.Repository";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const Service = new UserRepository();

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email inválido")
      .required("El email es requerido"),
  });

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      const { isSuccess, data } = await Service.resetPassword(values.email);
      if (isSuccess) {
        setIsSubmitted(true);
      } else {
        setErrorMessage("Error al enviar el email de recuperación. Verifica tu email.");
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setErrorMessage("Error al enviar el email de recuperación. Intenta de nuevo.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 lg:p-8 shadow-lg">
          {/* Logo y título */}
          <div className="flex justify-center items-center gap-3">
            <Logo />
            <p className="text-primary font-bold text-xl lg:text-2xl italic">LaCocinita</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
              Email enviado
            </h2>
            
            <p className="text-gray-600 text-sm lg:text-base">
              Hemos enviado un enlace de recuperación a tu email. 
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            
            <Link
              to="/"
              className="inline-block text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 lg:p-8 shadow-lg">
        {/* Logo y título */}
        <div className="flex justify-center items-center gap-3">
          <Logo />
          <p className="text-primary font-bold text-xl lg:text-2xl italic">LaCocinita</p>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
            Recuperar contraseña
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <Formik
          initialValues={{ email: "" }}
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
                      Enviando...
                    </div>
                  ) : (
                    "Enviar email de recuperación"
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 text-red-500 text-center bg-red-50 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Back to login link */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword; 