import { useMemo, useCallback } from 'react';
import { useQRStore } from '@/store/qrStore';
import { QRType, WiFiSecurity } from '@/types/qr';
import { validatePayload } from '@/lib/validation/validators';
import { Input, Select, Toggle } from '@/components/common';

// ─── Individual Form Components ─────────────────────────────────────

function URLForm() {
  const payload = useQRStore((s) => s.payloads[QRType.URL]);
  const update = useQRStore((s) => s.updatePayload);
  const validation = useMemo(() => validatePayload(payload), [payload]);
  const urlError = validation.errors.find((e) => e.field === 'url');

  if (payload.type !== QRType.URL) return null;

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="URL"
        placeholder="https://example.com"
        value={payload.url}
        onChange={(e) => update({ url: e.target.value })}
        error={payload.url.trim() ? urlError?.message : undefined}
        hint="Enter a website URL. https:// will be added automatically if missing."
      />
    </div>
  );
}

function TextForm() {
  const payload = useQRStore((s) => s.payloads[QRType.TEXT]);
  const update = useQRStore((s) => s.updatePayload);
  const validation = useMemo(() => validatePayload(payload), [payload]);
  const textError = validation.errors.find((e) => e.field === 'text');
  const textWarning = validation.warnings.find((w) => w.field === 'text');

  if (payload.type !== QRType.TEXT) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="text-input"
          className="text-xs font-medium text-[var(--color-text-secondary)]"
        >
          Text Content
        </label>
        <textarea
          id="text-input"
          placeholder="Enter any text..."
          value={payload.text}
          onChange={(e) => update({ text: e.target.value })}
          rows={4}
          className={`
            w-full px-3 py-2 text-sm resize-y min-h-[80px]
            bg-[var(--color-bg-primary)]
            text-[var(--color-text-primary)]
            border rounded-[var(--radius-md)]
            placeholder:text-[var(--color-text-disabled)]
            transition-colors duration-[var(--transition-fast)]
            focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]
            ${textError
              ? 'border-[var(--color-danger)]'
              : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]'
            }
          `}
        />
        {payload.text.trim() && textError && (
          <p className="text-xs text-[var(--color-danger)]" role="alert">{textError.message}</p>
        )}
        {textWarning && (
          <p className="text-xs text-[var(--color-warning)]">{textWarning.message}</p>
        )}
        <p className="text-xs text-[var(--color-text-tertiary)] text-right">
          {payload.text.length} / 4296
        </p>
      </div>
    </div>
  );
}

function EmailForm() {
  const payload = useQRStore((s) => s.payloads[QRType.EMAIL]);
  const update = useQRStore((s) => s.updatePayload);
  const validation = useMemo(() => validatePayload(payload), [payload]);
  const addressError = validation.errors.find((e) => e.field === 'address');

  if (payload.type !== QRType.EMAIL) return null;

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={payload.address}
        onChange={(e) => update({ address: e.target.value })}
        error={payload.address.trim() ? addressError?.message : undefined}
      />
      <Input
        label="Subject"
        placeholder="Optional subject line"
        value={payload.subject}
        onChange={(e) => update({ subject: e.target.value })}
        hint="Optional"
      />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email-body"
          className="text-xs font-medium text-[var(--color-text-secondary)]"
        >
          Message Body
        </label>
        <textarea
          id="email-body"
          placeholder="Optional message body"
          value={payload.body}
          onChange={(e) => update({ body: e.target.value })}
          rows={3}
          className="
            w-full px-3 py-2 text-sm resize-y min-h-[60px]
            bg-[var(--color-bg-primary)]
            text-[var(--color-text-primary)]
            border border-[var(--color-border-primary)] rounded-[var(--radius-md)]
            placeholder:text-[var(--color-text-disabled)]
            transition-colors duration-[var(--transition-fast)]
            focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]
            hover:border-[var(--color-border-secondary)]
          "
        />
        <p className="text-xs text-[var(--color-text-tertiary)]">Optional</p>
      </div>
    </div>
  );
}

function PhoneForm() {
  const payload = useQRStore((s) => s.payloads[QRType.PHONE]);
  const update = useQRStore((s) => s.updatePayload);
  const validation = useMemo(() => validatePayload(payload), [payload]);
  const phoneError = validation.errors.find((e) => e.field === 'number');

  if (payload.type !== QRType.PHONE) return null;

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 123-4567"
        value={payload.number}
        onChange={(e) => update({ number: e.target.value })}
        error={payload.number.trim() ? phoneError?.message : undefined}
        hint="International format recommended (e.g., +91 98765 43210)"
      />
    </div>
  );
}

function WiFiForm() {
  const payload = useQRStore((s) => s.payloads[QRType.WIFI]);
  const update = useQRStore((s) => s.updatePayload);
  const validation = useMemo(() => validatePayload(payload), [payload]);

  if (payload.type !== QRType.WIFI) return null;

  const ssidError = validation.errors.find((e) => e.field === 'ssid');
  const passwordError = validation.errors.find((e) => e.field === 'password');
  const showPassword = payload.security !== WiFiSecurity.NONE;

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Network Name (SSID)"
        placeholder="MyWiFiNetwork"
        value={payload.ssid}
        onChange={(e) => update({ ssid: e.target.value })}
        error={payload.ssid.trim() ? ssidError?.message : undefined}
      />

      <Select
        label="Security Type"
        value={payload.security}
        onChange={(e) => update({ security: e.target.value as WiFiSecurity })}
        options={[
          { value: WiFiSecurity.WPA, label: 'WPA / WPA2 / WPA3' },
          { value: WiFiSecurity.WEP, label: 'WEP' },
          { value: WiFiSecurity.NONE, label: 'Open (No Password)' },
        ]}
      />

      {showPassword && (
        <Input
          label="Password"
          type="password"
          placeholder="Enter network password"
          value={payload.password}
          onChange={(e) => update({ password: e.target.value })}
          error={payload.password ? passwordError?.message : undefined}
        />
      )}

      <Toggle
        label="Hidden Network"
        checked={payload.hidden}
        onChange={(checked) => update({ hidden: checked })}
      />
    </div>
  );
}

// ─── Editor Panel ───────────────────────────────────────────────────

export function EditorPanel() {
  const activeType = useQRStore((s) => s.activeType);

  const renderForm = useCallback(() => {
    switch (activeType) {
      case QRType.URL:
        return <URLForm />;
      case QRType.TEXT:
        return <TextForm />;
      case QRType.EMAIL:
        return <EmailForm />;
      case QRType.PHONE:
        return <PhoneForm />;
      case QRType.WIFI:
        return <WiFiForm />;
    }
  }, [activeType]);

  return renderForm();
}
