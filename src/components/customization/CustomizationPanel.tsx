import { useCallback, useRef } from 'react';
import { useQRStore } from '@/store/qrStore';
import { PRESETS } from '@/constants/presets';
import { LIMITS } from '@/constants/defaults';
import { Slider, Select } from '@/components/common';
import type {
  DotStyle,
  CornerSquareStyle,
  CornerDotStyle,
  ErrorCorrectionLevel,
} from '@/types/qr';
import { RotateCcw, Upload, X } from 'lucide-react';

// ─── Color Picker ───────────────────────────────────────────────────

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="
              w-8 h-8 rounded-[var(--radius-sm)] cursor-pointer
              border border-[var(--color-border-secondary)]
              [&::-webkit-color-swatch-wrapper]:p-0.5
              [&::-webkit-color-swatch]:rounded-[3px]
              [&::-webkit-color-swatch]:border-none
            "
          />
        </div>
        <input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="
            w-20 px-2 py-1 text-xs font-mono
            bg-[var(--color-bg-primary)]
            text-[var(--color-text-primary)]
            border border-[var(--color-border-primary)]
            rounded-[var(--radius-sm)]
            focus:outline-none focus:border-[var(--color-border-focus)]
          "
          maxLength={7}
        />
      </div>
    </div>
  );
}

// ─── Preset Selector ────────────────────────────────────────────────

