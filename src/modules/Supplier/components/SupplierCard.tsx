import { IoCallOutline, IoLocationOutline, IoTrashOutline, IoCreateOutline } from 'react-icons/io5';
import { Card } from '@/shared/components/ui/Card';
import type { Supplier } from '@/types';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export function SupplierCard({ supplier, onEdit, onDelete }: SupplierCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[var(--color-text)] truncate">{supplier.name}</h3>
          {supplier.address && (
            <p className="flex items-center gap-1.5 mt-1 text-sm text-[var(--color-text-secondary)]">
              <IoLocationOutline size={14} />
              <span className="truncate">{supplier.address}</span>
            </p>
          )}
          {supplier.phone && (
            <p className="flex items-center gap-1.5 mt-1 text-sm text-[var(--color-text-secondary)]">
              <IoCallOutline size={14} />
              <span>{supplier.phone}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(supplier)}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Editar"
          >
            <IoCreateOutline size={18} />
          </button>
          <button
            onClick={() => onDelete(supplier.id)}
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
