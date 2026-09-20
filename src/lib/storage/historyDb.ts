import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { HistoryEntry } from '@/types/history';

const DB_NAME = 'qr-studio-db';
const STORE_NAME = 'history';
const MAX_HISTORY_ITEMS = 50;
const DB_VERSION = 1;

interface QRStudioDB extends DBSchema {
  history: {
    key: string;
    value: HistoryEntry;
    indexes: {
      'by-date': number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<QRStudioDB>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<QRStudioDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-date', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const db = await getDB();
  if (!db) return [];
  try {
    // Get all items sorted by date (newest first)
    const items = await db.getAllFromIndex(STORE_NAME, 'by-date');
    return items.reverse(); // getAllFromIndex returns ascending by default
  } catch (err) {
    console.error('Failed to load history:', err);
    return [];
  }
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<void> {
  const db = await getDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await store.put(entry);

    // Enforce max items
    const count = await store.count();
    if (count > MAX_HISTORY_ITEMS) {
      // Get the oldest items
      const items = await store.index('by-date').getAll(null, count - MAX_HISTORY_ITEMS);
      for (const item of items) {
        await store.delete(item.id);
      }
    }

    await tx.done;
  } catch (err) {
    console.error('Failed to save history entry:', err);
  }
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  try {
    await db.delete(STORE_NAME, id);
  } catch (err) {
    console.error('Failed to delete history entry:', err);
  }
}

export async function clearHistory(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  try {
    await db.clear(STORE_NAME);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}
