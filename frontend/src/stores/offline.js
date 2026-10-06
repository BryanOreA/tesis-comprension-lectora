import { writable } from 'svelte/store';

export const isOnline = writable(navigator.onLine);

window.addEventListener('online', () => isOnline.set(true));
window.addEventListener('offline', () => isOnline.set(false));