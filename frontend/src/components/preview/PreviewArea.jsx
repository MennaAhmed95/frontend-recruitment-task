import { useTimelineStore } from '@/stores/timelineStore'

export function PreviewArea() {
  const activeClipId = useTimelineStore((s) => s.activeClipId)
  const selected = useTimelineStore((s) => s.selectedClipIds)
  const tracks = useTimelineStore((s) => s.tracks)

  const label = activeClipId
    ? findClipName(tracks, activeClipId)
    : selected[0]
      ? findClipName(tracks, selected[0])
      : null

  return (
    <div className="h-full">
      <div className="mx-auto flex aspect-video w-full max-w-4xl flex-col items-center justify-center gap-2 rounded-md border border-slate-300 bg-white">
        <div className="text-sm font-medium text-slate-500">PREVIEW AREA</div>
        <div className="text-xs text-slate-500">
          {label ? `Active: ${label}` : 'Select or activate a clip'}
        </div>
      </div>
    </div>
  )
}

function findClipName(tracks, clipId) {
  for (const t of tracks) {
    for (const c of t.clips) {
      if (c.id === clipId) return c.data?.name || 'Clip'
    }
  }
  return 'Clip'
}

