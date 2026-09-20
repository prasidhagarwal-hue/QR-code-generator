import {
  QRType,
  WiFiSecurity,
  type QRPayload,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
} from '@/types/qr';
import { PATTERNS, LIMITS } from '@/constants/defaults';

// ─── Helpers ────────────────────────────────────────────────────────

function ok(): ValidationResult {
  return { valid: true, errors: [], warnings: [] };
}

function fail(errors: ValidationError[], warnings: ValidationWarning[] = []): ValidationResult {
  return { valid: false, errors, warnings };
}

function warn(warnings: ValidationWarning[]): ValidationResult {
  return { valid: true, errors: [], warnings };
}

function fieldError(field: string, message: string): ValidationError {
  return { field, message };
}

function fieldWarning(field: string, message: string): ValidationWarning {
  return { field, message };
}

// ─── Validators ─────────────────────────────────────────────────────

function validateURL(url: string): ValidationResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return fail([fieldError('url', 'URL is required')]);
  }
  // Allow URLs with or without protocol for validation
  // We'll auto-prepend https:// in the payload builder
  const testUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    new URL(testUrl);
  } catch {
    return fail([fieldError('url', 'Please enter a valid URL')]);
  }
  if (trimmed.length > LIMITS.MAX_TEXT_LENGTH) {
    return fail([fieldError('url', `URL is too long (max ${LIMITS.MAX_TEXT_LENGTH} characters)`)]);
  }
  return ok();
}

function validateText(text: string): ValidationResult {
  if (!text.trim()) {
    return fail([fieldError('text', 'Text is required')]);
  }
  if (text.length > LIMITS.MAX_TEXT_LENGTH) {
    return fail([fieldError('text', `Text is too long (max ${LIMITS.MAX_TEXT_LENGTH} characters)`)]);
  }
  const warnings: ValidationWarning[] = [];
  if (text.length > LIMITS.TEXT_WARNING_LENGTH) {
    warnings.push(
      fieldWarning('text', `Long text (${text.length} chars) creates a dense QR code that may be harder to scan`)
    );
  }
  return warnings.length > 0 ? warn(warnings) : ok();
}

function validateEmail(address: string, subject?: string, body?: string): ValidationResult {
  const errors: ValidationError[] = [];
  const trimmed = address.trim();

  if (!trimmed) {
    errors.push(fieldError('address', 'Email address is required'));
    return fail(errors);
  }
  if (!PATTERNS.EMAIL.test(trimmed)) {
    errors.push(fieldError('address', 'Please enter a valid email address'));
    return fail(errors);
  }

  const warnings: ValidationWarning[] = [];
  const totalLength = trimmed.length + (subject?.length ?? 0) + (body?.length ?? 0);
  if (totalLength > LIMITS.TEXT_WARNING_LENGTH) {
    warnings.push(
      fieldWarning('body', 'Long email content creates a denser QR code')
    );
  }

  return warnings.length > 0 ? warn(warnings) : ok();
}

function validatePhone(number: string): ValidationResult {
  const trimmed = number.trim();
  if (!trimmed) {
    return fail([fieldError('number', 'Phone number is required')]);
  }
  // Strip formatting characters for validation
  const cleaned = trimmed.replace(/[\s\-().]/g, '');
  if (!PATTERNS.PHONE.test(cleaned)) {
    return fail([fieldError('number', 'Please enter a valid phone number (7–15 digits, optional leading +)')]);
  }
  return ok();
}

function validateWiFi(
  ssid: string,
  security: WiFiSecurity,
  password: string,
  _hidden: boolean
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!ssid.trim()) {
    errors.push(fieldError('ssid', 'Network name (SSID) is required'));
  } else if (ssid.length > PATTERNS.WIFI_SSID_MAX) {
    errors.push(fieldError('ssid', `SSID is too long (max ${PATTERNS.WIFI_SSID_MAX} characters)`));
  }

  if (security === WiFiSecurity.WPA) {
    if (!password) {
      errors.push(fieldError('password', 'Password is required for WPA/WPA2'));
    } else if (password.length < PATTERNS.WPA_MIN_LENGTH) {
      errors.push(fieldError('password', `WPA password must be at least ${PATTERNS.WPA_MIN_LENGTH} characters`));
    } else if (password.length > PATTERNS.WPA_MAX_LENGTH) {
      errors.push(fieldError('password', `WPA password must be at most ${PATTERNS.WPA_MAX_LENGTH} characters`));
    }
  } else if (security === WiFiSecurity.WEP) {
    if (!password) {
      errors.push(fieldError('password', 'Password is required for WEP'));
    } else if (!(PATTERNS.WEP_KEY_LENGTHS as readonly number[]).includes(password.length)) {
      errors.push(
        fieldError(
          'password',
          `WEP key must be exactly ${PATTERNS.WEP_KEY_LENGTHS.join(', ')} characters`
        )
      );
    }
  }
  // For WiFiSecurity.NONE — password is not required

  return errors.length > 0 ? fail(errors) : ok();
}

// ─── Main Dispatcher ────────────────────────────────────────────────

export function validatePayload(payload: QRPayload): ValidationResult {
  switch (payload.type) {
    case QRType.URL:
      return validateURL(payload.url);
    case QRType.TEXT:
      return validateText(payload.text);
    case QRType.EMAIL:
      return validateEmail(payload.address, payload.subject, payload.body);
    case QRType.PHONE:
      return validatePhone(payload.number);
    case QRType.WIFI:
      return validateWiFi(payload.ssid, payload.security, payload.password, payload.hidden);
  }
}

// Named exports for direct testing
export {
  validateURL,
  validateText,
  validateEmail,
  validatePhone,
  validateWiFi,
};
