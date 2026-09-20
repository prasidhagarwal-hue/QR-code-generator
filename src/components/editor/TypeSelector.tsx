import { QRType, QR_TYPE_LABELS } from '@/types/qr';
import { useQRStore } from '@/store/qrStore';
import { Link, Type, Mail, Phone, Wifi } from 'lucide-react';

const TYPE_ICONS: Record<QRType, React.ReactNode> = {
  [QRType.URL]: <Link size={14} />,
  [QRType.TEXT]: <Type size={14} />,
  [QRType.EMAIL]: <Mail size={14} />,
  [QRType.PHONE]: <Phone size={14} />,
  [QRType.WIFI]: <Wifi size={14} />,
};

const TYPES = Object.values(QRType);

export function TypeSelector() {
  const activeType = useQRStore((s) => s.activeType);
  const setActiveType = useQRStore((s) => s.setActiveType);

  return (
    <div className="flex flex-wrap gap-1.5">
      {TYPES.map((type) => (
        <button
          key={type}
          onClick={() => setActiveType(type)}
          className={`
            inline-flex items-center gap-1.5
            px-3 py-1.5 text-xs font-medium
            rounded-[var(--radius-md)]
            transition-all duration-[var(--transition-fast)]
            cursor-pointer select-none
            ${
              activeType === type
                ? 'bg-[var(--color-accent)] text-white shadow-[var(--shadow-sm)]'
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
            }
          `}
          aria-pressed={activeType === type}
        >
          {TYPE_ICONS[type]}
          {QR_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
