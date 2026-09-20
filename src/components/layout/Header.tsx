import { Moon, Sun, QrCode } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function Header() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="
      sticky top-0 z-50
      flex items-center justify-between
      px-4 sm:px-6 h-14
      bg-[var(--color-bg-secondary)]/80
      backdrop-blur-xl
      border-b border-[var(--color-border-primary)]
    ">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="
          flex items-center justify-center
          w-8 h-8 rounded-[var(--radius-md)]
          bg-[var(--color-accent)]
          text-white
        ">
          <QrCode size={18} strokeWidth={2.5} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
            QR Studio
          </h1>
          <span className="hidden sm:inline text-xs text-[var(--color-text-tertiary)] font-medium">
            Generator & Designer
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="
            flex items-center justify-center
            w-9 h-9 rounded-[var(--radius-md)]
            text-[var(--color-text-secondary)]
            hover:bg-[var(--color-bg-hover)]
            hover:text-[var(--color-text-primary)]
            transition-colors duration-[var(--transition-fast)]
            cursor-pointer
          "
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
