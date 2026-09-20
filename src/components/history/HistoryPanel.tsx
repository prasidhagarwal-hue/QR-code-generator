import { useEffect } from 'react';
import { useQRStore } from '@/store/qrStore';
import { History, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import { QR_TYPE_LABELS } from '@/types/qr';

export function HistoryPanel() {
  const history = useQRStore((s) => s.history);
  const loadHistory = useQRStore((s) => s.loadHistory);
  const isHistoryLoading = useQRStore((s) => s.isHistoryLoading);
  const deleteFromHistory = useQRStore((s) => s.deleteFromHistory);
  const restoreHistoryEntry = useQRStore((s) => s.restoreHistoryEntry);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (isHistoryLoading) {
    return (
      <div className="panel-section">
        <h2 className="section-title">Recent Designs</h2>
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-6 h-6 border-2 border-[var(--color-border-primary)] border-t-[var(--color-accent)] rounded-full animate-spin mb-3" />
          <p className="text-xs text-[var(--color-text-tertiary)]">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-section">
      <h2 className="section-title">Recent Designs</h2>

      {history.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <History size={24} className="text-[var(--color-text-tertiary)] mb-2" />
          <p className="text-xs text-[var(--color-text-tertiary)]">
            History will appear here after downloading a QR code.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="
                group relative flex items-center gap-3 p-2
                rounded-[var(--radius-md)] border border-[var(--color-border-primary)]
                bg-[var(--color-bg-primary)]
                transition-all duration-[var(--transition-fast)]
                hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-sm)]
              "
            >
              {/* Thumbnail */}
              <div className="shrink-0 w-12 h-12 rounded-[var(--radius-sm)] bg-white overflow-hidden p-1 border border-[var(--color-border-primary)]">
                <img
                  src={entry.thumbnailDataUrl}
                  alt={`QR code preview for ${QR_TYPE_LABELS[entry.qrType]}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                    {QR_TYPE_LABELS[entry.qrType]}
                  </span>
                  {!entry.sensitiveDataStored && (
                    <span
                      title="Password not saved for privacy"
                      className="text-[var(--color-warning)]"
                    >
                      <AlertCircle size={10} />
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => restoreHistoryEntry(entry)}
                  className="
                    p-1.5 rounded-[var(--radius-sm)]
                    text-[var(--color-text-secondary)]
                    hover:bg-[var(--color-accent-muted)] hover:text-[var(--color-accent)]
                    transition-colors cursor-pointer
                  "
                  title="Restore this design"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => deleteFromHistory(entry.id)}
                  className="
                    p-1.5 rounded-[var(--radius-sm)]
                    text-[var(--color-text-secondary)]
                    hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]
                    transition-colors cursor-pointer
                  "
                  title="Delete this design"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
