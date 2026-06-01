import { Button } from '@/shared/components/ui/Button';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { Recipe } from '@/types';

interface RecipeListProps {
  items: Recipe[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Recipe) => void;
  onDelete: (id: string) => void;
}

export function RecipeList({ items, loading, onAdd, onEdit, onDelete }: RecipeListProps) {
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
        title="No hay recetas"
        description="Crea tu primera receta y calcula su precio de venta."
        action={<Button onClick={onAdd}>Crear receta</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">{items.length} receta(s)</p>
        <Button onClick={onAdd} size="sm">Nueva receta</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
