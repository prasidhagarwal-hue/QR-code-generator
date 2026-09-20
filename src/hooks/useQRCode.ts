import { useEffect, useRef, useMemo } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import { createQRInstance, buildQROptions } from '@/lib/qr/engine';
import type { QRCustomization } from '@/types/qr';
import { useDebounce } from './useDebounce';
import { LIMITS } from '@/constants/defaults';

interface UseQRCodeOptions {
  data: string;
  customization: QRCustomization;
}

export function useQRCode({ data, customization }: UseQRCodeOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<QRCodeStyling | null>(null);

  // Debounce all inputs to prevent excessive re-renders
  const debouncedData = useDebounce(data, LIMITS.DEBOUNCE_MS);
  const debouncedCustomization = useDebounce(customization, LIMITS.DEBOUNCE_MS);

  // Build options from debounced values
  const options = useMemo(
    () => buildQROptions(debouncedData, debouncedCustomization),
    [debouncedData, debouncedCustomization]
  );

  // Initialize QR instance on mount
  useEffect(() => {
    const instance = createQRInstance(options);
    instanceRef.current = instance;

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      instance.append(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
    // Only run on mount — updates happen via .update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update QR code when options change
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update(options);
    }
  }, [options]);

  return { containerRef, instanceRef };
}
