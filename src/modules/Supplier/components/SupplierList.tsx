import { Button } from '@/shared/components/ui/Button';
import { SupplierCard } from './SupplierCard';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { Supplier } from '@/types';

interface SupplierListProps {
  items: Supplier[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Supplier) => void;
  onDelete: (id: string) => void;
}

export function SupplierList({ items, loading, onAdd, onEdit, onDelete }: SupplierListProps) {
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
        title="No hay proveedores"
        description="Agrega tu primer proveedor para empezar."
        action={<Button onClick={onAdd}>Agregar proveedor</Button>}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">{items.length} proveedor(es)</p>
        <Button onClick={onAdd} size="sm">Agregar</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
