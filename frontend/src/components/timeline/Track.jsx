import { useTimelineStore } from '@/stores/timelineStore'
import { secondsToPx } from '@/utils/timelineScale'
import { LABEL_WIDTH } from '@/utils/timelineLayout'
import { Clip } from '@/components/timeline/Clip'
import { Button } from '@/components/ui/button'

export function Track({ track, draggingClipId, onClipMouseDown }) {
  const zoom = useTimelineStore((s) => s.zoom)
  const duration = useTimelineStore((s) => s.duration)
  const width = Math.max(800, secondsToPx(duration, zoom) + 200)

  const selected = useTimelineStore((s) => s.selectedClipIds)
  const activeId = useTimelineStore((s) => s.activeClipId)
  const selectClip = useTimelineStore((s) => s.actions.selectClip)
  const activateClip = useTimelineStore((s) => s.actions.activateClip)
  const addClipToTrack = useTimelineStore((s) => s.actions.addClipToTrack)
  const deleteTrack = useTimelineStore((s) => s.actions.deleteTrack)

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `${LABEL_WIDTH}px 1fr`,
      }}
    >
      <div className="flex h-9 items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2 text-sm">
        <span className="truncate">{track.name}</span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addClipToTrack(track.id)}
          >
            + Clip
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => deleteTrack(track.id)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="relative h-9" style={{ width }}>
        {track.clips.map((c) => {
          const left = secondsToPx(c.startTime, zoom)
          const w = Math.max(8, secondsToPx(c.endTime - c.startTime, zoom))
          return (
            <Clip
              key={c.id}
              clip={c}
              left={left}
              width={w}
              isSelected={selected.includes(c.id)}
              isActive={activeId === c.id}
              isDragging={draggingClipId === c.id}
              onSelect={() => selectClip(c.id)}
              onActivate={() => activateClip(c.id)}
              onMouseDown={(event) => onClipMouseDown(c, event)}
            />
          )
        })}
      </div>
    </div>
  )
}

