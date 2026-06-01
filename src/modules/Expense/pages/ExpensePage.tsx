import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/infrastructure/supabase/client';
import { useAppSelector } from '@/shared/hooks/useAppStore';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useModal } from '@/shared/hooks/useModal';
import { mapDbResponse } from '@/shared/utils/mapDbResponse';
import type { Expense } from '@/types';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { isOpen, open, close } = useModal();
  const [form, setForm] = useState({ description: '', amount: 0, expenseDate: new Date().toISOString().split('T')[0], notes: '' });

  useEffect(() => {
    if (!userId) return;
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadExpenses = async () => {
    if (!userId) return;
    const { data, error } = await supabase.from('expenses').select('*').eq('user_id', userId).order('expense_date', { ascending: false });
    if (!error && data) setExpenses(data.map((r) => mapDbResponse<Expense>(r as Record<string, unknown>)));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.description.trim() || form.amount <= 0) { toast.error('Completa todos los campos'); return; }
    if (!userId) return;

    const { data, error } = await supabase.from('expenses').insert({
      description: form.description,
      amount: form.amount,
      expense_date: form.expenseDate,
      notes: form.notes,
      user_id: userId,
    }).select().single();

    if (!error && data) {
      setExpenses((prev) => [mapDbResponse<Expense>(data as Record<string, unknown>), ...prev]);
      toast.success('Gasto registrado');
      close();
      setForm({ description: '', amount: 0, expenseDate: new Date().toISOString().split('T')[0], notes: '' });
    } else {
      toast.error(error?.message ?? 'Error al registrar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success('Gasto eliminado');
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{expenses.length} gasto(s)</p>
          <p className="text-lg font-bold text-[var(--color-primary)]">Total: ${total.toFixed(2)}</p>
        </div>
        <Button onClick={open} size="sm">Registrar gasto</Button>
      </div>

      {expenses.length === 0 ? (
        <EmptyState title="No hay gastos" description="Registra tus gastos operativos para llevar control." action={<Button onClick={open}>Registrar gasto</Button>} />
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <Card key={expense.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">{expense.description}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{new Date(expense.expenseDate).toLocaleDateString('es-ES')}</p>
                  {expense.notes && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{expense.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--color-error)]">-${expense.amount.toFixed(2)}</span>
                  <button onClick={() => handleDelete(expense.id)} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-error)]">✕</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={close} title="Registrar gasto">
        <div className="space-y-4">
          <Input label="Descripción" name="description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <Input label="Monto" name="amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} />
          <Input label="Fecha" name="expenseDate" type="date" value={form.expenseDate} onChange={(e) => setForm((p) => ({ ...p, expenseDate: e.target.value }))} />
          <Input label="Notas" name="notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          <Button onClick={handleSave} className="w-full">Guardar gasto</Button>
        </div>
      </Modal>
    </div>
  );
}
