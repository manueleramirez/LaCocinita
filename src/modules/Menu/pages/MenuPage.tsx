import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/shared/hooks/useAppStore';
import * as menuRepo from '@/infrastructure/repository/implementations/MenuRepository';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useModal } from '@/shared/hooks/useModal';
import type { Menu } from '@/types';

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useAppSelector((state) => state.user.user?.id);
  const recipes = useAppSelector((state) => state.recipes.items);
  const { isOpen, open, close } = useModal();
  const [formData, setFormData] = useState({ name: '', description: '', selectedRecipes: [] as string[] });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    menuRepo.getAllMenus(userId).then((res) => {
      if (res.isSuccess && res.data) setMenus(res.data);
      setLoading(false);
    });
  }, [userId]);

  const handleCreate = async () => {
    if (!formData.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    const result = await menuRepo.createMenu({
      name: formData.name,
      description: formData.description,
      recipes: formData.selectedRecipes.map((id) => ({ recipeId: id })),
    });
    if (result.isSuccess && result.data) {
      setMenus((prev) => [result.data!, ...prev]);
      toast.success('Menú creado');
      close();
      setFormData({ name: '', description: '', selectedRecipes: [] });
    } else {
      toast.error(result.error ?? 'Error al crear');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este menú?')) return;
    const result = await menuRepo.deleteMenu(id);
    if (result.isSuccess) {
      setMenus((prev) => prev.filter((m) => m.id !== id));
      toast.success('Menú eliminado');
    }
  };

  const toggleRecipe = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedRecipes: prev.selectedRecipes.includes(id)
        ? prev.selectedRecipes.filter((r) => r !== id)
        : [...prev.selectedRecipes, id],
    }));
  };

  const calculateTotal = (selectedIds: string[]) => {
    return selectedIds.reduce((sum, id) => {
      const recipe = recipes.find((r) => r.id === id);
      return sum + (recipe?.recommendedSalesPrice ?? 0);
    }, 0);
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">{menus.length} menú(s)</p>
        <Button onClick={open} size="sm">Nuevo menú</Button>
      </div>

      {menus.length === 0 ? (
        <EmptyState title="No hay menús" description="Crea un menú combinando tus recetas." action={<Button onClick={open}>Crear menú</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {menus.map((menu) => (
            <Card key={menu.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">{menu.name}</h3>
                  {menu.description && <p className="text-sm text-[var(--color-text-secondary)] mt-1">{menu.description}</p>}
                  <p className="text-sm text-[var(--color-primary)] font-semibold mt-2">${menu.totalPrice?.toFixed(2) ?? '0.00'}</p>
                </div>
                <button onClick={() => handleDelete(menu.id)} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-error)]">✕</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={close} title="Nuevo menú">
        <div className="space-y-4">
          <input
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm"
            placeholder="Nombre del menú"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm"
            placeholder="Descripción (opcional)"
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          />
          <div>
            <p className="text-sm font-medium text-[var(--color-text)] mb-2">Selecciona recetas</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recipes.map((recipe) => (
                <label key={recipe.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] cursor-pointer">
                  <input type="checkbox" checked={formData.selectedRecipes.includes(recipe.id)} onChange={() => toggleRecipe(recipe.id)} className="rounded" />
                  <span className="text-sm text-[var(--color-text)]">{recipe.name}</span>
                  <span className="text-sm text-[var(--color-text-secondary)] ml-auto">${recipe.recommendedSalesPrice?.toFixed(2)}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Total: <strong className="text-[var(--color-primary)]">${calculateTotal(formData.selectedRecipes).toFixed(2)}</strong>
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full">Crear menú</Button>
        </div>
      </Modal>
    </div>
  );
}
