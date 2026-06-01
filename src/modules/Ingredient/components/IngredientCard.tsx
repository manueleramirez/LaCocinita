import { IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import type { Ingredient } from '@/types';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (item: Ingredient) => void;
  onDelete: (id: string) => void;
}

const unitLabels: Record<string, string> = {
  kg: 'kg', g: 'g', lb: 'lb', oz: 'oz',
  l: 'L', ml: 'ml',
  un: 'un', doc: 'doc', paq: 'paq',
};

export function IngredientCard({ ingredient, onEdit, onDelete }: IngredientCardProps) {
  const isLowStock = ingredient.minStock != null && ingredient.quantity < ingredient.minStock;

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-[var(--color-text)] truncate">{ingredient.name}</h3>
            {isLowStock && <Badge variant="warning">Stock bajo</Badge>}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Stock: {ingredient.quantity} {unitLabels[ingredient.unitId] ?? ingredient.unitId}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Precio: ${ingredient.unitPrice.toFixed(2)} / {unitLabels[ingredient.unitId] ?? ingredient.unitId}
          </p>
          {ingredient.brand && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Marca: {ingredient.brand}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(ingredient)}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Editar"
          >
            <IoCreateOutline size={18} />
          </button>
          <button
            onClick={() => onDelete(ingredient.id)}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-error)] transition-colors"
            title="Eliminar"
          >
            <IoTrashOutline size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
}
