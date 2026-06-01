import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipeSchema, type RecipeFormValues } from '@/modules/Recipe/validation';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { calculatePricing } from '@/services/pricing.service';
import { useAppSelector } from '@/shared/hooks/useAppStore';
import type { Recipe, RecipeCreate } from '@/types';

interface RecipeFormProps {
  onSubmit: (data: RecipeCreate) => Promise<void>;
  initialValues?: Recipe | null;
  isEditing?: boolean;
  onCancel?: () => void;
}

const unitOptions = [
  { value: 'kg', label: 'kg' }, { value: 'g', label: 'g' },
  { value: 'lb', label: 'lb' }, { value: 'oz', label: 'oz' },
  { value: 'l', label: 'L' }, { value: 'ml', label: 'ml' },
  { value: 'un', label: 'un' }, { value: 'doc', label: 'doc' },
  { value: 'paq', label: 'paq' },
];

export function RecipeForm({ onSubmit, initialValues, isEditing, onCancel }: RecipeFormProps) {
  const ingredients = useAppSelector((state) => state.ingredient.items);
  const config = useAppSelector((state) => state.config);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      instructions: initialValues?.instructions ?? '',
      preparationTime: initialValues?.preparationTime ?? 0,
      portionsPerRecipe: initialValues?.portionsPerRecipe ?? 1,
      ingredients: initialValues?.ingredients?.map((i) => ({
        ingredientId: i.ingredientId,
        quantity: i.quantity,
        unitId: i.unitId,
        cost: i.cost,
      })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });

  const watchedIngredients = useWatch({ control, name: 'ingredients' });
  const watchedPrepTime = watch('preparationTime');
  const watchedPortions = watch('portionsPerRecipe');

  const [pricing, setPricing] = useState({
    ingredientsCost: 0,
    indirectSpends: 0,
    personalSpends: 0,
    prepareCost: 0,
    recommendedSalesPrice: 0,
    recommendedSalesPricePerPortion: 0,
  });

  useEffect(() => {
    if (!watchedIngredients || watchedIngredients.length === 0) {
      setPricing({
        ingredientsCost: 0, indirectSpends: 0, personalSpends: 0,
        prepareCost: 0, recommendedSalesPrice: 0, recommendedSalesPricePerPortion: 0,
      });
      return;
    }

    const pricingInput = {
      ingredients: watchedIngredients.map((ing) => {
        const found = ingredients.find((i) => i.id === ing.ingredientId);
        return {
          ingredientId: ing.ingredientId,
          quantity: ing.quantity || 0,
          unitId: ing.unitId,
          ingredientPrice: found?.unitPrice ?? 0,
        };
      }),
      preparationTime: watchedPrepTime || 0,
      portionsPerRecipe: watchedPortions || 1,
      config: {
        workHourlyRate: config.workHourlyRate,
        profitMargin: config.profitMargin,
        spendMargin: config.spendMargin,
      },
    };

    const result = calculatePricing(pricingInput);
    setPricing(result);

    watchedIngredients.forEach((ing, index) => {
      const breakdown = result.ingredientBreakdown.find((b) => b.ingredientId === ing.ingredientId);
      if (breakdown && breakdown.cost !== ing.cost) {
        setValue(`ingredients.${index}.cost`, breakdown.cost);
      }
    });
  }, [watchedIngredients, watchedPrepTime, watchedPortions, ingredients, config, setValue]);

  const addIngredient = useCallback(() => {
    append({ ingredientId: '', quantity: 0, unitId: 'g', cost: 0 });
  }, [append]);

  const handleFormSubmit = async (values: RecipeFormValues) => {
    await onSubmit({
      name: values.name,
      description: values.description,
      instructions: values.instructions,
      preparationTime: values.preparationTime,
      portionsPerRecipe: values.portionsPerRecipe,
      ingredients: values.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
        unitId: ing.unitId,
        cost: ing.cost,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Nombre de la receta"
          placeholder="Ej: Ensalada César"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Descripción"
          placeholder="Breve descripción"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tiempo de preparación (min)"
            type="number"
            error={errors.preparationTime?.message}
            {...register('preparationTime', { valueAsNumber: true })}
          />
          <Input
            label="Porciones"
            type="number"
            error={errors.portionsPerRecipe?.message}
            {...register('portionsPerRecipe', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-[var(--color-text)]">Ingredientes</h3>
          <Button type="button" size="sm" variant="secondary" onClick={addIngredient}>
            + Agregar ingrediente
          </Button>
        </div>
        {errors.ingredients?.message && (
          <p className="text-sm text-[var(--color-error)] mb-2">{errors.ingredients.message}</p>
        )}
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2 p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <div className="flex-1 grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  <select
                    {...register(`ingredients.${index}.ingredientId`)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-2 py-1.5 text-sm"
                  >
                    <option value="">Seleccionar</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <Input type="number" step="0.01" placeholder="Cantidad" {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })} />
                </div>
                <div className="col-span-3">
                  <select
                    {...register(`ingredients.${index}.unitId`)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-2 py-1.5 text-sm"
                  >
                    {unitOptions.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    ${watchedIngredients?.[index]?.cost?.toFixed(2) ?? '0.00'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1.5 text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Instrucciones</label>
        <textarea
          {...register('instructions')}
          rows={4}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Pasos para preparar la receta..."
        />
      </div>

      <Card>
        <h3 className="font-medium text-[var(--color-text)] mb-3">Resumen de costos</h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Costo ingredientes</span>
            <span className="font-medium">${pricing.ingredientsCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Gastos indirectos ({config.spendMargin}%)</span>
            <span>${pricing.indirectSpends.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Mano de obra</span>
            <span>${pricing.personalSpends.toFixed(2)}</span>
          </div>
          <hr className="border-[var(--color-border)]" />
          <div className="flex justify-between font-medium">
            <span>Costo de preparación</span>
            <span>${pricing.prepareCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Margen de ganancia ({config.profitMargin}%)</span>
            <span>${(pricing.recommendedSalesPrice - pricing.prepareCost).toFixed(2)}</span>
          </div>
          <hr className="border-[var(--color-border)]" />
          <div className="flex justify-between text-base font-bold text-[var(--color-primary)]">
            <span>Precio de venta recomendado</span>
            <span>${pricing.recommendedSalesPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>Precio por porción</span>
            <span>${pricing.recommendedSalesPricePerPortion.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        )}
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? 'Actualizar receta' : 'Crear receta'}
        </Button>
      </div>
    </form>
  );
}
