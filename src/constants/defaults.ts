import {
  QRType,
  WiFiSecurity,
  type QRCustomization,
  type QRPayload,
  type URLPayload,
  type TextPayload,
  type EmailPayload,
  type PhonePayload,
  type WiFiPayload,
} from '../types/qr';

// ─── Default Customization ─────────────────────────────────────────

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  size: 300,
  foregroundColor: '#000000',
  backgroundColor: '#FFFFFF',
  errorCorrection: 'M',
  margin: 16,
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
  gradient: null,
  logo: null,
};

// ─── Default Payloads (one per type) ────────────────────────────────

export const DEFAULT_PAYLOADS: Record<QRType, QRPayload> = {
  [QRType.URL]: { type: QRType.URL, url: '' } as URLPayload,
  [QRType.TEXT]: { type: QRType.TEXT, text: '' } as TextPayload,
  [QRType.EMAIL]: {
    type: QRType.EMAIL,
    address: '',
    subject: '',
    body: '',
  } as EmailPayload,
  [QRType.PHONE]: { type: QRType.PHONE, number: '' } as PhonePayload,
  [QRType.WIFI]: {
    type: QRType.WIFI,
    ssid: '',
    security: WiFiSecurity.WPA,
    password: '',
    hidden: false,
  } as WiFiPayload,
};

// ─── Limits ─────────────────────────────────────────────────────────

export const LIMITS = {
  MIN_SIZE: 200,
  MAX_SIZE: 1000,
  MIN_MARGIN: 0,
  MAX_MARGIN: 50,
  MAX_TEXT_LENGTH: 4296,
  TEXT_WARNING_LENGTH: 300,
  MAX_LOGO_SIZE: 0.4,
  MIN_CONTRAST_RATIO: 1.5,
  WARN_CONTRAST_RATIO: 3.0,
  MAX_HISTORY_ENTRIES: 50,
  DEBOUNCE_MS: 250,
  HISTORY_THUMBNAIL_SIZE: 120,
} as const;

// ─── Validation Patterns ────────────────────────────────────────────

export const PATTERNS = {
  URL: /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[0-9]{7,15}$/,
  WIFI_SSID_MAX: 32,
  WEP_KEY_LENGTHS: [5, 13, 10, 26],
  WPA_MIN_LENGTH: 8,
  WPA_MAX_LENGTH: 63,
} as const;
