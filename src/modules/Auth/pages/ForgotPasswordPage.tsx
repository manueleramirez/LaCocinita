import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { forgotPassword } from '@/modules/Auth/services';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/modules/Auth/types';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const result = await forgotPassword(values.email);
    if (result.isSuccess) {
      setSent(true);
      toast.success('Revisa tu correo para restablecer la contraseña');
    } else {
      toast.error(result.error ?? 'Error al enviar el correo');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-8">
            <div className="text-[var(--color-success)] text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Correo enviado</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Link to="/">
              <Button variant="primary">Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">LaCocinita</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">Restablecer contraseña</p>
        </div>

        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" loading={isSubmitting} className="w-full">
              Enviar enlace
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-[var(--color-primary)] hover:underline">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
