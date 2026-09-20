import QRCodeStyling from 'qr-code-styling';
import type { Options as QRCodeStylingOptions } from 'qr-code-styling';
import type { QRCustomization } from '@/types/qr';

// ─── Convert our customization model → qr-code-styling options ──────

export function buildQROptions(
  data: string,
  customization: QRCustomization,
  renderType: 'canvas' | 'svg' = 'canvas'
): QRCodeStylingOptions {
  const options: QRCodeStylingOptions = {
    type: renderType,
    data: data || ' ', // Library requires non-empty data
    width: customization.size,
    height: customization.size,
    margin: customization.margin,
    qrOptions: {
      errorCorrectionLevel: customization.errorCorrection,
    },
    dotsOptions: {
      type: customization.dotStyle,
      ...(customization.gradient
        ? {
            gradient: {
              type: customization.gradient.type,
              rotation: (customization.gradient.rotation * Math.PI) / 180, // degrees → radians
              colorStops: [
                { offset: 0, color: customization.gradient.colorStops[0] },
                { offset: 1, color: customization.gradient.colorStops[1] },
              ],
            },
          }
        : { color: customization.foregroundColor }),
    },
    cornersSquareOptions: {
      type: customization.cornerSquareStyle,
      color: customization.foregroundColor,
    },
    cornersDotOptions: {
      type: customization.cornerDotStyle,
      color: customization.foregroundColor,
    },
    backgroundOptions: {
      color: customization.backgroundColor,
    },
  };

  // Logo embedding
  if (customization.logo) {
    options.image = customization.logo.dataUri;
    options.imageOptions = {
      imageSize: customization.logo.size,
      margin: customization.logo.margin,
      hideBackgroundDots: customization.logo.hideBackgroundDots,
      crossOrigin: 'anonymous',
    };
  }

  return options;
}

// ─── Factory ────────────────────────────────────────────────────────

export function createQRInstance(options: QRCodeStylingOptions): QRCodeStyling {
  return new QRCodeStyling(options);
}

// ─── Export helpers ──────────────────────────────────────────────────

export async function downloadQR(
  instance: QRCodeStyling,
  filename: string,
  extension: 'png' | 'svg' = 'png'
): Promise<void> {
  await instance.download({ name: filename, extension });
}

export async function getQRBlob(
  instance: QRCodeStyling,
  extension: 'png' | 'svg' = 'png'
): Promise<Blob | null> {
  const data = await instance.getRawData(extension);
  if (!data) return null;
  // getRawData returns Blob in browser
  return data as Blob;
}

/**
 * Creates a temporary off-screen SVG instance for SVG export.
 * Required because canvas instances cannot produce true vector SVG output.
 */
export async function downloadSVG(
  data: string,
  customization: QRCustomization,
  filename: string
): Promise<void> {
  const svgOptions = buildQROptions(data, customization, 'svg');
  const svgInstance = new QRCodeStyling(svgOptions);

  // The library requires a DOM element to render into
  const offscreen = document.createElement('div');
  offscreen.style.position = 'fixed';
  offscreen.style.left = '-9999px';
  offscreen.style.top = '-9999px';
  offscreen.style.visibility = 'hidden';
  document.body.appendChild(offscreen);

  try {
    svgInstance.append(offscreen);
    await svgInstance.download({ name: filename, extension: 'svg' });
  } finally {
    document.body.removeChild(offscreen);
  }
}

/**
 * Generate a thumbnail data URL at a reduced size for history storage.
 */
export async function generateThumbnail(
  data: string,
  customization: QRCustomization,
  thumbnailSize: number = 120
): Promise<string> {
  const thumbCustomization = { ...customization, size: thumbnailSize, margin: 4 };
  const options = buildQROptions(data, thumbCustomization, 'canvas');
  const instance = new QRCodeStyling(options);

  const offscreen = document.createElement('div');
  offscreen.style.position = 'fixed';
  offscreen.style.left = '-9999px';
  offscreen.style.top = '-9999px';
  offscreen.style.visibility = 'hidden';
  document.body.appendChild(offscreen);

  try {
    instance.append(offscreen);
    const blob = await instance.getRawData('png');
    if (!blob) throw new Error('Failed to generate thumbnail');

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob as Blob);
    });
  } finally {
    document.body.removeChild(offscreen);
  }
}
