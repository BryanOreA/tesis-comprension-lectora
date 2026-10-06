import { writable } from 'svelte/store';

export const progress = writable({
  points: 0,
  level: 'En Inicio',
  badges: [],
  textsRead: 0,
  averageScore: 0
});