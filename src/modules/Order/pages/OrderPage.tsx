import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppStore';
import {
  setItems, addItem, updateItem, removeItem,
  selectItem, clearSelection, setEditing,
  setLoading, setError,
} from '@/modules/Order/store/orderSlice';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '@/modules/Order/services';
import { OrderList } from '@/modules/Order/components/OrderList';
import { OrderForm } from '@/modules/Order/components/OrderForm';
import { Modal } from '@/shared/components/ui/Modal';
import { useModal } from '@/shared/hooks/useModal';
import type { OrderFormValues } from '@/modules/Order/validation';

export default function OrderPage() {
  const dispatch = useAppDispatch();
  const { items, selected, isEditing, loading } = useAppSelector((state) => state.order);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    if (!userId) return;
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadOrders = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    const result = await getAllOrders(userId);
    if (result.isSuccess && result.data) {
      dispatch(setItems(result.data));
    } else {
      dispatch(setError(result.error ?? 'Error al cargar ventas'));
    }
  };

  const handleAdd = async (data: OrderFormValues) => {
    const result = await createOrder({
      customerName: data.customerName || undefined,
      items: data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      paymentMethod: data.paymentMethod,
      notes: data.notes || undefined,
      orderDate: data.orderDate,
    });
    if (result.isSuccess && result.data) {
      dispatch(addItem(result.data));
      toast.success('Venta registrada');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al registrar venta');
    }
  };

  const handleEdit = async (data: OrderFormValues) => {
    if (!selected?.id) return;
    const result = await updateOrder(selected.id, {
      customerName: data.customerName || undefined,
      items: data.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
      subtotal: data.subtotal,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      paymentMethod: data.paymentMethod,
      notes: data.notes || undefined,
      orderDate: data.orderDate,
    });
    if (result.isSuccess && result.data) {
      dispatch(updateItem(result.data));
      toast.success('Venta actualizada');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al actualizar venta');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta venta?')) return;
    const result = await deleteOrder(id);
    if (result.isSuccess) {
      dispatch(removeItem(id));
      toast.success('Venta eliminada');
    } else {
      toast.error(result.error ?? 'Error al eliminar venta');
    }
  };

  const openEdit = (item: typeof selected) => {
    dispatch(selectItem(item));
    dispatch(setEditing(true));
    open();
  };

  const openAdd = () => {
    dispatch(clearSelection());
    open();
  };

  const handleClose = () => {
    close();
    dispatch(clearSelection());
  };

  return (
    <div>
      <OrderList
        items={items}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={isEditing ? 'Editar venta' : 'Registrar venta'}
        size="xl"
      >
        <OrderForm
          onSubmit={isEditing && selected ? (data) => handleEdit(data) : handleAdd}
          initialValues={selected}
          isEditing={isEditing}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
