import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTimelineStore } from "@/stores/timelineStore";
import { TimeRuler } from "@/components/timeline/TimeRuler";
import { pxToSeconds, secondsToPx } from "@/utils/timelineScale";
import { CLIP_START, LABEL_WIDTH } from "@/utils/timelineLayout";
import { Track } from "@/components/timeline/Track";

export function Timeline() {
  const zoom = useTimelineStore((s) => s.zoom);
  const tracks = useTimelineStore((s) => s.tracks);
  const playhead = useTimelineStore((s) => s.playhead);
  const setPlayhead = useTimelineStore((s) => s.actions.setPlayhead);
  const hasSelection = useTimelineStore((s) => s.actions.hasSelection());
  const splitSelected = useTimelineStore(
    (s) => s.actions.splitSelectedClipAtMidpoint,
  );
  const deleteSelected = useTimelineStore((s) => s.actions.deleteSelectedClip);
  const addTrack = useTimelineStore((s) => s.actions.addTrack);
  const moveClip = useTimelineStore((s) => s.actions.moveClip);

  const [dragState, setDragState] = useState(null);

  useEffect(() => {
    if (!dragState) return;

    function onMove(e) {
      const dx = e.clientX - dragState.originX;
      const deltaSeconds = pxToSeconds(dx, zoom);
      const nextStart = dragState.originStartTime + deltaSeconds;
      moveClip(dragState.trackId, dragState.clipId, nextStart);
    }

    function onUp() {
      setDragState(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragState, moveClip, zoom]);

  return (
    <div className="border-t border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <Button size="sm" onClick={() => addTrack("video")}>
          + Add New Track
        </Button>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!hasSelection}
            onClick={splitSelected}
          >
            Split
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!hasSelection}
            onClick={deleteSelected}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="relative overflow-auto">
          <TimeRuler />

          <div className="relative pb-4">
            {/* playhead – aligned with clip area, 0s at CLIP_START */}
            <div
              className="pointer-events-none absolute top-0 z-10 h-full w-px bg-slate-900/70"
              style={{ left: `${CLIP_START + secondsToPx(playhead, zoom)}px` }}
            />

            {/* Track container with click-to-seek on empty space */}
            <div
              className="space-y-2 px-4 pt-2"
              onMouseDown={(e) => {
                // Only seek if clicking on empty space (not on a clip or button)
                const target = e.target;
                const isClip = target.closest("[data-clip]");
                const isButton = target.closest("button");

                if (!isClip && !isButton) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - (LABEL_WIDTH + 16 + 12);
                  const px = Math.max(0, x);
                  setPlayhead(pxToSeconds(px, zoom));
                }
              }}
            >
              {tracks.map((t) => (
                <Track
                  key={t.id}
                  track={t}
                  draggingClipId={dragState?.clipId}
                  onClipMouseDown={(clip, event) =>
                    setDragState({
                      trackId: t.id,
                      clipId: clip.id,
                      originX: event.clientX,
                      originStartTime: clip.startTime,
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
