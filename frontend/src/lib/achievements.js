import { writable, get } from 'svelte/store';

// ============================
// DEFINICIÓN DE LOGROS
// ============================
export const ACHIEVEMENTS = [
  { id: 'first_text', name: 'Primer Paso', description: 'Completa tu primer texto', icon: 'book-open', points: 50, rarity: 'common', condition: (s) => s.textsRead >= 1 },
  { id: 'first_quiz', name: 'Iniciado', description: 'Responde tu primer quiz', icon: 'pencil', points: 30, rarity: 'common', condition: (s) => s.quizzesDone >= 1 },
  { id: 'texts_5', name: 'Lector Curioso', description: 'Completa 5 textos', icon: 'books', points: 100, rarity: 'common', condition: (s) => s.textsRead >= 5 },
  { id: 'texts_10', name: 'Ratón de Biblioteca', description: 'Completa 10 textos', icon: 'book', points: 250, rarity: 'rare', condition: (s) => s.textsRead >= 10 },
  { id: 'texts_25', name: 'Devorador de Libros', description: 'Completa 25 textos', icon: 'library', points: 500, rarity: 'epic', condition: (s) => s.textsRead >= 25 },
  { id: 'texts_50', name: 'Maestro Lector', description: 'Completa 50 textos', icon: 'graduation', points: 1000, rarity: 'legendary', condition: (s) => s.textsRead >= 50 },
  { id: 'perfect_first', name: 'Perfecto', description: 'Obtén 100% en un quiz', icon: 'check-circle', points: 150, rarity: 'rare', condition: (s) => s.perfectScores >= 1 },
  { id: 'perfect_5', name: 'Impecable', description: 'Obtén 100% en 5 quizzes', icon: 'star', points: 400, rarity: 'epic', condition: (s) => s.perfectScores >= 5 },
  { id: 'perfect_10', name: 'Sin Fallas', description: 'Obtén 100% en 10 quizzes', icon: 'stars', points: 800, rarity: 'legendary', condition: (s) => s.perfectScores >= 10 },
  { id: 'streak_3', name: 'En Racha', description: '3 días consecutivos leyendo', icon: 'flame', points: 100, rarity: 'common', condition: (s) => s.currentStreak >= 3 },
  { id: 'streak_7', name: 'Semana Perfecta', description: '7 días consecutivos leyendo', icon: 'flame-triple', points: 300, rarity: 'rare', condition: (s) => s.currentStreak >= 7 },
  { id: 'streak_30', name: 'Imparable', description: '30 días consecutivos leyendo', icon: 'flame-triple', points: 1000, rarity: 'legendary', condition: (s) => s.currentStreak >= 30 },
  { id: 'level_proceso', name: 'Subiendo', description: 'Alcanza el nivel "En Proceso"', icon: 'trending-up', points: 200, rarity: 'rare', condition: (s) => s.level === 'En Proceso' || s.level === 'Satisfactorio' },
  { id: 'level_satisfactorio', name: 'Experto', description: 'Alcanza el nivel "Satisfactorio"', icon: 'trophy', points: 500, rarity: 'epic', condition: (s) => s.level === 'Satisfactorio' },
  { id: 'points_500', name: 'Coleccionista', description: 'Acumula 500 puntos', icon: 'gem', points: 50, rarity: 'common', condition: (s) => s.points >= 500 },
  { id: 'points_1000', name: 'Millonario', description: 'Acumula 1000 puntos', icon: 'gems', points: 100, rarity: 'rare', condition: (s) => s.points >= 1000 },
  { id: 'points_5000', name: 'Leyenda', description: 'Acumula 5000 puntos', icon: 'crown', points: 500, rarity: 'legendary', condition: (s) => s.points >= 5000 },
];

// ============================
// STORE DE LOGROS DESBLOQUEADOS
// ============================
function createAchievementsStore() {
  const stored = localStorage.getItem('achievements');
  const initial = stored ? JSON.parse(stored) : [];
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (value) => {
      localStorage.setItem('achievements', JSON.stringify(value));
      set(value);
    },
    unlock: (achievementId) => {
      update(current => {
        if (current.includes(achievementId)) return current;
        const updated = [...current, achievementId];
        localStorage.setItem('achievements', JSON.stringify(updated));
        return updated;
      });
    },
    reset: () => {
      localStorage.removeItem('achievements');
      set([]);
    }
  };
}

export const unlockedAchievements = createAchievementsStore();

// ============================
// STORE DE ESTADÍSTICAS
// ============================
function createStatsStore() {
  const stored = localStorage.getItem('studentStats');
  const initial = stored ? JSON.parse(stored) : {
    textsRead: 0,
    quizzesDone: 0,
    perfectScores: 0,
    currentStreak: 0,
    lastReadDate: null,
    points: 0,
    level: 'En Inicio',
  };
  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (value) => {
      localStorage.setItem('studentStats', JSON.stringify(value));
      set(value);
    },
    update: (updater) => {
      update(current => {
        const updated = updater(current);
        localStorage.setItem('studentStats', JSON.stringify(updated));
        return updated;
      });
    },
    reset: () => {
      const empty = { textsRead: 0, quizzesDone: 0, perfectScores: 0, currentStreak: 0, lastReadDate: null, points: 0, level: 'En Inicio' };
      localStorage.removeItem('studentStats');
      set(empty);
    }
  };
}

export const studentStats = createStatsStore();

// ============================
// COMPROBAR LOGROS NUEVOS
// ============================
export function checkAchievements() {
  const stats = get(studentStats);
  const unlocked = get(unlockedAchievements);
  const newUnlocks = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
      unlockedAchievements.unlock(achievement.id);
      newUnlocks.push(achievement);
    }
  }

  return newUnlocks;
}

// ============================
// ACTUALIZAR STATS DESPUÉS DE UN QUIZ
// ============================
export function updateStatsAfterQuiz({ score, total, points, newLevel }) {
  const today = new Date().toISOString().split('T')[0];

  studentStats.update(s => {
    let streak = s.currentStreak;
    if (s.lastReadDate) {
      const lastDate = new Date(s.lastReadDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) streak += 1;
      else if (diffDays > 1) streak = 1;
    } else {
      streak = 1;
    }

    const percentage = (total > 0) ? (score / total) * 100 : 0;

    return {
      ...s,
      textsRead: s.textsRead + 1,
      quizzesDone: s.quizzesDone + 1,
      perfectScores: percentage === 100 ? s.perfectScores + 1 : s.perfectScores,
      currentStreak: streak,
      lastReadDate: today,
      points: s.points + points,
      level: newLevel,
    };
  });

  return checkAchievements();
}

// ============================
// UTILIDADES VISUALES
// ============================
export function getRarityColor(rarity) {
  const colors = {
    common: { bg: '#E8F6F4', color: '#2A9D8F', border: '#A9DDD6' },
    rare: { bg: '#E8F3F6', color: '#176B87', border: '#A8CED9' },
    epic: { bg: '#F0ECF7', color: '#7257A5', border: '#C9BCE0' },
    legendary: { bg: '#FFF7DC', color: '#B8860B', border: '#EBD27A' },
  };
  return colors[rarity] || colors.common;
}

export function getRarityLabel(rarity) {
  const labels = {
    common: 'Común',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Legendario',
  };
  return labels[rarity] || 'Común';
}