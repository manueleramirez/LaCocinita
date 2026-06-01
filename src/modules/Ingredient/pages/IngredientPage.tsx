import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppStore';
import {
  setItems, addItem, updateItem, removeItem,
  selectItem, clearSelection, setEditing,
  setLoading, setError,
} from '@/modules/Ingredient/store/ingredientSlice';
import { getAllIngredients, createIngredient, updateIngredient, deleteIngredient } from '@/modules/Ingredient/services';
import { IngredientList } from '@/modules/Ingredient/components/IngredientList';
import { IngredientForm } from '@/modules/Ingredient/components/IngredientForm';
import { Modal } from '@/shared/components/ui/Modal';
import { useModal } from '@/shared/hooks/useModal';
import type { IngredientCreate } from '@/types';

export default function IngredientPage() {
  const dispatch = useAppDispatch();
  const { items, selected, isEditing, loading } = useAppSelector((state) => state.ingredient);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    if (!userId) return;
    loadIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadIngredients = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    const result = await getAllIngredients(userId);
    if (result.isSuccess && result.data) {
      dispatch(setItems(result.data));
    } else {
      dispatch(setError(result.error ?? 'Error al cargar ingredientes'));
    }
  };

  const handleAdd = async (data: IngredientCreate) => {
    const result = await createIngredient(data);
    if (result.isSuccess && result.data) {
      dispatch(addItem(result.data));
      toast.success('Ingrediente creado');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al crear');
    }
  };

  const handleEdit = async (data: IngredientCreate) => {
    if (!selected?.id) return;
    const result = await updateIngredient(selected.id, data);
    if (result.isSuccess && result.data) {
      dispatch(updateItem(result.data));
      toast.success('Ingrediente actualizado');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este ingrediente?')) return;
    const result = await deleteIngredient(id);
    if (result.isSuccess) {
      dispatch(removeItem(id));
      toast.success('Ingrediente eliminado');
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
      <IngredientList
        items={items}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}>
        <IngredientForm
          onSubmit={isEditing && selected ? (data) => handleEdit(data) : handleAdd}
          initialValues={selected}
          isEditing={isEditing}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
