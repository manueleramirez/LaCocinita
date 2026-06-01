import { NavLink } from 'react-router-dom';
import { IoLogOutOutline, IoClose } from 'react-icons/io5';
import type { ReactNode } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  routes: Array<{
    path: string;
    label: string;
    icon: ReactNode;
  }>;
}

export function Sidebar({ isOpen, onClose, onLogout, routes }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-bg-card)] border-r border-[var(--color-border)]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
            <h1 className="text-xl font-bold text-[var(--color-primary)]">LaCocinita</h1>
            <button onClick={onClose} className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              <IoClose size={24} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {routes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]'
                  }`
                }
              >
                <span className="text-lg">{route.icon}</span>
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-4 border-t border-[var(--color-border)]">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
                text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-error)]
                transition-colors"
            >
              <IoLogOutOutline size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
