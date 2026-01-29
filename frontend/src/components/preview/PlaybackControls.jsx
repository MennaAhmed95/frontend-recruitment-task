import { Minus, Plus, Scissors } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTimelineStore } from "@/stores/timelineStore";
import { formatTime } from "@/utils/time";

export function PlaybackControls() {
  const time = useTimelineStore((s) => s.playhead);
  const duration = useTimelineStore((s) => s.duration);
  const zoom = useTimelineStore((s) => s.zoom);

  const setPlayhead = useTimelineStore((s) => s.actions.setPlayhead);
  const setZoom = useTimelineStore((s) => s.actions.setZoom);

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-2 md:flex-row md:items-center md:justify-between md:px-4">
      {/* Center: Time + Slider */}
      <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-1 md:items-center">
        <div className="tabular-nums text-center md:text-left">
          {formatTime(time)} / {formatTime(duration)}
        </div>

        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={time}
          onChange={(e) => setPlayhead(Number(e.target.value))}
          className="w-full md:w-56"
          aria-label="Playhead"
        />
      </div>

      {/* Right: Zoom */}
      <div className="flex items-center justify-between gap-2 text-sm text-slate-700 md:justify-end">
        <span className="hidden md:inline mr-1">Timeline Scale</span>

        <div className="flex gap-2">
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
    </div>
  );
}
