import { cn } from "@/lib/utils";

export function Clip({
  clip,
  left,
  width,
  isSelected,
  isActive,
  isDragging,
  onSelect,
  onActivate,
  onMouseDown,
}) {
  return (
    <button
      data-clip={clip.id}
      className={cn(
        "absolute top-0 h-9 overflow-hidden rounded-md border px-2 text-left text-xs font-medium",
        "bg-white transition-all duration-100",
        "hover:bg-slate-50 hover:border-slate-400",
        isSelected && "border-slate-900 border-2 shadow-sm",
        !isSelected && "border-slate-300",
        isActive && "ring-2 ring-offset-1 ring-slate-400",
        isDragging &&
          "cursor-grabbing shadow-lg ring-2 ring-slate-500 bg-slate-100",
      )}
      style={{ left, width }}
      onMouseDown={(e) => {
        if (e.button !== 0) return; // Only left mouse button

        // 1. Clean event first
        e.stopPropagation();
        e.preventDefault();

        // 2. Select clip locally
        onSelect();

        // 3. Then call parent drag handler
        if (onMouseDown) {
          onMouseDown(e);
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      title={clip.data?.name || "Clip"}
    >
      <div className="truncate">{clip.data?.name || "Clip"}</div>
    </button>
  );
}
