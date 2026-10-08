import { writable } from 'svelte/store';

function createThemeStore() {
  const stored = localStorage.getItem('theme') || 'light';
  const { subscribe, set } = writable(stored);

  // Aplicar tema inicial
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', stored);
  }

  return {
    subscribe,
    toggle: () => {
      const current = localStorage.getItem('theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      set(next);
    },
    set: (theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      set(theme);
    }
  };
}

export const theme = createThemeStore();