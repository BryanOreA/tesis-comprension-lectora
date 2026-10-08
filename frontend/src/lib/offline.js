import { openDB } from 'idb';

const DB_NAME = 'lectura-offline';
const STORE_NAME = 'pending-events';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

export async function queueEvent(event) {
  const db = await initDB();
  await db.add(STORE_NAME, {
    ...event,
    timestamp: new Date().toISOString(),
    synced: false
  });
  console.log('📥 Evento en cola offline:', event.type);
}

export async function syncPendingEvents() {
  const db = await initDB();
  const events = await db.getAll(STORE_NAME);
  const pending = events.filter(e => !e.synced);

  if (pending.length === 0) return;

  console.log(`🔄 Sincronizando ${pending.length} eventos pendientes...`);

  const token = localStorage.getItem('token');
  for (const event of pending) {
    try {
      const response = await fetch('/api/sync/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(event)
      });
      if (response.ok) {
        event.synced = true;
        await db.put(STORE_NAME, event);
      }
    } catch (error) {
      console.warn('Sin conexión, evento sigue en cola:', event.id);
    }
  }
}

// Detectar cuando vuelve la conexión
window.addEventListener('online', () => {
  console.log('✅ Conexión restaurada, sincronizando...');
  syncPendingEvents();
});

// Intentar sincronizar al cargar si hay conexión
if (navigator.onLine) {
  syncPendingEvents();
}