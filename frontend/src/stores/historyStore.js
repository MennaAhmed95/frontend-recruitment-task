import { create } from 'zustand'

import { useProjectsStore } from '@/stores/projectsStore'
import { useTimelineStore } from '@/stores/timelineStore'

const MAX_HISTORY = 50

export const useHistoryStore = create((set, get) => ({
  past: [],
  future: [],

  selectors: {
    canUndo() {
      return get().past.length > 0
    },
    canRedo() {
      return get().future.length > 0
    },
  },

  actions: {
    push(snapshot) {
      set((s) => ({
        past: [...s.past, snapshot].slice(-MAX_HISTORY),
        future: [],
      }))
    },

    undo() {
      const s = get()
      if (s.past.length === 0) return

      const current = snapshotNow()
      const prev = s.past[s.past.length - 1]

      applySnapshot(prev)
      set(() => ({
        past: s.past.slice(0, -1),
        future: [current, ...s.future].slice(0, MAX_HISTORY),
      }))
    },

    redo() {
      const s = get()
      if (s.future.length === 0) return

      const current = snapshotNow()
      const next = s.future[0]

      applySnapshot(next)
      set(() => ({
        past: [...s.past, current].slice(-MAX_HISTORY),
        future: s.future.slice(1),
      }))
    },
  },
}))

function snapshotNow() {
  return {
    activeId: useProjectsStore.getState().activeId,
    timeline: useTimelineStore.getState().actions.toEditor(),
  }
}

function applySnapshot(snapshot) {
  useProjectsStore.setState({ activeId: snapshot.activeId })
  useTimelineStore.getState().actions.loadFromEditor(snapshot.timeline)
}

