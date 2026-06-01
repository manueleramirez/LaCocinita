import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppStore';
import { setConfig, setLoading } from '@/modules/Config/store/configSlice';
import { getConfig, upsertConfig } from '@/modules/Config/services';
import { configSchema, type ConfigFormValues } from '@/modules/Config/validation';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

const currencyOptions = [
  { value: 'EUR', label: '€ Euro' },
  { value: 'USD', label: '$ Dólar' },
  { value: 'MXN', label: 'MX$ Peso Mexicano' },
  { value: 'COP', label: 'COL$ Peso Colombiano' },
  { value: 'ARS', label: 'AR$ Peso Argentino' },
  { value: 'PEN', label: 'S/ Sol Peruano' },
];

export default function ConfigPage() {
  const dispatch = useAppDispatch();
  const configState = useAppSelector((state) => state.config);
  const userId = useAppSelector((state) => state.user.user?.id);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      workHourlyRate: configState.workHourlyRate,
      profitMargin: configState.profitMargin,
      spendMargin: configState.spendMargin,
      currency: configState.currency,
      taxRate: configState.taxRate,
    },
  });

  useEffect(() => {
    if (!userId) return;
    dispatch(setLoading(true));
    getConfig(userId).then((result) => {
      if (result.isSuccess && result.data) {
        dispatch(setConfig(result.data));
        reset({
          workHourlyRate: result.data.workHourlyRate ?? 10,
          profitMargin: result.data.profitMargin ?? 30,
          spendMargin: result.data.spendMargin ?? 10,
          currency: result.data.currency ?? 'EUR',
          taxRate: result.data.taxRate ?? 0,
        });
      }
      dispatch(setLoading(false));
    });
  }, [userId, dispatch, reset]);

  const onSubmit = async (values: ConfigFormValues) => {
    if (!userId) return;
    const result = await upsertConfig(userId, values);
    if (result.isSuccess && result.data) {
      dispatch(setConfig(result.data));
      toast.success('Configuración guardada');
    } else {
      toast.error(result.error ?? 'Error al guardar');
    }
  };

  const handleThemeChange = (mode: string) => {
    dispatch(setConfig({ theme: mode as 'light' | 'dark' | 'system' }));
  };

  const handleColorChange = (color: string) => {
    dispatch(setConfig({ primaryColor: color }));
  };

  const handleSaveTheme = async () => {
    if (!userId) return;
    const result = await upsertConfig(userId, {
      theme: configState.theme,
      primaryColor: configState.primaryColor,
    });
    if (result.isSuccess) {
      toast.success('Tema guardado');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Configuración del Negocio</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo por hora (mano de obra)"
              type="number"
              step="0.01"
              error={errors.workHourlyRate?.message}
              {...register('workHourlyRate', { valueAsNumber: true })}
            />
            <Select
              label="Moneda"
              options={currencyOptions}
              error={errors.currency?.message}
              {...register('currency')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Margen de ganancia (%)"
              type="number"
              step="0.1"
              error={errors.profitMargin?.message}
              {...register('profitMargin', { valueAsNumber: true })}
            />
            <Input
              label="Margen de gastos indirectos (%)"
              type="number"
              step="0.1"
              error={errors.spendMargin?.message}
              {...register('spendMargin', { valueAsNumber: true })}
            />
            <Input
              label="Impuesto (%)"
              type="number"
              step="0.1"
              error={errors.taxRate?.message}
              {...register('taxRate', { valueAsNumber: true })}
            />
          </div>
          <Button type="submit" loading={isSubmitting}>
            Guardar configuración
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Apariencia</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Tema</label>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => handleThemeChange(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border
                    ${configState.theme === mode
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    }`}
                >
                  {mode === 'light' ? 'Claro' : mode === 'dark' ? 'Oscuro' : 'Sistema'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Color primario</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={configState.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-[var(--color-border)] cursor-pointer"
              />
              <span className="text-sm text-[var(--color-text-secondary)]">{configState.primaryColor}</span>
            </div>
          </div>
          <Button onClick={handleSaveTheme} variant="secondary">
            Guardar tema
          </Button>
        </div>
      </Card>
    </div>
  );
}
