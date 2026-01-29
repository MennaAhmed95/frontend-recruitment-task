import { useEffect, useState } from 'react'
import { LayoutGrid, StickyNote, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProjectsStore } from '@/stores/projectsStore'
import { useNotesStore } from '@/stores/notesStore'

export function Sidebar() {
  const [panel, setPanel] = useState('projects') // 'projects' | 'notes'

  return (
    <div className="grid h-full grid-cols-[56px_320px]">
      <aside className="border-r border-slate-200 bg-white">
        <div className="flex flex-col gap-1 p-2">
          <button
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100',
              panel === 'projects' && 'bg-slate-100 text-slate-900',
            )}
            onClick={() => setPanel('projects')}
            aria-label="Projects"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100',
              panel === 'notes' && 'bg-slate-100 text-slate-900',
            )}
            onClick={() => setPanel('notes')}
            aria-label="Notes"
          >
            <StickyNote className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <section className="bg-white">
        {panel === 'projects' ? <ProjectsPanel /> : <NotesPanel />}
      </section>
    </div>
  )
}

function ProjectsPanel() {
  const [name, setName] = useState('')

  const load = useProjectsStore((s) => s.actions.loadProjects)
  const createProject = useProjectsStore((s) => s.actions.createProject)
  const removeProject = useProjectsStore((s) => s.actions.deleteProject)
  const setActive = useProjectsStore((s) => s.actions.setActiveProject)

  const loading = useProjectsStore((s) => s.loading)
  const projects = useProjectsStore((s) => s.items)
  const activeId = useProjectsStore((s) => s.activeId)

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="flex h-full flex-col border-r border-slate-200">
      <div className="border-b border-slate-200 p-3">
        <div className="text-sm font-semibold">Projects</div>
        <div className="mt-2 flex gap-2">
          <input
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="New project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const n = name.trim()
              if (!n) return
              createProject(n)
              setName('')
            }}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="p-2 text-sm text-slate-500">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="p-2 text-sm text-slate-500">
            No projects yet. Create one.
          </div>
        ) : (
          <div className="space-y-1">
            {projects.map((p) => (
              <div
                key={p.id}
                className={cn(
                  'flex items-center justify-between rounded-md border px-2 py-2',
                  p.id === activeId
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-transparent hover:bg-slate-50',
                )}
              >
                <button
                  className="min-w-0 flex-1 truncate text-left text-sm"
                  onClick={() => setActive(p.id)}
                  title={p.data?.name || p.id}
                >
                  {p.data?.name || 'Untitled'}
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeProject(p.id)}
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotesPanel() {
  const [text, setText] = useState('')

  const projectId = useProjectsStore((s) => s.activeId)
  const notes = useNotesStore((s) => s.items)
  const loading = useNotesStore((s) => s.loading)

  const load = useNotesStore((s) => s.actions.loadNotesForActiveProject)
  const add = useNotesStore((s) => s.actions.addNote)
  const remove = useNotesStore((s) => s.actions.deleteNote)

  useEffect(() => {
    load()
  }, [load, projectId])

  return (
    <div className="flex h-full flex-col border-r border-slate-200">
      <div className="border-b border-slate-200 p-3">
        <div className="text-sm font-semibold">Notes</div>
        <div className="mt-2 flex gap-2">
          <input
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-400"
            placeholder={
              projectId ? 'Add a note for this project' : 'Select a project first'
            }
            value={text}
            disabled={!projectId}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            size="sm"
            variant="outline"
            disabled={!projectId}
            onClick={() => {
              const t = text.trim()
              if (!t) return
              add(t)
              setText('')
            }}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {!projectId ? (
          <div className="p-2 text-sm text-slate-500">
            Select a project to view its notes.
          </div>
        ) : loading ? (
          <div className="p-2 text-sm text-slate-500">Loading…</div>
        ) : notes.length === 0 ? (
          <div className="p-2 text-sm text-slate-500">No notes yet.</div>
        ) : (
          <div className="space-y-2">
            {notes.map((n) => (
              <div
                key={n.id}
                className="rounded-md border border-slate-200 bg-white p-2"
              >
                <div className="text-sm">{n.data?.text || ''}</div>
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => remove(n.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

