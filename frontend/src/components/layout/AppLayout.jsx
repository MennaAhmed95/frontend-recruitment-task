import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { PreviewArea } from '@/components/preview/PreviewArea'
import { PlaybackControls } from '@/components/preview/PlaybackControls'
import { Timeline } from '@/components/timeline/Timeline'

export function AppLayout() {
  return (
    <div className="h-dvh w-full bg-slate-100 text-slate-900">
      <Header />

      <div className="grid h-[calc(100dvh-3rem)] grid-cols-[376px_1fr]">
        <Sidebar />

        <main className="flex min-w-0 flex-col">
          <div className="flex-1 p-4">
            <PreviewArea />
          </div>

          <div className="border-t border-slate-200 bg-white">
            <PlaybackControls />
            <Timeline />
          </div>
        </main>
      </div>
    </div>
  )
}

