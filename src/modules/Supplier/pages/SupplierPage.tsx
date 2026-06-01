import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppStore';
import {
  setItems, addItem, updateItem, removeItem,
  selectItem, clearSelection, setEditing,
  setLoading, setError,
} from '@/modules/Supplier/store/supplierSlice';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/modules/Supplier/services';
import { SupplierList } from '@/modules/Supplier/components/SupplierList';
import { SupplierForm } from '@/modules/Supplier/components/SupplierForm';
import { Modal } from '@/shared/components/ui/Modal';
import { useModal } from '@/shared/hooks/useModal';
import type { SupplierCreate } from '@/types';

export default function SupplierPage() {
  const dispatch = useAppDispatch();
  const { items, selected, isEditing, loading } = useAppSelector((state) => state.supplier);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    if (!userId) return;
    loadSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadSuppliers = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    const result = await getAllSuppliers(userId);
    if (result.isSuccess && result.data) {
      dispatch(setItems(result.data));
    } else {
      dispatch(setError(result.error ?? 'Error al cargar proveedores'));
    }
  };

  const handleAdd = async (data: SupplierCreate) => {
    const result = await createSupplier(data);
    if (result.isSuccess && result.data) {
      dispatch(addItem(result.data));
      toast.success('Proveedor creado');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al crear');
    }
  };

  const handleEdit = async (data: SupplierCreate) => {
    if (!selected?.id) return;
    const result = await updateSupplier(selected.id, data);
    if (result.isSuccess && result.data) {
      dispatch(updateItem(result.data));
      toast.success('Proveedor actualizado');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este proveedor?')) return;
    const result = await deleteSupplier(id);
    if (result.isSuccess) {
      dispatch(removeItem(id));
      toast.success('Proveedor eliminado');
    } else {
      toast.error(result.error ?? 'Error al eliminar');
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
      <SupplierList
        items={items}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}>
        <SupplierForm
          onSubmit={isEditing && selected ? (data) => handleEdit(data) : handleAdd}
          initialValues={selected}
          isEditing={isEditing}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
