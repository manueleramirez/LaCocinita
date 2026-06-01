import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppStore';
import {
  setItems, addItem, updateItem, removeItem,
  selectItem, clearSelection, setEditing,
  setLoading, setError,
} from '@/modules/Recipe/store/recipeSlice';
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe } from '@/modules/Recipe/services';
import { RecipeList } from '@/modules/Recipe/components/RecipeList';
import { RecipeForm } from '@/modules/Recipe/components/RecipeForm';
import { Modal } from '@/shared/components/ui/Modal';
import { useModal } from '@/shared/hooks/useModal';
import type { RecipeCreate } from '@/types';

export default function RecipePage() {
  const dispatch = useAppDispatch();
  const { items, selected, isEditing, loading } = useAppSelector((state) => state.recipes);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { isOpen, open, close } = useModal();

  useEffect(() => {
    if (!userId) return;
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadRecipes = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    const result = await getAllRecipes(userId);
    if (result.isSuccess && result.data) {
      dispatch(setItems(result.data));
    } else {
      dispatch(setError(result.error ?? 'Error al cargar recetas'));
    }
  };

  const handleAdd = async (data: RecipeCreate) => {
    const result = await createRecipe(data);
    if (result.isSuccess && result.data) {
      dispatch(addItem(result.data));
      toast.success('Receta creada');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al crear');
    }
  };

  const handleEdit = async (data: RecipeCreate) => {
    if (!selected?.id) return;
    const result = await updateRecipe(selected.id, data);
    if (result.isSuccess && result.data) {
      dispatch(updateItem(result.data));
      toast.success('Receta actualizada');
      close();
      dispatch(clearSelection());
    } else {
      toast.error(result.error ?? 'Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta receta?')) return;
    const result = await deleteRecipe(id);
    if (result.isSuccess) {
      dispatch(removeItem(id));
      toast.success('Receta eliminada');
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
      <RecipeList
        items={items}
        loading={loading}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Editar receta' : 'Nueva receta'} size="xl">
        <RecipeForm
          onSubmit={isEditing && selected ? (data) => handleEdit(data) : handleAdd}
          initialValues={selected}
          isEditing={isEditing}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
}
