import { supabase } from '@/infrastructure/supabase/client';
import type { LoginFormValues, RegisterFormValues } from './types';

function toUser(session: { user: { id: string; email?: string | null; user_metadata?: { name?: string; avatar_url?: string } } }) {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.name,
    avatarUrl: session.user.user_metadata?.avatar_url,
  };
}

export async function signInWithEmail(values: LoginFormValues) {
  const { data, error } = await supabase.auth.signInWithPassword(values);
  if (error) return { isSuccess: false, data: null, error: error.message };
  return { isSuccess: true, data: toUser(data.session! as unknown as Parameters<typeof toUser>[0]) };
}

export async function signUpWithEmail(values: RegisterFormValues) {
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });
  if (error) return { isSuccess: false, data: null, error: error.message };
  if (!data.session) return { isSuccess: true, data: null, error: undefined };
  return { isSuccess: true, data: toUser(data.session as unknown as Parameters<typeof toUser>[0]) };
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) return { isSuccess: false, data: null, error: error.message };
  return { isSuccess: true, data: null };
}

export async function forgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) return { isSuccess: false, error: error.message };
  return { isSuccess: true };
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { isSuccess: false, error: error.message };
  return { isSuccess: true };
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return { isSuccess: false, data: null };
  return { isSuccess: true, data: toUser(session as unknown as Parameters<typeof toUser>[0]) };
}

export { toUser };
