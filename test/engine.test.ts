import { describe, it, expect } from 'vitest';
import { validatePayload } from '../src/lib/validation/validators';
import { buildPayloadString } from '../src/lib/qr/payloads';
import { QRType, WiFiSecurity } from '../src/types/qr';

describe('QR Validation and Payload Generation', () => {
  describe('URL', () => {
    it('validates and builds valid URLs', () => {
      const payload = { type: QRType.URL, url: 'example.com' } as const;
      const res = validatePayload(payload);
      expect(res.valid).toBe(true);
      expect(buildPayloadString(payload)).toBe('https://example.com');
    });

    it('rejects empty URLs', () => {
      const res = validatePayload({ type: QRType.URL, url: '   ' });
      expect(res.valid).toBe(false);
      expect(res.errors[0].field).toBe('url');
    });
  });

  describe('Text', () => {
    it('validates text', () => {
      const payload = { type: QRType.TEXT, text: 'Hello World' } as const;
      expect(validatePayload(payload).valid).toBe(true);
      expect(buildPayloadString(payload)).toBe('Hello World');
    });
  });

  describe('Email', () => {
    it('validates valid emails and builds mailto', () => {
      const payload = { type: QRType.EMAIL, address: 'test@example.com', subject: 'Hello', body: 'World' } as const;
      expect(validatePayload(payload).valid).toBe(true);
      expect(buildPayloadString(payload)).toBe('mailto:test@example.com?subject=Hello&body=World');
    });

    it('rejects invalid emails', () => {
      expect(validatePayload({ type: QRType.EMAIL, address: 'not-an-email', subject: '', body: '' }).valid).toBe(false);
    });
  });

  describe('Phone', () => {
    it('validates and builds phone numbers', () => {
      const payload = { type: QRType.PHONE, number: '+1 (555) 123-4567' } as const;
      expect(validatePayload(payload).valid).toBe(true);
      expect(buildPayloadString(payload)).toBe('tel:+15551234567');
    });
  });

  describe('WiFi', () => {
    it('builds WPA wifi string and escapes properly', () => {
      const payload = { type: QRType.WIFI, ssid: 'MyNetwork', security: WiFiSecurity.WPA, password: 'password123', hidden: false } as const;
      expect(validatePayload(payload).valid).toBe(true);
      expect(buildPayloadString(payload)).toBe('WIFI:T:WPA;S:MyNetwork;P:password123;;');
    });

    it('escapes special characters', () => {
      const payload = { type: QRType.WIFI, ssid: 'My;Network', security: WiFiSecurity.WPA, password: 'pass\\word:123', hidden: true } as const;
      expect(buildPayloadString(payload)).toBe('WIFI:T:WPA;S:My\\;Network;P:pass\\\\word\\:123;H:true;;');
    });

    it('rejects short WPA passwords', () => {
      const payload = { type: QRType.WIFI, ssid: 'MyNetwork', security: WiFiSecurity.WPA, password: 'short', hidden: false } as const;
      expect(validatePayload(payload).valid).toBe(false);
    });
  });
});
