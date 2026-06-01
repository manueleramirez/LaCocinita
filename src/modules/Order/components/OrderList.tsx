import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { OrderCard } from './OrderCard';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { Order } from '@/types';

interface OrderListProps {
  items: Order[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: Order) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<string, string> = {
  ALL: 'Todas',
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERED', 'CANCELLED'] as const;

export function OrderList({ items, loading, onAdd, onEdit, onDelete }: OrderListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = statusFilter === 'ALL' ? items : items.filter((o) => o.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border
              ${statusFilter === s
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
              }`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay ventas"
          description="Registra tu primera venta para empezar."
          action={<Button onClick={onAdd}>Registrar venta</Button>}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {filtered.length} venta(s)
              {statusFilter !== 'ALL' && ` · ${statusLabels[statusFilter].toLowerCase()}`}
            </p>
            <Button onClick={onAdd} size="sm">Registrar venta</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
