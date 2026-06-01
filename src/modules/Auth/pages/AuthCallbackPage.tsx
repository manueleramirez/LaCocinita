import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/infrastructure/supabase/client';
import { useAppDispatch } from '@/shared/hooks/useAppStore';
import { login } from '@/modules/Auth/store/authSlice';
import { toUser } from '@/modules/Auth/services';
import { Spinner } from '@/shared/components/ui/Spinner';

export default function AuthCallbackPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        navigate('/', { replace: true });
        return;
      }

      const user = toUser(session as unknown as Parameters<typeof toUser>[0]);
      dispatch(login(user));
      navigate('/dashboard', { replace: true });
    };

    handleAuthCallback();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const user = toUser(session as unknown as Parameters<typeof toUser>[0]);
        dispatch(login(user));
        navigate('/dashboard', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-[var(--color-text-secondary)]">Completando inicio de sesión...</p>
      </div>
    </div>
  );
}
