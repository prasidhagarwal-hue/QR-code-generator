import { create } from 'zustand';
import {
  QRType,
  type QRPayload,
  type QRCustomization,
} from '@/types/qr';
import { DEFAULT_CUSTOMIZATION, DEFAULT_PAYLOADS } from '@/constants/defaults';
import type { Theme, HistoryEntry } from '@/types/history';
import { getHistory, addHistoryEntry, deleteHistoryEntry, clearHistory } from '@/lib/storage/historyDb';

// ─── Store State ────────────────────────────────────────────────────

interface QRStoreState {
  // Content
  activeType: QRType;
  payloads: Record<QRType, QRPayload>;

  // Customization
  customization: QRCustomization;
  activePresetId: string | null;

  // History
  history: HistoryEntry[];
  isHistoryLoading: boolean;

  // UI
  theme: Theme;
  historyOpen: boolean;
}

interface QRStoreActions {
  setActiveType: (type: QRType) => void;
  updatePayload: (payload: Partial<QRPayload>) => void;
  updateCustomization: (changes: Partial<QRCustomization>) => void;
  applyPreset: (presetId: string, customization: Partial<QRCustomization>) => void;
  resetCustomization: () => void;
  setTheme: (theme: Theme) => void;
  toggleHistory: () => void;

  // History Actions
  loadHistory: () => Promise<void>;
  saveToHistory: (entry: HistoryEntry) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  restoreHistoryEntry: (entry: HistoryEntry) => void;
}

type QRStore = QRStoreState & QRStoreActions;

// ─── Store ──────────────────────────────────────────────────────────

export const useQRStore = create<QRStore>((set) => ({
  // Initial state
  activeType: QRType.URL,
  payloads: { ...DEFAULT_PAYLOADS },
  customization: { ...DEFAULT_CUSTOMIZATION },
  activePresetId: null,
  history: [],
  isHistoryLoading: true,
  theme: 'dark',
  historyOpen: false,

  // Actions
  setActiveType: (type) => set({ activeType: type }),

  updatePayload: (partialPayload) =>
    set((state) => {
      const currentPayload = state.payloads[state.activeType];
      return {
        payloads: {
          ...state.payloads,
          [state.activeType]: { ...currentPayload, ...partialPayload },
        },
      };
    }),

  updateCustomization: (changes) =>
    set((state) => ({
      customization: { ...state.customization, ...changes },
      // When user manually changes customization, clear active preset
      activePresetId: null,
    })),

  applyPreset: (presetId, customization) =>
    set((state) => ({
      customization: { ...state.customization, ...customization },
      activePresetId: presetId,
    })),

  resetCustomization: () =>
    set({
      customization: { ...DEFAULT_CUSTOMIZATION },
      activePresetId: null,
    }),

  setTheme: (theme) => set({ theme }),

  toggleHistory: () =>
    set((state) => ({ historyOpen: !state.historyOpen })),

  // ─── History Actions ───

  loadHistory: async () => {
    set({ isHistoryLoading: true });
    try {
      const history = await getHistory();
      set({ history, isHistoryLoading: false });
    } catch (err) {
      console.error('Error loading history:', err);
      set({ isHistoryLoading: false });
    }
  },

  saveToHistory: async (entry) => {
    try {
      await addHistoryEntry(entry);
      // Reload to ensure order and limits are synced with DB
      const history = await getHistory();
      set({ history });
    } catch (err) {
      console.error('Error saving to history:', err);
    }
  },

  deleteFromHistory: async (id) => {
    try {
      await deleteHistoryEntry(id);
      set((state) => ({
        history: state.history.filter((item) => item.id !== id),
      }));
    } catch (err) {
      console.error('Error deleting from history:', err);
    }
  },

  clearAllHistory: async () => {
    try {
      await clearHistory();
      set({ history: [] });
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  },

  restoreHistoryEntry: (entry) => {
    set((state) => ({
      activeType: entry.qrType,
      payloads: {
        ...state.payloads,
        [entry.qrType]: entry.payload,
      },
      customization: entry.customization,
      activePresetId: null,
    }));
  },
}));
