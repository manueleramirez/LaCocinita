import { useEffect, type ReactNode } from 'react';
import { useAppSelector } from '@/shared/hooks/useAppStore';
import { hexToRgba, adjustColor } from './colors';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector((state) => state.config.theme);
  const primaryColor = useAppSelector((state) => state.config.primaryColor);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');

      const listener = (e: MediaQueryListEvent) => {
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-primary-hover', adjustColor(primaryColor, 20));
    root.style.setProperty('--color-primary-light', hexToRgba(primaryColor, 0.1));
    root.style.setProperty('--color-primary-light-solid', adjustColor(primaryColor, 60));
  }, [primaryColor]);

  return <>{children}</>;
}
