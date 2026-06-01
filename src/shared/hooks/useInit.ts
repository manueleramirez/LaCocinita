import { useEffect, useState } from 'react';
import { supabase } from '@/infrastructure/supabase/client';
import { useAppDispatch } from '@/shared/hooks/useAppStore';
import { login } from '@/modules/Auth/store/authSlice';

function toUser(session: { user: { id: string; email?: string | null; user_metadata?: { name?: string; avatar_url?: string } } }) {
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.user_metadata?.name,
    avatarUrl: session.user.user_metadata?.avatar_url,
  };
}

export function useInit() {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const user = toUser(session as Parameters<typeof toUser>[0]);
        dispatch(login(user));
      }
      setReady(true);
    });
  }, [dispatch]);

  return ready;
}