function PresetSelector() {
  const activePresetId = useQRStore((s) => s.activePresetId);
  const applyPreset = useQRStore((s) => s.applyPreset);

  return (
    <div className="grid grid-cols-2 gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => applyPreset(preset.id, preset.customization)}
          className={`
            flex flex-col items-center gap-1.5 p-3
            rounded-[var(--radius-md)] border
            transition-all duration-[var(--transition-fast)]
            cursor-pointer text-center
            ${
              activePresetId === preset.id
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] shadow-[var(--shadow-glow)]'
                : 'border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-bg-hover)]'
            }
          `}
        >
          <span className="text-lg">{preset.icon}</span>
          <span className="text-xs font-medium text-[var(--color-text-primary)]">
            {preset.name}
          </span>
          <span className="text-[10px] text-[var(--color-text-tertiary)] leading-tight">
            {preset.description}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Logo Uploader ──────────────────────────────────────────────────

function LogoUploader() {
  const customization = useQRStore((s) => s.customization);
  const updateCustomization = useQRStore((s) => s.updateCustomization);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUri = reader.result as string;
        updateCustomization({
          logo: {
            dataUri,
            size: 0.2,
            margin: 5,
            hideBackgroundDots: true,
          },
        });
      };
      reader.readAsDataURL(file);
    },
    [updateCustomization],
  );

  const removeLogo = useCallback(() => {
    updateCustomization({ logo: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [updateCustomization]);

  return (
    <div className="flex flex-col gap-2">
      {customization.logo ? (
        <div className="flex items-center gap-3">
          <img
            src={customization.logo.dataUri}
            alt="Logo preview"
            className="w-10 h-10 rounded-[var(--radius-sm)] object-cover border border-[var(--color-border-primary)]"
          />
          <div className="flex-1 text-xs text-[var(--color-text-secondary)]">Logo loaded</div>
          <button
            onClick={removeLogo}
            className="
              p-1.5 rounded-[var(--radius-sm)]
              text-[var(--color-text-tertiary)]
              hover:text-[var(--color-danger)]
              hover:bg-[var(--color-bg-hover)]
              transition-colors cursor-pointer
            "
            aria-label="Remove logo"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="
            flex items-center justify-center gap-2
            w-full py-3
            border border-dashed border-[var(--color-border-secondary)]
            rounded-[var(--radius-md)]
            text-xs text-[var(--color-text-tertiary)]
            hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
            hover:bg-[var(--color-accent-muted)]
            transition-all duration-[var(--transition-fast)]
            cursor-pointer
          "
        >
          <Upload size={14} />
          Upload Logo
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {customization.logo && (
        <Slider
          label="Logo Size"
          value={Math.round(customization.logo.size * 100)}
          min={10}
          max={40}
          step={5}
          unit="%"
          onChange={(v) =>
            updateCustomization({
              logo: { ...customization.logo!, size: v / 100 },
            })
          }
        />
      )}
    </div>
  );
}

// ─── Main Customization Panel ───────────────────────────────────────

export function CustomizationPanel() {
  const customization = useQRStore((s) => s.customization);
  const updateCustomization = useQRStore((s) => s.updateCustomization);
  const resetCustomization = useQRStore((s) => s.resetCustomization);

  return (
    <div className="flex flex-col">
      {/* Presets */}
      <div className="panel-section">
        <h2 className="section-title">Presets</h2>
        <PresetSelector />
      </div>

      {/* Colors */}
      <div className="panel-section">
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title mb-0">Colors</h2>
          <button
            onClick={resetCustomization}
            className="
              flex items-center gap-1 text-[10px]
              text-[var(--color-text-tertiary)]
              hover:text-[var(--color-text-primary)]
              transition-colors cursor-pointer
            "
            title="Reset to defaults"
          >
            <RotateCcw size={10} />
            Reset
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <ColorPicker
            label="Foreground"
            value={customization.foregroundColor}
            onChange={(color) => updateCustomization({ foregroundColor: color })}
          />
          <ColorPicker
            label="Background"
            value={customization.backgroundColor}
            onChange={(color) => updateCustomization({ backgroundColor: color })}
          />
        </div>
      </div>

      {/* Size & Margin */}
      <div className="panel-section">
        <h2 className="section-title">Size & Spacing</h2>
        <div className="flex flex-col gap-4">
          <Slider
            label="QR Size"
            value={customization.size}
            min={LIMITS.MIN_SIZE}
            max={LIMITS.MAX_SIZE}
            step={50}
            unit="px"
            onChange={(size) => updateCustomization({ size })}
          />
          <Slider
            label="Margin"
            value={customization.margin}
            min={LIMITS.MIN_MARGIN}
            max={LIMITS.MAX_MARGIN}
            step={2}
            unit="px"
            onChange={(margin) => updateCustomization({ margin })}
          />
        </div>
      </div>

      {/* Error Correction */}
      <div className="panel-section">
        <h2 className="section-title">Error Correction</h2>
        <Select
          value={customization.errorCorrection}
          onChange={(e) =>
            updateCustomization({ errorCorrection: e.target.value as ErrorCorrectionLevel })
          }
          options={[
            { value: 'L', label: 'Low (7% recovery)' },
            { value: 'M', label: 'Medium (15% recovery)' },
            { value: 'Q', label: 'Quartile (25% recovery)' },
            { value: 'H', label: 'High (30% recovery)' },
          ]}
        />
      </div>

      {/* Dot Style */}
      <div className="panel-section">
        <h2 className="section-title">Dot Style</h2>
        <Select
          value={customization.dotStyle}
          onChange={(e) => updateCustomization({ dotStyle: e.target.value as DotStyle })}
          options={[
            { value: 'square', label: 'Square' },
            { value: 'dots', label: 'Dots' },
            { value: 'rounded', label: 'Rounded' },
            { value: 'extra-rounded', label: 'Extra Rounded' },
            { value: 'classy', label: 'Classy' },
            { value: 'classy-rounded', label: 'Classy Rounded' },
          ]}
        />
      </div>

      {/* Corner Styles */}
      <div className="panel-section">
        <h2 className="section-title">Corner Styles</h2>
        <div className="flex flex-col gap-3">
          <Select
            label="Corner Square"
            value={customization.cornerSquareStyle}
            onChange={(e) =>
              updateCustomization({ cornerSquareStyle: e.target.value as CornerSquareStyle })
            }
            options={[
              { value: 'square', label: 'Square' },
              { value: 'dot', label: 'Dot' },
              { value: 'extra-rounded', label: 'Extra Rounded' },
            ]}
          />
          <Select
            label="Corner Dot"
            value={customization.cornerDotStyle}
            onChange={(e) =>
              updateCustomization({ cornerDotStyle: e.target.value as CornerDotStyle })
            }
            options={[
              { value: 'square', label: 'Square' },
              { value: 'dot', label: 'Dot' },
            ]}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="panel-section">
        <h2 className="section-title">Logo</h2>
        <LogoUploader />
      </div>
    </div>
  );
}
