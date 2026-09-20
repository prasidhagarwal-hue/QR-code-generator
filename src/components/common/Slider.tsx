import { type InputHTMLAttributes, useId } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  className = '',
  ...props
}: SliderProps) {
  const id = useId();
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
          <span className="text-xs font-mono text-[var(--color-text-tertiary)]">
            {value}{unit}
          </span>
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-[var(--color-bg-tertiary)]
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[var(--color-accent)]
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-[var(--color-bg-primary)]
          [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)]
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:duration-150
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[var(--color-accent)]
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-[var(--color-bg-primary)]
        "
        style={{
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, var(--color-bg-tertiary) ${percentage}%, var(--color-bg-tertiary) 100%)`,
        }}
        {...props}
      />
    </div>
  );
}
