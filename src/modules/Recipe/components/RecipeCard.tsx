import { IoTimeOutline, IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import { Card } from '@/shared/components/ui/Card';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (item: Recipe) => void;
  onDelete: (id: string) => void;
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-[var(--color-text)] truncate">{recipe.name}</h3>
          </div>
          {recipe.description && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-2">{recipe.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <IoTimeOutline size={14} />
              {formatTime(recipe.preparationTime)}
            </span>
            <span>{recipe.portionsPerRecipe} porción(es)</span>
            <span className="font-medium text-[var(--color-primary)]">
              ${recipe.recommendedSalesPrice?.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(recipe)}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Editar"
          >
            <IoCreateOutline size={18} />
          </button>
          <button
            onClick={() => onDelete(recipe.id)}
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
