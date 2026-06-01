import { supabase } from '@/infrastructure/supabase/client';
import type { ConfigState } from './store/configSlice';

interface RawConfig {
  id: number;
  user_id: string;
  workHourlyRate: number;
  profitMargin: number;
  spendMargin: number;
  currency: string;
  tax_rate: number;
  theme: string;
  primary_color: string;
  language: string;
  created_at: string;
  updated_at: string | null;
}

function toState(raw: RawConfig): Partial<ConfigState> {
  return {
    workHourlyRate: raw.workHourlyRate,
    profitMargin: raw.profitMargin,
    spendMargin: raw.spendMargin,
    currency: raw.currency,
    taxRate: raw.tax_rate,
    theme: raw.theme as ConfigState['theme'],
    primaryColor: raw.primary_color,
    language: raw.language,
  };
}

export async function getConfig(userId: string) {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return { isSuccess: false, data: null, error: error.message };
  if (!data) return { isSuccess: true, data: null };
  return { isSuccess: true, data: toState(data as RawConfig) };
}

export async function upsertConfig(userId: string, config: Partial<ConfigState>) {
  const payload: Record<string, unknown> = {
    user_id: userId,
    workHourlyRate: config.workHourlyRate,
    profitMargin: config.profitMargin,
    spendMargin: config.spendMargin,
    currency: config.currency,
    tax_rate: config.taxRate,
    theme: config.theme,
    primary_color: config.primaryColor,
    language: config.language,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('config')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) return { isSuccess: false, data: null, error: error.message };
  return { isSuccess: true, data: toState(data as RawConfig) };
}
