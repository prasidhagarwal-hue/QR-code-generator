import type { QRPayload, QRCustomization, QRType } from './qr';

// ─── History Entry ──────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  createdAt: number; // Date.now() timestamp
  qrType: QRType;
  payload: QRPayload;
  customization: QRCustomization;
  thumbnailDataUrl: string; // base64 PNG data URI for display
  /** Whether the full payload (including sensitive fields like Wi-Fi passwords) is stored */
  sensitiveDataStored: boolean;
  schemaVersion: number;
}

export const CURRENT_SCHEMA_VERSION = 1;

// ─── Theme Types ────────────────────────────────────────────────────

export type Theme = 'dark' | 'light' | 'system';
