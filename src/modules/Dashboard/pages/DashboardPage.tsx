import { useEffect, useState } from 'react';
import { supabase } from '@/infrastructure/supabase/client';
import { useAppSelector } from '@/shared/hooks/useAppStore';
import { Card } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { mapDbResponse } from '@/shared/utils/mapDbResponse';
import type { Order } from '@/types';

interface DashboardStats {
  totalRecipes: number;
  totalIngredients: number;
  totalSuppliers: number;
  todayOrders: number;
  todayRevenue: number;
  monthRevenue: number;
  monthExpenses: number;
  lowStockCount: number;
}

export default function DashboardPage() {
  const userId = useAppSelector((state) => state.user.user?.id);
  const recipes = useAppSelector((state) => state.recipes.items);
  const ingredients = useAppSelector((state) => state.ingredient.items);
  const suppliers = useAppSelector((state) => state.supplier.items);
  const [stats, setStats] = useState<DashboardStats>({
    totalRecipes: 0, totalIngredients: 0, totalSuppliers: 0,
    todayOrders: 0, todayRevenue: 0, monthRevenue: 0, monthExpenses: 0, lowStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, recipes, ingredients, suppliers]);

  const loadStats = async () => {
    if (!userId) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const lowStockCount = ingredients.filter((i) => i.minStock != null && i.quantity < i.minStock).length;

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .gte('order_date', monthStart.toISOString());

    const monthOrders = (orders ?? []).map((r) => mapDbResponse<Order>(r as Record<string, unknown>));
    const todayOrders = monthOrders.filter(
      (o) => new Date(o.orderDate) >= today && o.status !== 'CANCELLED'
    );
    const monthRevenue = monthOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.total ?? 0), 0);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);

    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('expense_date', monthStart.toISOString().split('T')[0]);

    const monthExpenses = (expenses ?? []).reduce((sum, e) => sum + ((e as Record<string, unknown>).amount as number ?? 0), 0);

    setStats({
      totalRecipes: recipes.length,
      totalIngredients: ingredients.length,
      totalSuppliers: suppliers.length,
      todayOrders: todayOrders.length,
      todayRevenue,
      monthRevenue,
      monthExpenses,
      lowStockCount,
    });
    setLoading(false);
  };

  const statCards = [
    { label: 'Recetas', value: stats.totalRecipes, color: 'text-[var(--color-primary)]' },
    { label: 'Ingredientes', value: stats.totalIngredients, color: 'text-[var(--color-info)]' },
    { label: 'Proveedores', value: stats.totalSuppliers, color: 'text-[var(--color-success)]' },
    { label: 'Stock bajo', value: stats.lowStockCount, color: 'text-[var(--color-warning)]' },
    { label: 'Ventas hoy', value: stats.todayOrders, color: 'text-[var(--color-text)]' },
    { label: 'Ingresos hoy', value: `$${stats.todayRevenue.toFixed(2)}`, color: 'text-[var(--color-success)]' },
    { label: 'Ingresos del mes', value: `$${stats.monthRevenue.toFixed(2)}`, color: 'text-[var(--color-success)]' },
    { label: 'Gastos del mes', value: `$${stats.monthExpenses.toFixed(2)}`, color: 'text-[var(--color-error)]' },
  ];

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">Resumen financiero</h2>
        <Card>
          {stats.monthRevenue > 0 || stats.monthExpenses > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)]">Ingresos del mes</span>
                <span className="font-semibold text-[var(--color-success)]">+${stats.monthRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-secondary)]">Gastos del mes</span>
                <span className="font-semibold text-[var(--color-error)]">-${stats.monthExpenses.toFixed(2)}</span>
              </div>
              <hr className="border-[var(--color-border)]" />
              <div className="flex justify-between items-center">
                <span className="font-medium text-[var(--color-text)]">Balance del mes</span>
                <span className={`text-lg font-bold ${stats.monthRevenue - stats.monthExpenses >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                  ${(stats.monthRevenue - stats.monthExpenses).toFixed(2)}
                </span>
              </div>
              {stats.monthRevenue > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">Margen de ganancia</span>
                  <span className="font-medium text-[var(--color-primary)]">
                    {((stats.monthRevenue - stats.monthExpenses) / stats.monthRevenue * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
              No hay suficientes datos para mostrar el resumen financiero. Registra ventas y gastos para verlos aquí.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
