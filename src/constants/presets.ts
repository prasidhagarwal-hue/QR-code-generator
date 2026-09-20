import type { QRPreset } from '../types/qr';

/**
 * Four visually distinct QR presets.
 * Each is a Partial<QRCustomization> that merges onto defaults.
 */
export const PRESETS: QRPreset[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'High contrast, professional look',
    icon: '🏛️',
    customization: {
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      errorCorrection: 'M',
      gradient: null,
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark, elegant design',
    icon: '🌙',
    customization: {
      foregroundColor: '#E2E8F0',
      backgroundColor: '#0F172A',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      errorCorrection: 'Q',
      gradient: null,
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Clean, business-oriented',
    icon: '💼',
    customization: {
      foregroundColor: '#1E40AF',
      backgroundColor: '#F8FAFC',
      dotStyle: 'classy-rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      errorCorrection: 'M',
      gradient: null,
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Expressive with gradients',
    icon: '🎨',
    customization: {
      foregroundColor: '#7C3AED',
      backgroundColor: '#FAFAFA',
      dotStyle: 'dots',
      cornerSquareStyle: 'dot',
      cornerDotStyle: 'dot',
      errorCorrection: 'Q',
      gradient: {
        type: 'linear',
        rotation: 135,
        colorStops: ['#7C3AED', '#EC4899'],
      },
    },
  },
];
