export const BADGES = [
  { id: 'lector_principiante', name: 'Lector Principiante', points: 100, icon: '📖' },
  { id: 'detective_inferencias', name: 'Detective de Inferencias', points: 500, icon: '🔍' },
  { id: 'maestro_comprension', name: 'Maestro de la Comprensión', points: 1000, icon: '🏆' }
];

export function calculateLevel(points) {
  if (points < 300) return 'En Inicio';
  if (points < 800) return 'En Proceso';
  return 'Satisfactorio';
}

export function getNextLevelPoints(currentPoints) {
  if (currentPoints < 300) return 300;
  if (currentPoints < 800) return 800;
  return 1500;
}