// ─── QR Content Types ───────────────────────────────────────────────

export enum QRType {
  URL = 'url',
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  WIFI = 'wifi',
}

export const QR_TYPE_LABELS: Record<QRType, string> = {
  [QRType.URL]: 'URL',
  [QRType.TEXT]: 'Text',
  [QRType.EMAIL]: 'Email',
  [QRType.PHONE]: 'Phone',
  [QRType.WIFI]: 'Wi-Fi',
};

// ─── Payload Types (Discriminated Union) ────────────────────────────

export interface URLPayload {
  type: QRType.URL;
  url: string;
}

export interface TextPayload {
  type: QRType.TEXT;
  text: string;
}

export interface EmailPayload {
  type: QRType.EMAIL;
  address: string;
  subject: string;
  body: string;
}

export interface PhonePayload {
  type: QRType.PHONE;
  number: string;
}

export enum WiFiSecurity {
  WPA = 'WPA',
  WEP = 'WEP',
  NONE = 'nopass',
}

export interface WiFiPayload {
  type: QRType.WIFI;
  ssid: string;
  security: WiFiSecurity;
  password: string;
  hidden: boolean;
}

export type QRPayload =
  | URLPayload
  | TextPayload
  | EmailPayload
  | PhonePayload
  | WiFiPayload;

// ─── Customization Types ────────────────────────────────────────────

export type DotStyle =
  | 'square'
  | 'dots'
  | 'rounded'
  | 'extra-rounded'
  | 'classy'
  | 'classy-rounded';

export type CornerSquareStyle = 'square' | 'dot' | 'extra-rounded';
export type CornerDotStyle = 'square' | 'dot';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface GradientConfig {
  type: 'linear' | 'radial';
  rotation: number; // degrees (0–360)
  colorStops: [string, string]; // [startHex, endHex]
}

export interface LogoConfig {
  dataUri: string;
  size: number; // 0.1–0.4 coefficient
  margin: number; // px
  hideBackgroundDots: boolean;
}

export interface QRCustomization {
  // Core (mandatory controls)
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrection: ErrorCorrectionLevel;
  margin: number;

  // Extended styling (qr-code-styling features)
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  gradient: GradientConfig | null;
  logo: LogoConfig | null;
}

// ─── Preset Types ───────────────────────────────────────────────────

export interface QRPreset {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon identifier
  customization: Partial<QRCustomization>;
}

// ─── Validation Types ───────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// ─── Scan Reliability Types ─────────────────────────────────────────

export type ScanWarningLevel = 'info' | 'warning' | 'danger';

export interface ScanWarning {
  id: string;
  level: ScanWarningLevel;
  title: string;
  message: string;
}
