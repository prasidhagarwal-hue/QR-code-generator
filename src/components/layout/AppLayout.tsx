import { Header } from './Header';
import { TypeSelector } from '@/components/editor/TypeSelector';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { CustomizationPanel } from '@/components/customization/CustomizationPanel';
import { HistoryPanel } from '@/components/history/HistoryPanel';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="
        flex-1 grid gap-4 p-4
        grid-cols-1
        lg:grid-cols-[320px_1fr_320px]
        xl:grid-cols-[360px_1fr_360px]
        max-w-[1600px] mx-auto w-full
      ">
        {/* ── Left: Editor Panel ────────────────────────────────────── */}
        <aside className="
          panel overflow-y-auto
          lg:max-h-[calc(100vh-72px)] lg:sticky lg:top-[72px]
          order-2 lg:order-1
        ">
          <div className="panel-section">
            <h2 className="section-title">QR Content</h2>
            <TypeSelector />
          </div>
          <div className="panel-section">
            <EditorPanel />
          </div>
        </aside>

        {/* ── Center: Preview Panel ─────────────────────────────────── */}
        <section className="order-1 lg:order-2">
          <PreviewPanel />

          {/* History — mobile (below preview) */}
          <div className="mt-4 lg:hidden">
            <div className="panel">
              <HistoryPanel />
            </div>
          </div>
        </section>

        {/* ── Right: Customization Panel ────────────────────────────── */}
        <aside className="
          panel overflow-y-auto
          lg:max-h-[calc(100vh-72px)] lg:sticky lg:top-[72px]
          order-3
        ">
          <CustomizationPanel />

          {/* History — desktop */}
          <div className="hidden lg:block">
            <HistoryPanel />
          </div>
        </aside>
      </main>
    </div>
  );
}
