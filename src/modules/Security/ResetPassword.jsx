import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Logo from "../../components/Logo";
import { UserRepository } from "../../infrastructure/repository/User.Repository";

const ResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const Service = new UserRepository();
  const navigate = useNavigate();

  // Verificar si el usuario tiene una sesión válida para resetear contraseña
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { isSuccess } = await Service.validateSession();
        if (!isSuccess) {
          setErrorMessage("Enlace inválido o expirado. Solicita un nuevo enlace de recuperación.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setErrorMessage("Error al verificar la sesión.");
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Definir el esquema de validación con Yup
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es requerida"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required("Confirma tu contraseña"),
  });

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      const { isSuccess, data } = await Service.updatePassword(values.password);
      if (isSuccess) {
        setIsSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setErrorMessage("Error al actualizar la contraseña. Intenta de nuevo.");
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage("Error al actualizar la contraseña. Intenta de nuevo.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 lg:p-8 shadow-lg">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 text-sm lg:text-base">Verificando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
              ¡Contraseña actualizada!
            </h2>
            
            <p className="text-gray-600 text-sm lg:text-base">
              Tu contraseña ha sido actualizada exitosamente. 
              Serás redirigido al inicio de sesión en unos segundos.
            </p>
            
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 lg:p-8 shadow-lg">
          {/* Logo y título */}
          <div className="flex justify-center items-center gap-3">
            <Logo />
            <p className="text-primary font-bold text-xl lg:text-2xl italic">LaCocinita</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
              Error
            </h2>
            
            <p className="text-red-600 text-sm lg:text-base">{errorMessage}</p>
            
            <button
              onClick={() => navigate('/forgot-password')}
              className="inline-block text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Solicitar nuevo enlace
            </button>
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
            Establecer nueva contraseña
          </h2>
          <p className="text-gray-600 text-sm lg:text-base">
            Ingresa tu nueva contraseña.
          </p>
        </div>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nueva contraseña
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmar contraseña
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm lg:text-base"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                      Actualizando...
                    </div>
                  ) : (
                    "Actualizar contraseña"
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 text-red-500 text-center bg-red-50 rounded-md text-sm">
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

export default ResetPassword; 