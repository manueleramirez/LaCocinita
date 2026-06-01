import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  address: z.string().max(200, 'Máximo 200 caracteres').optional(),
  phone: z.string().regex(/^[+]?[\d\s()-]{7,15}$/, 'Teléfono inválido').optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
