import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAppDispatch } from '@/shared/hooks/useAppStore';
import routesConfig from '@/app/routes';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuRoutes = routesConfig
    .filter((r) => r.showInMenu && r.isProtected)
    .map((r) => ({
      path: r.path,
      label: r.label ?? '',
      icon: r.icon,
    }));

  const handleLogout = async () => {
    const { supabase } = await import('@/infrastructure/supabase/client');
    await supabase.auth.signOut();
    dispatch({ type: 'auth/logout' });
    navigate('/');
  };

  const currentRoute = routesConfig.find((r) => window.location.pathname.startsWith(r.path));

  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        routes={menuRoutes}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={currentRoute?.label}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
