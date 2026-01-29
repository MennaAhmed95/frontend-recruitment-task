import { Minus, Plus, Scissors } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useHistoryStore } from '@/stores/historyStore'
import { useTimelineStore } from '@/stores/timelineStore'
import { formatTime } from '@/utils/time'

export function PlaybackControls() {
  const time = useTimelineStore((s) => s.playhead)
  const duration = useTimelineStore((s) => s.duration)
  const zoom = useTimelineStore((s) => s.zoom)

  const setPlayhead = useTimelineStore((s) => s.actions.setPlayhead)
  const setZoom = useTimelineStore((s) => s.actions.setZoom)
  const split = useTimelineStore((s) => s.actions.splitActiveClipAtPlayhead)

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            useHistoryStore.getState().actions.push(snapshotNow())
            split()
          }}
        >
          <Scissors className="mr-2 h-4 w-4" />
          Split Clip
        </Button>
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-700">
        <div className="tabular-nums">
          {formatTime(time)} / {formatTime(duration)}
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={time}
          onChange={(e) => setPlayhead(Number(e.target.value))}
          className="w-56"
          aria-label="Playhead"
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-700">
        <span className="mr-1">Timeline Scale</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setZoom(Math.min(4, zoom + 0.25))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function snapshotNow() {
  return useTimelineStore.getState().actions.toEditor()
}

