import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/infrastructure/supabase/client';
import { orderSchema, type OrderFormValues } from '@/modules/Order/validation';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppStore';
import { getAllRecipes } from '@/modules/Recipe/services';
import { setItems as setRecipeItems, setLoading as setRecipeLoading } from '@/modules/Recipe/store/recipeSlice';
import type { Order, Customer } from '@/types';

interface OrderFormProps {
  onSubmit: (data: OrderFormValues) => Promise<void>;
  initialValues?: Order | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

const paymentOptions = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'CARD', label: 'Tarjeta' },
  { value: 'TRANSFER', label: 'Transferencia' },
  { value: 'OTHER', label: 'Otro' },
];

export function OrderForm({ onSubmit, initialValues, isEditing, onCancel }: OrderFormProps) {
  const recipes = useAppSelector((state) => state.recipes.items);
  const userId = useAppSelector((state) => state.user.user?.id);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerMode, setCustomerMode] = useState<'select' | 'manual'>(
    initialValues?.customerName && !initialValues?.customerId ? 'manual' : 'select'
  );

  const dispatch = useAppDispatch();

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: initialValues?.customerName ?? '',
      items: initialValues?.items?.map((i) => ({
        description: i.description,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
      })) ?? [],
      subtotal: initialValues?.subtotal ?? 0,
      discount: initialValues?.discount ?? 0,
      tax: initialValues?.tax ?? 0,
      total: initialValues?.total ?? 0,
      paymentMethod: initialValues?.paymentMethod ?? 'CASH',
      notes: initialValues?.notes ?? '',
      orderDate: initialValues?.orderDate
        ? new Date(initialValues.orderDate).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const watchedItems = watch('items');
  const watchedDiscount = watch('discount');
  const watchedTax = watch('tax');

  useEffect(() => {
    if (!userId) return;
    supabase.from('customers').select('id, name').eq('user_id', userId).order('name')
      .then(({ data }) => { if (data) setCustomers(data as Customer[]); });
  }, [userId]);

  useEffect(() => {
    if (recipes.length === 0 && userId) {
      dispatch(setRecipeLoading(true));
      getAllRecipes(userId).then((result) => {
        if (result.isSuccess && result.data) {
          dispatch(setRecipeItems(result.data));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const itemsSubtotal = (watchedItems ?? []).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0
    );
    const roundedSubtotal = Math.round(itemsSubtotal * 100) / 100;
    setValue('subtotal', roundedSubtotal);
    setValue('total', Math.round((roundedSubtotal - (watchedDiscount || 0) + (watchedTax || 0)) * 100) / 100);
  }, [watchedItems, watchedDiscount, watchedTax, setValue]);

  const addItem = () => {
    append({ description: '', quantity: 1, unitPrice: 0, subtotal: 0 });
  };

  const handleCustomerSelect = (value: string) => {
    if (value === '__manual__') {
      setCustomerMode('manual');
      setValue('customerName', '');
      return;
    }
    if (value === '__none__') {
      setValue('customerName', '');
      return;
    }
    const customer = customers.find((c) => c.id === value);
    if (customer) setValue('customerName', customer.name);
  };

  const handleRecipeSelect = (index: number, recipeId: string) => {
    if (recipeId === '__manual__') return;
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      setValue(`items.${index}.description`, recipe.name);
      setValue(`items.${index}.unitPrice`, recipe.recommendedSalesPricePerPortion || recipe.recommendedSalesPrice);
    }
  };

  const customerOptions = [
    { value: '__none__', label: 'Cliente ocasional' },
    ...customers.map((c) => ({ value: c.id, label: c.name })),
    { value: '__manual__', label: 'Escribir manualmente...' },
  ];

  const recipeOptions = [
    { value: '__manual__', label: 'Escribir manualmente...' },
    ...recipes.map((r) => ({
      value: r.id,
      label: `${r.name} ($${(r.recommendedSalesPricePerPortion || r.recommendedSalesPrice).toFixed(2)})`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {customerMode === 'manual' ? (
        <div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Cliente"
                placeholder="Nombre del cliente"
                error={errors.customerName?.message}
                {...register('customerName')}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setCustomerMode('select'); setValue('customerName', ''); }}
              className="mb-1"
            >
              Seleccionar
            </Button>
          </div>
        </div>
      ) : (
        <Select
          label="Cliente"
          options={customerOptions}
          placeholder="Seleccionar cliente..."
          value={
            initialValues?.customerId && customers.some((c) => c.id === initialValues.customerId)
              ? initialValues.customerId
              : '__none__'
          }
          onChange={(e) => handleCustomerSelect(e.target.value)}
        />
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-[var(--color-text)]">Items</label>
          <Button type="button" size="sm" variant="secondary" onClick={addItem}>
            <IoAddOutline size={16} /> Agregar item
          </Button>
        </div>
        {errors.items?.message && (
          <p className="text-xs text-[var(--color-error)] mb-2">{errors.items.message}</p>
        )}
        <div className="space-y-2">
          {fields.map((field, index) => {
            const qty = watch(`items.${index}.quantity`) || 0;
            const price = watch(`items.${index}.unitPrice`) || 0;
            const lineTotal = Math.round(qty * price * 100) / 100;

            return (
              <Card key={field.id}>
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    {recipes.length > 0 && (
                      <Select
                        options={recipeOptions}
                        placeholder="Seleccionar receta..."
                        onChange={(e) => handleRecipeSelect(index, e.target.value)}
                      />
                    )}
                    <Input
                      placeholder="Descripción (ej: Receta X)"
                      error={errors.items?.[index]?.description?.message}
                      {...register(`items.${index}.description`)}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Cant."
                        error={errors.items?.[index]?.quantity?.message}
                        {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Precio u."
                        error={errors.items?.[index]?.unitPrice?.message}
                        {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      />
                      <div className="flex items-center justify-end px-2 text-sm font-medium text-[var(--color-primary)]">
                        ${lineTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-error)] transition-colors mt-1"
                    title="Eliminar item"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Subtotal"
          type="number"
          step="0.01"
          error={errors.subtotal?.message}
          {...register('subtotal', { valueAsNumber: true })}
        />
        <Input
          label="Descuento"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.discount?.message}
          {...register('discount', { valueAsNumber: true })}
        />
        <Input
          label="Impuesto"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.tax?.message}
          {...register('tax', { valueAsNumber: true })}
        />
        <Input
          label="Total"
          type="number"
          step="0.01"
          error={errors.total?.message}
          {...register('total', { valueAsNumber: true })}
        />
      </div>

      <Select
        label="Método de pago"
        options={paymentOptions}
        placeholder="Selecciona método de pago"
        error={errors.paymentMethod?.message}
        {...register('paymentMethod')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Notas"
          placeholder="Notas adicionales (opcional)"
          error={errors.notes?.message}
          {...register('notes')}
        />
        <Input
          label="Fecha de venta"
          type="datetime-local"
          error={errors.orderDate?.message}
          {...register('orderDate')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Actualizar venta' : 'Registrar venta'}
        </Button>
      </div>
    </form>
  );
}
