import {
  QRType,
  WiFiSecurity,
  type QRPayload,
  type URLPayload,
  type TextPayload,
  type EmailPayload,
  type PhonePayload,
  type WiFiPayload,
} from '@/types/qr';

// ─── Wi-Fi Special Character Escaping ───────────────────────────────
// Per the ZXing Wi-Fi QR spec, these 5 characters must be escaped
// in SSID and password values: \ ; , " :

function escapeWiFiValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')   // \ → \\ (must be first!)
    .replace(/;/g, '\\;')     // ; → \;
    .replace(/,/g, '\\,')     // , → \,
    .replace(/"/g, '\\"')     // " → \"
    .replace(/:/g, '\\:');    // : → \:
}

// ─── Payload Builders ───────────────────────────────────────────────

function buildURLPayload(payload: URLPayload): string {
  let url = payload.url.trim();
  // Auto-prepend https:// if no protocol is present
  if (url && !/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
}

function buildTextPayload(payload: TextPayload): string {
  return payload.text;
}

function buildEmailPayload(payload: EmailPayload): string {
  const address = payload.address.trim();
  if (!address) return '';

  const params: string[] = [];
  if (payload.subject.trim()) {
    params.push(`subject=${encodeURIComponent(payload.subject.trim())}`);
  }
  if (payload.body.trim()) {
    params.push(`body=${encodeURIComponent(payload.body.trim())}`);
  }

  return params.length > 0
    ? `mailto:${address}?${params.join('&')}`
    : `mailto:${address}`;
}

function buildPhonePayload(payload: PhonePayload): string {
  // Strip everything except digits and leading +
  const cleaned = payload.number.trim().replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  return `tel:${cleaned}`;
}

function buildWiFiPayload(payload: WiFiPayload): string {
  const parts: string[] = [];

  // Authentication type
  parts.push(`T:${payload.security}`);

  // SSID (escaped)
  parts.push(`S:${escapeWiFiValue(payload.ssid)}`);

  // Password (only for WPA/WEP)
  if (payload.security !== WiFiSecurity.NONE && payload.password) {
    parts.push(`P:${escapeWiFiValue(payload.password)}`);
  }

  // Hidden network flag
  if (payload.hidden) {
    parts.push('H:true');
  }

  // Format: WIFI:T:WPA;S:ssid;P:password;H:true;;
  return `WIFI:${parts.join(';')};;`;
}

// ─── Main Dispatcher ────────────────────────────────────────────────

export function buildPayloadString(payload: QRPayload): string {
  switch (payload.type) {
    case QRType.URL:
      return buildURLPayload(payload);
    case QRType.TEXT:
      return buildTextPayload(payload);
    case QRType.EMAIL:
      return buildEmailPayload(payload);
    case QRType.PHONE:
      return buildPhonePayload(payload);
    case QRType.WIFI:
      return buildWiFiPayload(payload);
  }
}

// Export for testing
export { escapeWiFiValue };
