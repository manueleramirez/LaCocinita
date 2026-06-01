import { supabase } from '@/infrastructure/supabase/client';
import type { ApiResponse, Order, OrderCreate, OrderItem } from '@/types';

interface RawOrder {
  id: string;
  user_id: string;
  customer_id: string | null;
  customer_name: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  payment_method: string;
  notes: string | null;
  order_date: string;
  created_at: string;
}


function toModel(raw: RawOrder, items: OrderItem[] = []): Order {
  return {
    id: raw.id,
    userId: raw.user_id,
    customerId: raw.customer_id ?? undefined,
    customerName: raw.customer_name ?? undefined,
    items,
    subtotal: raw.subtotal,
    discount: raw.discount,
    tax: raw.tax,
    total: raw.total,
    status: raw.status as Order['status'],
    paymentMethod: raw.payment_method as Order['paymentMethod'],
    notes: raw.notes ?? undefined,
    orderDate: raw.order_date,
    createdAt: raw.created_at,
  };
}

export async function getAllOrders(userId: string): Promise<ApiResponse<Order[]>> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('order_date', { ascending: false });

  if (error) return { isSuccess: false, data: null, error: error.message };

  const orders = (data ?? []).map((raw: Record<string, unknown>) => {
    const r = raw as unknown as RawOrder & { order_items: Array<Record<string, unknown>> };
    const items = (r.order_items ?? []).map((oi: Record<string, unknown>) => ({
      recipeId: (oi.recipe_id as string) ?? undefined,
      menuId: (oi.menu_id as string) ?? undefined,
      description: oi.description as string,
      quantity: oi.quantity as number,
      unitPrice: oi.unit_price as number,
      subtotal: oi.subtotal as number,
    }));
    return toModel(r, items);
  });

  return { isSuccess: true, data: orders };
}

export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };

  const r = data as unknown as RawOrder & { order_items: Array<Record<string, unknown>> };
  const items = (r.order_items ?? []).map((oi) => ({
    recipeId: (oi.recipe_id as string) ?? undefined,
    menuId: (oi.menu_id as string) ?? undefined,
    description: oi.description as string,
    quantity: oi.quantity as number,
    unitPrice: oi.unit_price as number,
    subtotal: oi.subtotal as number,
  }));

  return { isSuccess: true, data: toModel(r, items) };
}

export async function createOrder(order: OrderCreate): Promise<ApiResponse<Order>> {
  const { items, ...orderData } = order;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_id: orderData.customerId ?? null,
      customer_name: orderData.customerName ?? null,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      tax: orderData.tax,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      notes: orderData.notes ?? null,
      order_date: orderData.orderDate,
    })
    .select()
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: (data as RawOrder).id,
        recipe_id: item.recipeId ?? null,
        menu_id: item.menuId ?? null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      }))
    );

    if (itemsError) return { isSuccess: false, data: null, error: itemsError.message };
  }

  return getOrderById((data as RawOrder).id);
}

export async function updateOrder(id: string, order: OrderCreate): Promise<ApiResponse<Order>> {
  const { items, ...orderData } = order;

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      customer_id: orderData.customerId ?? null,
      customer_name: orderData.customerName ?? null,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      tax: orderData.tax,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      notes: orderData.notes ?? null,
      order_date: orderData.orderDate,
    })
    .eq('id', id);

  if (updateError) return { isSuccess: false, data: null, error: updateError.message };

  await supabase.from('order_items').delete().eq('order_id', id);

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: id,
        recipe_id: item.recipeId ?? null,
        menu_id: item.menuId ?? null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
      }))
    );

    if (itemsError) return { isSuccess: false, data: null, error: itemsError.message };
  }

  return getOrderById(id);
}

export async function deleteOrder(id: string): Promise<ApiResponse<boolean>> {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) return { isSuccess: false, data: null, error: error.message };
  return { isSuccess: true, data: true };
}
