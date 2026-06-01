import {
  IoCreateOutline, IoTrashOutline,
  IoCashOutline, IoCardOutline, IoSwapHorizontalOutline,
} from 'react-icons/io5';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import type { Order, OrderStatus } from '@/types';

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const statusBadge: Record<OrderStatus, 'info' | 'warning' | 'success' | 'error'> = {
  PENDING: 'info',
  CONFIRMED: 'warning',
  PREPARING: 'warning',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const paymentIcons = {
  CASH: IoCashOutline,
  CARD: IoCardOutline,
  TRANSFER: IoSwapHorizontalOutline,
  OTHER: IoCashOutline,
};

export function OrderCard({ order, onEdit, onDelete }: OrderCardProps) {
  const PaymentIcon = paymentIcons[order.paymentMethod] ?? IoCashOutline;

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[var(--color-text)] truncate">
              {order.customerName ?? 'Cliente ocasional'}
            </span>
            <Badge variant={statusBadge[order.status]}>{statusLabels[order.status]}</Badge>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {new Date(order.orderDate).toLocaleDateString('es-ES', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
          <div className="flex items-center gap-3 mt-2 text-sm text-[var(--color-text-secondary)]">
            <span>{order.items?.length ?? 0} ítem(s)</span>
            <span className="flex items-center gap-1">
              <PaymentIcon size={14} />
              {order.paymentMethod === 'CASH' ? 'Efectivo' :
               order.paymentMethod === 'CARD' ? 'Tarjeta' :
               order.paymentMethod === 'TRANSFER' ? 'Transferencia' : 'Otro'}
            </span>
          </div>
          <p className="text-sm mt-1">
            Total: <strong className="text-[var(--color-primary)]">${order.total?.toFixed(2)}</strong>
          </p>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={() => onEdit(order)}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Editar"
          >
            <IoCreateOutline size={18} />
          </button>
          <button
            onClick={() => onDelete(order.id)}
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
