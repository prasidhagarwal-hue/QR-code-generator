import { type ReactNode } from 'react';

interface PanelPlaceholderProps {
  title: string;
  icon: ReactNode;
  description: string;
}

export function PanelPlaceholder({ title, icon, description }: PanelPlaceholderProps) {
  return (
    <div className="
      flex flex-col items-center justify-center
      h-full min-h-[200px]
      text-center px-6 py-8
    ">
      <div className="
        flex items-center justify-center
        w-12 h-12 mb-3 rounded-[var(--radius-lg)]
        bg-[var(--color-bg-tertiary)]
        text-[var(--color-text-tertiary)]
      ">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[var(--color-text-tertiary)] max-w-[200px]">
        {description}
      </p>
    </div>
  );
}
