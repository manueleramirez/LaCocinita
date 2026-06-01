import { z } from 'zod';

export const configSchema = z.object({
  workHourlyRate: z.number().min(0, 'No puede ser negativo').max(1000, 'Valor muy alto'),
  profitMargin: z.number().min(0, 'No puede ser negativo').max(200, 'Máximo 200%'),
  spendMargin: z.number().min(0, 'No puede ser negativo').max(100, 'Máximo 100%'),
  currency: z.string().min(1, 'Selecciona una moneda'),
  taxRate: z.number().min(0, 'No puede ser negativo').max(100, 'Máximo 100%'),
});

export const themeSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color hex inválido'),
});

export type ConfigFormValues = z.infer<typeof configSchema>;
