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
import type { Customer } from '@/types';

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { isOpen, open, close } = useModal();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadCustomers = async () => {
    if (!userId) return;
    const { data, error } = await supabase.from('customers').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (!error && data) setCustomers(data.map((r) => mapDbResponse<Customer>(r as Record<string, unknown>)));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (!userId) return;

    if (editingId) {
      const { data: updatedData, error } = await supabase.from('customers').update(form).eq('id', editingId).select().single();
      if (!error && updatedData) {
        setCustomers((prev) => prev.map((c) => c.id === editingId ? mapDbResponse<Customer>(updatedData as Record<string, unknown>) : c));
        toast.success('Cliente actualizado');
      }
    } else {
      const { data, error } = await supabase.from('customers').insert({ ...form, user_id: userId }).select().single();
      if (!error && data) {
        setCustomers((prev) => [mapDbResponse<Customer>(data as Record<string, unknown>), ...prev]);
        toast.success('Cliente creado');
      }
    }

    close();
    setEditingId(null);
    setForm({ name: '', phone: '', email: '', address: '', notes: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success('Cliente eliminado');
    }
  };

  const openEdit = (customer: Customer) => {
    setForm({ name: customer.name, phone: customer.phone ?? '', email: customer.email ?? '', address: customer.address ?? '', notes: customer.notes ?? '' });
    setEditingId(customer.id);
    open();
  };

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--color-text-secondary)]">{customers.length} cliente(s)</p>
        <Button onClick={() => { setEditingId(null); setForm({ name: '', phone: '', email: '', address: '', notes: '' }); open(); }} size="sm">Agregar</Button>
      </div>
      {customers.length === 0 ? (
        <EmptyState title="No hay clientes" description="Registra a tus clientes para gestionar ventas." action={<Button onClick={() => { setEditingId(null); setForm({ name: '', phone: '', email: '', address: '', notes: '' }); open(); }}>Agregar cliente</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customers.map((customer) => (
            <Card key={customer.id} hover onClick={() => openEdit(customer)}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">{customer.name}</h3>
                  {customer.phone && <p className="text-sm text-[var(--color-text-secondary)]">{customer.phone}</p>}
                  {customer.email && <p className="text-sm text-[var(--color-text-secondary)]">{customer.email}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }} className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-error)]">✕</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={close} title={editingId ? 'Editar cliente' : 'Nuevo cliente'}>
        <div className="space-y-4">
          <Input label="Nombre" name="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Teléfono" name="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Dirección" name="address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          <Input label="Notas" name="notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          <Button onClick={handleSave} className="w-full">{editingId ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </Modal>
    </div>
  );
}
