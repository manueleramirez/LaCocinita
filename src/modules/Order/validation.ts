import { z } from 'zod';

export const orderItemSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  unitPrice: z.number().min(0, 'El precio no puede ser negativo'),
  subtotal: z.number().min(0),
});

export const orderSchema = z.object({
  customerName: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Agrega al menos un item a la venta'),
  subtotal: z.number().min(0),
  discount: z.number().min(0, 'No puede ser negativo'),
  tax: z.number().min(0, 'No puede ser negativo'),
  total: z.number().min(0),
  paymentMethod: z.enum(['CASH', 'CARD', 'TRANSFER', 'OTHER'], {
    errorMap: () => ({ message: 'Selecciona un método de pago' }),
  }),
  notes: z.string().optional(),
  orderDate: z.string().min(1, 'La fecha es obligatoria'),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
