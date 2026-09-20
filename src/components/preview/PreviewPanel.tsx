import { useMemo, useCallback, useState } from 'react';
import { useQRStore } from '@/store/qrStore';
import { useQRCode } from '@/hooks/useQRCode';
import { buildPayloadString } from '@/lib/qr/payloads';
import { validatePayload } from '@/lib/validation/validators';
import { downloadQR, downloadSVG, generateThumbnail } from '@/lib/qr/engine';
import { contrastRatio, isInverted } from '@/lib/validation/contrast';
import { Download, Copy, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/common';
import { type ScanWarning, QRType, WiFiSecurity } from '@/types/qr';
import { CURRENT_SCHEMA_VERSION, type HistoryEntry } from '@/types/history';

// ─── Scan Warnings ──────────────────────────────────────────────────

function useScanWarnings(): ScanWarning[] {
  const customization = useQRStore((s) => s.customization);

  return useMemo(() => {
    const warnings: ScanWarning[] = [];

    // Contrast check
    const ratio = contrastRatio(customization.foregroundColor, customization.backgroundColor);
    if (ratio < 1.5) {
      warnings.push({
        id: 'contrast-danger',
        level: 'danger',
        title: 'Very low contrast',
        message: `Contrast ratio ${ratio.toFixed(1)}:1. This QR code is likely unreadable by most scanners.`,
      });
    } else if (ratio < 3) {
      warnings.push({
        id: 'contrast-warning',
        level: 'warning',
        title: 'Low contrast',
        message: `Contrast ratio ${ratio.toFixed(1)}:1. This may reduce scan reliability on some devices.`,
      });
    }

    // Inverted colors
    if (isInverted(customization.foregroundColor, customization.backgroundColor)) {
      warnings.push({
        id: 'inverted',
        level: 'info',
        title: 'Inverted colors',
        message: 'Light foreground on dark background. Some older scanners may not support this.',
      });
    }

    // Logo warnings
    if (customization.logo) {
      if (customization.logo.size > 0.3) {
        warnings.push({
          id: 'logo-large',
          level: 'warning',
          title: 'Large logo',
          message: 'Logo exceeds recommended size. Scan reliability is not guaranteed even with High error correction.',
        });
      } else if (customization.logo.size > 0.2) {
        warnings.push({
          id: 'logo-medium',
          level: 'info',
          title: 'Logo size note',
          message: 'Consider using Error Correction: High when embedding logos.',
        });
      }

      if (customization.errorCorrection !== 'H') {
        warnings.push({
          id: 'logo-ec',
          level: 'warning',
          title: 'Logo without High EC',
          message: 'Logo embedding covers QR data modules. Switching to Error Correction: High is recommended.',
        });
      }
    }

    return warnings;
  }, [customization]);
}

function ScanWarnings() {
  const warnings = useScanWarnings();

  if (warnings.length === 0) return null;

  const iconMap = {
    info: <Info size={14} className="text-[var(--color-info)] shrink-0" />,
    warning: <AlertTriangle size={14} className="text-[var(--color-warning)] shrink-0" />,
    danger: <AlertTriangle size={14} className="text-[var(--color-danger)] shrink-0" />,
  };

  const bgMap = {
    info: 'bg-[var(--color-info)]/10 border-[var(--color-info)]/20',
    warning: 'bg-[var(--color-warning)]/10 border-[var(--color-warning)]/20',
    danger: 'bg-[var(--color-danger)]/10 border-[var(--color-danger)]/20',
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[400px]">
      {warnings.map((w) => (
        <div
          key={w.id}
          className={`flex items-start gap-2 px-3 py-2 rounded-[var(--radius-md)] border text-xs ${bgMap[w.level]}`}
        >
          {iconMap[w.level]}
          <div>
            <span className="font-medium text-[var(--color-text-primary)]">{w.title}: </span>
            <span className="text-[var(--color-text-secondary)]">{w.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Preview Panel ──────────────────────────────────────────────────

export function PreviewPanel() {
  const activeType = useQRStore((s) => s.activeType);
  const payload = useQRStore((s) => s.payloads[s.activeType]);
  const customization = useQRStore((s) => s.customization);
  const saveToHistory = useQRStore((s) => s.saveToHistory);
  const [copySuccess, setCopySuccess] = useState(false);

  const validation = useMemo(() => validatePayload(payload), [payload]);
  const dataString = useMemo(() => buildPayloadString(payload), [payload]);

  const { containerRef, instanceRef } = useQRCode({
    data: dataString,
    customization,
  });

  const handleSaveHistory = useCallback(async () => {
    try {
      const thumbnailDataUrl = await generateThumbnail(dataString, customization);

      // Scrub sensitive data (Wi-Fi passwords) by default for history
      let historyPayload = { ...payload };
      let sensitiveDataStored = true;

      if (
        historyPayload.type === QRType.WIFI &&
        historyPayload.security !== WiFiSecurity.NONE
      ) {
        historyPayload = { ...historyPayload, password: '' };
        sensitiveDataStored = false;
      }

      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        qrType: activeType,
        payload: historyPayload,
        customization,
        thumbnailDataUrl,
        sensitiveDataStored,
        schemaVersion: CURRENT_SCHEMA_VERSION,
      };

      await saveToHistory(entry);
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  }, [dataString, customization, payload, activeType, saveToHistory]);

  const handleDownloadPNG = useCallback(async () => {
    if (!instanceRef.current) return;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    await downloadQR(instanceRef.current, `qr-studio-${activeType}-${timestamp}`, 'png');
    await handleSaveHistory();
  }, [instanceRef, activeType, handleSaveHistory]);

  const handleDownloadSVG = useCallback(async () => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    await downloadSVG(dataString, customization, `qr-studio-${activeType}-${timestamp}`);
    await handleSaveHistory();
  }, [dataString, customization, activeType, handleSaveHistory]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!instanceRef.current) return;
    try {
      const blob = await instanceRef.current.getRawData('png');
      if (!blob || !navigator.clipboard?.write) return;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob as Blob }),
      ]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  }, [instanceRef]);

  const hasContent = dataString.trim().length > 0;
  const isValid = validation.valid;
  const canDownload = hasContent && isValid;

  return (
    <div className="flex flex-col items-center gap-4 py-4 lg:py-8">
      {/* QR Canvas */}
      <div
        className="
          flex items-center justify-center
          w-full max-w-[400px] aspect-square
          rounded-[var(--radius-xl)]
          bg-[var(--color-qr-canvas-bg)]
          border border-[var(--color-qr-canvas-border)]
          shadow-[0_8px_32px_var(--color-qr-canvas-shadow)]
          p-6 overflow-hidden
          transition-shadow duration-[var(--transition-slow)]
          hover:shadow-[0_12px_48px_var(--color-qr-canvas-shadow)]
        "
      >
        <div
          ref={containerRef}
          className="flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:h-auto"
        />
      </div>

      {/* Scan Warnings */}
      <ScanWarnings />

      {/* Download Actions */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="primary"
          size="lg"
          icon={<Download size={16} />}
          onClick={handleDownloadPNG}
          disabled={!canDownload}
        >
          Download PNG
        </Button>

        <Button
          variant="secondary"
          size="lg"
          icon={<Download size={16} />}
          onClick={handleDownloadSVG}
          disabled={!canDownload}
        >
          SVG
        </Button>

        {typeof navigator !== 'undefined' && !!navigator.clipboard?.write && (
          <Button
            variant="ghost"
            size="lg"
            icon={
              copySuccess ? (
                <CheckCircle size={16} className="text-[var(--color-success)]" />
              ) : (
                <Copy size={16} />
              )
            }
            onClick={handleCopyToClipboard}
            disabled={!canDownload}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </div>

      {/* Validation Errors */}
      {!isValid && hasContent && (
        <div className="text-xs text-[var(--color-text-tertiary)] text-center">
          Fix validation errors to enable download
        </div>
      )}
    </div>
  );
}
