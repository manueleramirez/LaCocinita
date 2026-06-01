import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ingredientSchema, type IngredientFormValues } from '@/modules/Ingredient/validation';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { useAppSelector } from '@/shared/hooks/useAppStore';
import type { Ingredient, IngredientCreate } from '@/types';

interface IngredientFormProps {
  onSubmit: (data: IngredientCreate) => Promise<void>;
  initialValues?: Ingredient | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

const unitOptions = [
  { value: 'kg', label: 'Kilogramo (kg)' },
  { value: 'g', label: 'Gramo (g)' },
  { value: 'lb', label: 'Libra (lb)' },
  { value: 'oz', label: 'Onza (oz)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'un', label: 'Unidad' },
  { value: 'doc', label: 'Docena' },
  { value: 'paq', label: 'Paquete' },
];

export function IngredientForm({ onSubmit, initialValues, isEditing, onCancel }: IngredientFormProps) {
  const suppliers = useAppSelector((state) => state.supplier.items);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      quantity: initialValues?.quantity ?? 0,
      unitId: initialValues?.unitId ?? 'un',
      unitPrice: initialValues?.unitPrice ?? 0,
      packagePrice: initialValues?.packagePrice ?? 0,
      distributorId: initialValues?.distributorId ?? '',
      brand: initialValues?.brand ?? '',
      minStock: initialValues?.minStock ?? undefined,
    },
  });

  const quantity = watch('quantity');
  const packagePrice = watch('packagePrice');

  const calculatedUnitPrice = quantity > 0 ? packagePrice / quantity : 0;

  useEffect(() => {
    setValue('unitPrice', calculatedUnitPrice);
  }, [calculatedUnitPrice, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        placeholder="Nombre del ingrediente"
        error={errors.name?.message}
        {...register('name')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Cantidad"
          type="number"
          step="0.01"
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />
        <Select
          label="Unidad"
          options={unitOptions}
          error={errors.unitId?.message}
          {...register('unitId')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio del paquete ($)"
          type="number"
          step="0.01"
          error={errors.packagePrice?.message}
          {...register('packagePrice', { valueAsNumber: true })}
        />
        <Input
          label="Stock mínimo (alerta)"
          type="number"
          step="0.01"
          error={errors.minStock?.message}
          {...register('minStock', { valueAsNumber: true })}
        />
      </div>
      <div className="text-sm text-[var(--color-text-secondary)] text-right">
        Precio por unidad: <span className="font-semibold text-[var(--color-text)]">${calculatedUnitPrice.toFixed(2)}</span>
      </div>
      <Input
        label="Marca"
        placeholder="Marca (opcional)"
        error={errors.brand?.message}
        {...register('brand')}
      />
      <Select
        label="Proveedor"
        options={[
          { value: '', label: 'Sin proveedor' },
          ...suppliers.map((s) => ({ value: s.id, label: s.name })),
        ]}
        {...register('distributorId')}
      />
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}
