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
}

export async function syncPendingEvents() {
  const db = await initDB();
  const events = await db.getAll(STORE_NAME);
  const pending = events.filter(e => !e.synced);

  for (const event of pending) {
    try {
      await fetch('http://localhost:8000/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      event.synced = true;
      await db.put(STORE_NAME, event);
    } catch (error) {
      console.warn('Sin conexión, evento en cola:', event.id);
    }
  }
}

window.addEventListener('online', syncPendingEvents);