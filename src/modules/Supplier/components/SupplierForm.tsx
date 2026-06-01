import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierSchema, type SupplierFormValues } from '@/modules/Supplier/validation';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import type { Supplier, SupplierCreate } from '@/types';

interface SupplierFormProps {
  onSubmit: (data: SupplierCreate) => Promise<void>;
  initialValues?: Supplier | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function SupplierForm({ onSubmit, initialValues, isEditing, onCancel }: SupplierFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      address: initialValues?.address ?? '',
      phone: initialValues?.phone ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        placeholder="Nombre del proveedor"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Dirección"
        placeholder="Dirección (opcional)"
        error={errors.address?.message}
        {...register('address')}
      />
      <Input
        label="Teléfono"
        placeholder="Teléfono (opcional)"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
