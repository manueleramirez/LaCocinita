import { Button } from '@/shared/components/ui/Button';
import { IngredientCard } from './IngredientCard';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { Ingredient } from '@/types';

interface IngredientListProps {
  items: Ingredient[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Ingredient) => void;
  onDelete: (id: string) => void;
}

export function IngredientList({ items, loading, onAdd, onEdit, onDelete }: IngredientListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No hay ingredientes"
        description="Agrega tu primer ingrediente para empezar."
        action={<Button onClick={onAdd}>Agregar ingrediente</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">{items.length} ingrediente(s)</p>
        <Button onClick={onAdd} size="sm">Agregar</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((ingredient) => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
