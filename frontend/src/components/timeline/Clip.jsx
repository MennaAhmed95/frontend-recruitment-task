import { cn } from '@/lib/utils'

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
      className={cn(
        'absolute top-0 h-9 overflow-hidden rounded-md border px-2 text-left text-xs',
        'bg-white hover:bg-slate-50',
        isSelected && 'border-slate-900',
        !isSelected && 'border-slate-300',
        isActive && 'ring-2 ring-slate-400',
        isDragging && 'cursor-grabbing shadow-lg ring-2 ring-slate-500',
      )}
      style={{ left, width }}
      onMouseDown={(e) => {
        if (onMouseDown) {
          onMouseDown(e)
        }
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onActivate()
      }}
      title={clip.data?.name || 'Clip'}
    >
      <div className="truncate">{clip.data?.name || 'Clip'}</div>
    </button>
  )
}

