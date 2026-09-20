import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-3 py-2 text-sm
              bg-[var(--color-bg-primary)]
              text-[var(--color-text-primary)]
              border rounded-[var(--radius-md)]
              placeholder:text-[var(--color-text-disabled)]
              transition-colors duration-[var(--transition-fast)]
              focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-9' : ''}
              ${error
                ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
                : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]'
              }
              ${className}
            `}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[var(--color-danger)] flex items-center gap-1" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--color-text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
