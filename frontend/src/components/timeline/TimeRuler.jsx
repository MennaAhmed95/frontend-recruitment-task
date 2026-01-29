import { useTimelineStore } from '@/stores/timelineStore'
import { secondsToPx } from '@/utils/timelineScale'
import { LABEL_WIDTH, TRACK_GAP } from '@/utils/timelineLayout'

export function TimeRuler() {
  const zoom = useTimelineStore((s) => s.zoom)
  const duration = useTimelineStore((s) => s.duration)
  const width = Math.max(800, secondsToPx(duration, zoom) + 200)

  const ticks = []
  const step = 5
  for (let s = 0; s <= duration; s += step) ticks.push(s)

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div
        className="flex h-8 items-end px-4"
        style={{ width: LABEL_WIDTH + TRACK_GAP + width }}
      >
        <div style={{ width: LABEL_WIDTH }} aria-hidden="true" />
        <div style={{ width: TRACK_GAP }} aria-hidden="true" />
        {ticks.map((s) => (
          <div
            key={s}
            className="relative h-full shrink-0"
            style={{ width: secondsToPx(step, zoom) }}
          >
            <div className="absolute bottom-1 left-0 h-2 w-px bg-slate-300" />
            <div className="absolute bottom-1 left-1 text-[10px] text-slate-500">
              {s}s
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

