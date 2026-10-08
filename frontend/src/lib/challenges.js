// @ts-nocheck
import { writable } from 'svelte/store';

// Definición de retos diarios rotativos
export const DAILY_CHALLENGES = [
  {
    id: 'read_1',
    title: 'Primera lectura del día',
    description: 'Completa 1 texto hoy',
    icon: 'book-open',
    goal: 1,
    type: 'texts',
    points: 20
  },
  {
    id: 'read_2',
    title: 'Doble esfuerzo',
    description: 'Completa 2 textos hoy',
    icon: 'books',
    goal: 2,
    type: 'texts',
    points: 40
  },
  {
    id: 'perfect_today',
    title: 'Precisión perfecta',
    description: 'Obtén 100% en un quiz hoy',
    icon: 'check-circle',
    goal: 1,
    type: 'perfect',
    points: 50
  },
  {
    id: 'read_3',
    title: 'Maratón de lectura',
    description: 'Completa 3 textos hoy',
    icon: 'library',
    goal: 3,
    type: 'texts',
    points: 60
  },
  {
    id: 'fast_reader',
    title: 'Lector veloz',
    description: 'Completa un texto en menos de 3 minutos',
    icon: 'zap',
    goal: 1,
    type: 'fast',
    points: 30
  }
];

// Store con el progreso diario
function createChallengesStore() {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem('dailyChallenges');
  const parsed = stored ? JSON.parse(stored) : null;

  // Si es un día nuevo, reiniciar
  const initial = (parsed && parsed.date === today) ? parsed : {
    date: today,
    textsToday: 0,
    perfectToday: 0,
    fastToday: 0,
    completed: [],
    totalPointsEarned: 0
  };

  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (value) => {
      localStorage.setItem('dailyChallenges', JSON.stringify(value));
      set(value);
    },
    update: (updater) => {
      update(current => {
        const updated = updater(current);
        localStorage.setItem('dailyChallenges', JSON.stringify(updated));
        return updated;
      });
    },
    reset: () => {
      const empty = {
        date: today,
        textsToday: 0,
        perfectToday: 0,
        fastToday: 0,
        completed: [],
        totalPointsEarned: 0
      };
      localStorage.setItem('dailyChallenges', JSON.stringify(empty));
      set(empty);
    }
  };
}

export const dailyChallenges = createChallengesStore();

// Reto del día (rotativo según fecha)
export function getTodayChallenge() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}

// Registrar progreso después de un quiz
export function registerDailyProgress({ score, total, timeSpent }) {
  const today = new Date().toISOString().split('T')[0];
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const timeInMinutes = timeSpent / 60;
  const newlyCompleted = [];

  dailyChallenges.update(current => {
    // Si es otro día, reiniciar
    if (current.date !== today) {
      current = {
        date: today,
        textsToday: 0,
        perfectToday: 0,
        fastToday: 0,
        completed: [],
        totalPointsEarned: 0
      };
    }

    const updated = {
      ...current,
      textsToday: current.textsToday + 1,
      perfectToday: percentage === 100 ? current.perfectToday + 1 : current.perfectToday,
      fastToday: timeInMinutes < 3 ? current.fastToday + 1 : current.fastToday
    };

    // Verificar qué retos se completaron
    for (const challenge of DAILY_CHALLENGES) {
      if (updated.completed.includes(challenge.id)) continue;

      let completed = false;
      if (challenge.type === 'texts' && updated.textsToday >= challenge.goal) completed = true;
      if (challenge.type === 'perfect' && updated.perfectToday >= challenge.goal) completed = true;
      if (challenge.type === 'fast' && updated.fastToday >= challenge.goal) completed = true;

      if (completed) {
        updated.completed = [...updated.completed, challenge.id];
        updated.totalPointsEarned += challenge.points;
        newlyCompleted.push(challenge);
      }
    }

    return updated;
  });

  return newlyCompleted;
}

// Verificar progreso del reto del día
export function getChallengeProgress(challenge, challenges) {
  if (!challenge || !challenges) return 0;

  if (challenge.type === 'texts') {
    return Math.min(challenges.textsToday / challenge.goal, 1);
  }
  if (challenge.type === 'perfect') {
    return Math.min(challenges.perfectToday / challenge.goal, 1);
  }
  if (challenge.type === 'fast') {
    return Math.min(challenges.fastToday / challenge.goal, 1);
  }
  return 0;
}