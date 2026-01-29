import { Button } from '@/components/ui/button'
import { useHistoryStore } from '@/stores/historyStore'
import { useProjectsStore } from '@/stores/projectsStore'

export function Header() {
  const canUndo = useHistoryStore((s) => s.selectors.canUndo())
  const canRedo = useHistoryStore((s) => s.selectors.canRedo())
  const undo = useHistoryStore((s) => s.actions.undo)
  const redo = useHistoryStore((s) => s.actions.redo)

  const activeProject = useProjectsStore((s) => s.selectors.activeProject())
  const saving = useProjectsStore((s) => s.saving)
  const save = useProjectsStore((s) => s.actions.saveActiveProject)

  return (
    <header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" disabled={!canUndo} onClick={undo}>
          Undo
        </Button>
        <Button size="sm" variant="outline" disabled={!canRedo} onClick={redo}>
          Redo
        </Button>
      </div>

      <div className="text-sm font-medium text-slate-700">
        {activeProject?.data?.name || 'Design'}
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={saving || !activeProject}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </header>
  )
}

