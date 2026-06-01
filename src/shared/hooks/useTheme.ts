import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useAppStore';
import type { ThemeMode } from '@/types';

export function useTheme() {
  const dispatch = useAppDispatch();
  const { theme, primaryColor } = useAppSelector((state) => state.config);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      import('@/modules/Config/store/configSlice').then(({ setConfig }) => {
        dispatch(setConfig({ theme: mode }));
      });
    },
    [dispatch]
  );

  const setPrimaryColor = useCallback(
    (color: string) => {
      import('@/modules/Config/store/configSlice').then(({ setConfig }) => {
        dispatch(setConfig({ primaryColor: color }));
      });
    },
    [dispatch]
  );

  return { theme, primaryColor, setTheme, setPrimaryColor };
}
