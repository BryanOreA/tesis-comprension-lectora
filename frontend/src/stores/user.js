import { writable } from 'svelte/store';

function createUserStore() {
  const stored = localStorage.getItem('user');
  const initial = stored ? JSON.parse(stored) : null;
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (value) => {
      if (value) localStorage.setItem('user', JSON.stringify(value));
      else localStorage.removeItem('user');
      set(value);
    },
    update
  };
}

export const user = createUserStore();