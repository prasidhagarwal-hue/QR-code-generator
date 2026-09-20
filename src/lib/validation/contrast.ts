/**
 * Contrast ratio utilities for QR scan reliability warnings.
 *
 * IMPORTANT: These thresholds are HEURISTIC guidance, not QR specification
 * requirements. The WCAG relative luminance formula is used as a reasonable
 * proxy for luminance difference, but QR scanners use image-processing
 * algorithms that may behave differently from this calculation.
 *
 * The only way to confirm scannability is to test with actual scanner devices.
 */

// ─── Color Parsing ──────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return [r, g, b];
}

// ─── Relative Luminance (WCAG 2.1 formula) ─────────────────────────

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ─── Contrast Ratio ─────────────────────────────────────────────────

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Inversion Detection ────────────────────────────────────────────

export function isInverted(fg: string, bg: string): boolean {
  return relativeLuminance(fg) > relativeLuminance(bg);
}
