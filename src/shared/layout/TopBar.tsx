import { IoMenuOutline, IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { useTheme } from '@/shared/hooks/useTheme';

interface TopBarProps {
  onMenuToggle: () => void;
  title?: string;
}

export function TopBar({ onMenuToggle, title }: TopBarProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border)] lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
        >
          <IoMenuOutline size={24} />
        </button>
        {title && <h1 className="text-lg font-semibold text-[var(--color-text)]">{title}</h1>}
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] transition-colors"
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        {theme === 'dark' ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
      </button>
    </header>
  );
}
