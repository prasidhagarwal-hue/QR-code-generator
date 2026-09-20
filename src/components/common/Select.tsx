import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className = '', ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 py-2 text-sm
            bg-[var(--color-bg-primary)]
            text-[var(--color-text-primary)]
            border rounded-[var(--radius-md)]
            transition-colors duration-[var(--transition-fast)]
            focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-1 focus:ring-[var(--color-border-focus)]
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer appearance-none
            bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>')]
            bg-no-repeat bg-[right_12px_center]
            pr-8
            ${error
              ? 'border-[var(--color-danger)]'
              : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]'
            }
            ${className}
          `}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
