import { useAppSelector } from '@/shared/hooks/useAppStore';
import { IngredientList } from '@/modules/Ingredient/components/IngredientList';

export default function InventoryPage() {
  const { items, loading } = useAppSelector((state) => state.ingredient);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Control de Inventario</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Monitorea el stock de tus ingredientes. Los que están por debajo del mínimo se marcan en amarillo.
        </p>
      </div>
      <IngredientList
        items={items}
        loading={loading}
        onAdd={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
