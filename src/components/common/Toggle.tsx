import { useId } from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ label, checked, onChange, disabled = false }: ToggleProps) {
  const id = useId();

  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={id}
        className={`text-xs font-medium ${
          disabled ? 'text-[var(--color-text-disabled)]' : 'text-[var(--color-text-secondary)]'
        } cursor-pointer select-none`}
      >
        {label}
      </label>
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer
          rounded-full border-2 border-transparent
          transition-colors duration-[var(--transition-fast)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2
          focus-visible:ring-offset-[var(--color-bg-secondary)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg-tertiary)]'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-4 w-4
            rounded-full bg-white shadow-[var(--shadow-sm)]
            transition-transform duration-[var(--transition-fast)]
            ${checked ? 'translate-x-4' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
