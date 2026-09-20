import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types/history';

const THEME_KEY = 'qr-studio-theme';

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return 'dark'; // dark-first default
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const html = document.documentElement;
  html.classList.remove('dark', 'light');
  html.classList.add(resolved);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore write failures
    }
  }, [theme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      // system → dark
      return 'dark';
    });
  }, []);

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  return { theme, resolvedTheme, setTheme, toggleTheme };
}
